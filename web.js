'use strict';

const { encode, decode, encodeHex, decodeHex } = require('nes-game-genie');

const textarea = document.createElement('textarea');

textarea.value = 'SLXPLOVS';

textarea.cols = 10;
textarea.rows = 10;

const output = document.createElement('p');

function update() {
  output.innerHTML = '';

  for (let input of textarea.value.split('\n')) {
    const decoded = decode(input);

    let outputLine;

    if (decoded) {
      const gg = encode(decoded.address, decoded.value, decoded.key, decoded.wantskey);
      const hex = encodeHex(decoded.address, decoded.value, decoded.key, decoded.wantskey);

      outputLine = `${input} = ${gg} ${hex}`;
    } else {
      outputLine = `${input} invalid`;
    }

    output.appendChild(document.createTextNode(outputLine));
    output.appendChild(document.createElement('br'));
  }
}

document.body.addEventListener('keyup', update);
update();

const div = document.createElement('div');
div.appendChild(textarea);
div.appendChild(output);

document.body.appendChild(div);