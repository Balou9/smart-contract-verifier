const https = require('https');
const fs = require('fs').promises;

async function main(contractAddress, contractSourceCodeUrl) {

  const sourceCode = await fs.readFile(contractSourceCodeUrl, 'utf8');

  console.log('File content:', sourceCode);

    const data = JSON.stringify({
        address: contractAddress,
        sourceCode,
        chain: 'sepolia',
    });
    
    const options = {
        hostname: 'api.sourcify.dev',
        port: 443,
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
          const result = JSON.parse(d.toString());
          if (result.status === 'success') {
            console.log('Verification successful!', result);
          } else {
            console.error('Verification failed:', result.message);
          }
        });
      });
    
      req.on('error', (error) => {
        console.error(error);
      });
    
      req.write(data);
      req.end();
}

// main("0x48Cc1a4e8994473C1f511A95c167698061Bad8Df", "SafeMPECDH.sol")
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

module.exports = main;