const test = require('tape');
const smart_contract_verifier = require('./index.js')

test('test local smart contract verification', async function (t) {
    const mpecdh_adress = "0x48Cc1a4e8994473C1f511A95c167698061Bad8Df"
    const mpecdh_url = "SafeMPECDH.sol"
    const vrfr_payload = await smart_contract_verifier(mpecdh_adress, mpecdh_url)
    console.log(vrfr_payload)
    t.ok(vrfr_payload, "is truthy")
    t.end()
})

test('test github source code smart contract verification', async function (t) {
    const mpecdh_adress = "0x48Cc1a4e8994473C1f511A95c167698061Bad8Df"
    const github_contract_url = "https://raw.githubusercontent.com/Balou9/smart-contract-verifier/main/SafeMPECDH.sol"
    const vrfr_payload = await smart_contract_verifier(mpecdh_adress, github_contract_url)
    console.log(vrfr_payload)
    t.ok(vrfr_payload, "is thruthy")
    t.end()
})