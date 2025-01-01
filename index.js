const https = require('https');
const fs = require('fs').promises;
const path = require('path');

function isValidChainId (chainId) {
  const url = 'https://sourcify.dev/server/chains';

  https.get(url, (res) => {
    console.log(`statusCode: ${res.statusCode}`);
    console.log(`headers: ${JSON.stringify(res.headers)}`);

    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        console.log(parsedData);
      } catch (error) {
        console.error(error.message);
      }
    });
  }).on('error', (error) => {
    console.error(error);
  });
}

async function verify(chainId, contractAddress, contractSourceCodeUrl, contractMetadata) {

  // if contractMetadata is not json dann

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
            "metadata.json": contractMetadata,
            [solFileName]: sourceCode
      }
  });
  
  const options = {
      hostname: 'staging.sourcify.dev/server',
      path: '/verify',
      method: 'POST',
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
          // const response = JSON.parse(responseBody); //
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
  verify,
  isValidChainId
};