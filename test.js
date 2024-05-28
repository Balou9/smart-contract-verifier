const test = require('tape');
const smart_contract_verifier = require('./index.js')
const mpecdh_adress = "0x48Cc1a4e8994473C1f511A95c167698061Bad8Df"

test('test - Local smart contract verification', async function (t) {
    const mpecdh_url = "SafeMPECDH.sol"
    const vrfr_payload = await smart_contract_verifier("11155111", mpecdh_adress, mpecdh_url)
    console.log(vrfr_payload)
    t.ok(vrfr_payload, "is truthy")
    t.end()
})

test('test - Github source code smart contract verification', async function (t) {
    const github_contract_url = "https://raw.githubusercontent.com/Balou9/smart-contract-verifier/main/SafeMPECDH.sol"
    const vrfr_payload = await smart_contract_verifier("11155111", mpecdh_adress, github_contract_url)
    console.log(vrfr_payload)
    t.ok(vrfr_payload, "is thruthy")
    t.end()
})

test('test - Ensures function throws appropriate error when given a non-solidity file', async function (t) {
    const non_solfile_url = "./fixtures/noop.txt"
    const expectedErrorMessage = `${non_solfile_url} is not a solidity file.`
  
    try {
      await smart_contract_verifier("11155111", mpecdh_adress, non_solfile_url)
      t.fail("Expected an error to be thrown")
    } catch (error) {
      t.ok(error instanceof Error, "Error is thrown")
      t.equal(error.message, expectedErrorMessage, `Promts correct error message: ${expectedErrorMessage}`)
    }
    t.end()    
})