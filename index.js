const https = require('https');
const fs = require('fs').promises;

async function main(contractAddress, contractSourceCodeUrl) {
  const sourceCode = await fs.readFile(contractSourceCodeUrl, 'utf8');
  console.log('File content:', sourceCode);

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

    const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);
    
        res.on('data', (d) => {
          if (d) {
            console.log('Verification successful!', d);
          }
        });
      });
    
      req.on('error', (error) => {
        console.error(error);
      });
    
      req.write(data);
      req.end();
}

module.exports = main;