import test from 'tape';
import fs from 'fs';
import { verify, isValidChainId } from './index.js';
const mpecdh_adress = "0x48Cc1a4e8994473C1f511A95c167698061Bad8Df"
const mpecdh_metadata_content = fs.readFile("./fixtures/metadata/MPECDHmetadata.json")
const mpecdh_metadata_json = JSON.parse(mpecdh_metadata_content);

test('test - Local smart contract verification', async function (t) {
    const mpecdh_url = "./fixtures/SafeMPECDH.sol"

    try {
      const vrfr_payload = await verify("1", mpecdh_adress, mpecdh_url, mpecdh_metadata_json)
      console.log(vrfr_payload)
      t.ok(vrfr_payload, "is truthy")
      t.equal(vrfr_payload.statusCode, 200, "response status code equals 200")
    } catch (error) {
      t.fail(error)
    }

    t.end()
})

test('test - Github source code smart contract verification - Ethereum Testnet Sepolia', async function (t) {
    const github_contract_url = "https://raw.githubusercontent.com/Balou9/smart-contract-verifier/main/SafeMPECDH.sol"
    const vrfr_payload = await verify("11155111", mpecdh_adress, github_contract_url, mpecdh_metadata_json)
    console.log(vrfr_payload)
    t.ok(vrfr_payload, "is thruthy")
    t.equals(vrfr_payload.statusCode, 200, "response status code equals 200")
    t.end()
})

test('test - Github source code smart contract verification - Ethereum Mainnet', async function (t) {
  const github_contract_url = "https://raw.githubusercontent.com/Balou9/smart-contract-verifier/main/SafeMPECDH.sol"
  const vrfr_payload = await verify("1", mpecdh_adress, github_contract_url, mpecdh_metadata_json)
  console.log(vrfr_payload)
  t.ok(vrfr_payload, "is thruthy")
  t.equals(vrfr_payload.statusCode, 200, "response status code equals 200")
  t.end()
})

test('test - Github source code smart contract verification - Gnosis', async function (t) {
  const github_contract_url = "https://raw.githubusercontent.com/Balou9/smart-contract-verifier/main/SafeMPECDH.sol"
  const vrfr_payload = await verify("100", mpecdh_adress, github_contract_url, mpecdh_metadata_json)
  console.log(vrfr_payload)
  t.ok(vrfr_payload, "is thruthy")
  t.equals(vrfr_payload.statusCode, 200, "response status code equals 200")
  t.end()
})

test('test - Ensures function throws appropriate error when given a non-solidity file', async function (t) {
    const non_solfile_url = "./fixtures/noop.txt"
    const expectedErrorMessage = `${non_solfile_url} is not a solidity file.`
  
    try {
      await verify("11155111", mpecdh_adress, non_solfile_url, mpecdh_metadata_json)
      t.fail("expected an error to be thrown")
    } catch (error) {
      t.ok(error instanceof Error, "error is thrown")
      t.equal(error.message, expectedErrorMessage, `prompts correct error message: ${expectedErrorMessage}`)
    }
    t.end()    
})

// test('test - Github source code smart contract verification - invalid chain id', async function (t) {
//   const github_contract_url = "https://raw.githubusercontent.com/Balou9/smart-contract-verifier/main/SafeMPECDH.sol"
//   // const vrfr_payload = await verify("100", mpecdh_adress, github_contract_url)
//   try {
//     await verify('invalid-chain', mpecdh_adress, github_contract_url);
//     t.fail('Expected error for invalid VRFR code');
//   } catch (error) {
//     t.ok(error.message); // More informative assertion
//   }
//   t.ok(isValidChainId("100"));
//   t.end();
// })

// getSourcifyChainId
// add error handling/tests if the given chainId is not supported for contract verification