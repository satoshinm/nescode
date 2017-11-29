#!/usr/bin/env node
'use strict';

const { encodeGG, decodeGG, encodeRaw, decodeRaw, isRawCode, isGGCode } = require('nes-game-genie');
const { encodeRocky, decodeRocky, isRockyCode } = require('famicom-pro-action-rocky');

if (process.argv.length < 3) {
  process.stderr.write(`NES Game Genie encoder/decoder
Usage: node cli.js code

code: a Game Genie code or hex code
`);
  process.exit(1);
}

const code = process.argv.slice(2)[0];
process.stdout.write(`Input:       ${code}\n\n`);

let decoded;

if (isRawCode(code)) {
  decoded = decodeRaw(code);
} else if (isGGCode(code)) {
  decoded = decodeGG(code);
} else if (isRockyCode(code)) {
  decoded = decodeRocky(code);
} else {
  process.stdout.write(`Unrecognized code format: ${code}\n`);
  process.exit(1);
}

//console.log(decoded);
process.stdout.write(`Address:     ${decoded.address.toString(16)}\n`);
if (decoded.key !== undefined) {
  process.stdout.write(`Key:         ${decoded.key.toString(16)}\n`);
}
process.stdout.write(`Wantskey:    ${decoded.wantskey}\n`);
process.stdout.write(`Value:       ${decoded.value.toString(16)}\n`);
process.stdout.write(`\n`);

const hexCode = encodeRaw(decoded.address, decoded.value, decoded.key, decoded.wantskey);
process.stdout.write(`Raw code:    ${hexCode}\n`);

const frCode = encodeRocky(decoded.address, decoded.value, decoded.key);
process.stdout.write(`Rocky code:  ${frCode}\n`);

const ggCode = encodeGG(decoded.address, decoded.value, decoded.key, decoded.wantskey);
process.stdout.write(`Game Genie:  ${ggCode}\n`);
