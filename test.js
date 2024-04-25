const test = require('tape');
const mpecdh_vrfr = require('./index.js')
const mpecdh_adress = "0x48Cc1a4e8994473C1f511A95c167698061Bad8Df"

test('test if mpecdh_vrfr is ...', async function (t) {
    const vrfr_payload = await mpecdh_vrfr(mpecdh_adress)
    console.log(vrfr_payload)
    t.ok(vrfr_payload, "is truthy")
})