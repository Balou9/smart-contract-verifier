const https = require('https');
const fs = require('fs').promises;

async function main(contractAddress, contractSourceCodeUrl) {
  const sourceCode = await fs.readFile(contractSourceCodeUrl, 'utf8');
  // console.log('File content:', sourceCode);

    const data = JSON.stringify({
        address: contractAddress,
        chain: "11155111",
        files: {
              "metadata.json": "{}",
              "SafeMPECDH.sol": sourceCode
            },
        creatorTxHash: "string",
        chosenContract: "string"
    });
    
    const options = {
        hostname: 'staging.sourcify.dev',
        path: '/verify',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);

        let responseBody = '';
        res.on('data', (d) => {
          responseBody += d.toString();
        });

        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const response = JSON.parse(responseBody);
              resolve(response)
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

module.exports = main;