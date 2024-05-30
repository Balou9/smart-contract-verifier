const https = require('https');
const fs = require('fs').promises;
const path = require('path');

async function verify(chainId, contractAddress, contractSourceCodeUrl) {
  if (!contractSourceCodeUrl.endsWith(".sol")) {
    throw(new Error(`${contractSourceCodeUrl} is not a solidity file.`))
  }

  if (contractSourceCodeUrl.startsWith("https://raw.githubusercontent.com/")) {
    var sourceCode = await fetch(contractSourceCodeUrl)
      .then((response) => response.text());
  } else {
    var sourceCode = await fs.readFile(contractSourceCodeUrl, 'utf8');
  }

  const solFileName = path.basename(contractSourceCodeUrl)

  const data = JSON.stringify({
      address: contractAddress,
      chain: chainId,
      files: {
            "metadata.json": "{...}",
            [solFileName]: sourceCode
      },
      creatorTxHash: "string",
      chosenContract: "string"
  });
  
  const options = {
      hostname: 'staging.sourcify.dev',
      path: '/verify',
      method: 'POST', // ? docs: POST https://docs.sourcify.dev/docs/api/#/Stateless%20Verification/post_verify
      headers: {
        'Accept': 'application/json',
        'Content-Length': data.length,
      },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
    if (res.statusCode !== 200) {
      throw(new Error(`statusCode: ${res.statusCode}`))
    }
    let responseBody = '';
    res.on('data', (d) => {
      responseBody += d.toString();
    });
    res.on('end', () => {
      try {
        if (res.statusCode === 200) {
          const response = responseBody
          // const response = JSON.parse(responseBody); // ?
          resolve({
            statusCode: res.statusCode,
            response: response
          });
        } else {
          reject(new Error(`Verification failed: ${responseBody}`))
        }
      } catch (error) {
        reject(error)
      }
    });
  });

  req.on('error', reject);
  req.write(data);
  req.end();
  });
}

module.exports = {
  verify
};