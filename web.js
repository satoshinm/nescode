'use strict';

const { encodeGG, decodeGG, encodeRaw, decodeRaw, isRawCode, isGGCode } = require('nes-game-genie');
const { encodeRocky, decodeRocky, isRockyCode } = require('famicom-pro-action-rocky');

const textarea = document.createElement('textarea');

textarea.value = 'SLXPLOVS';

textarea.cols = 10;
textarea.rows = 10;

const output = document.createElement('p');

function update() {
  output.innerHTML = '';

  const table = document.createElement('table');
  const headerRow = document.createElement('tr');

  for (const header of ['Input', 'Raw', 'Rocky', 'Game Genie']) {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  for (let input of textarea.value.split('\n')) {
    let decoded;

    if (isRawCode(input)) {
      decoded = decodeRaw(input);
    } else if (isGGCode(input)) {
      decoded = decodeGG(input);
    } else if (isRockyCode(input)) {
      decoded = decodeRocky(input);
    }

    let columns;

    if (decoded) {
      const gg = encodeGG(decoded.address, decoded.value, decoded.key, decoded.wantskey);
      const raw = encodeRaw(decoded.address, decoded.value, decoded.key, decoded.wantskey);
      const rocky = encodeRocky(decoded.address, decoded.value, decoded.key);

      columns = [input, raw, rocky, gg];
    } else {
      columns = [input, 'invalid', '', ''];
    }

    const row = document.createElement('tr');
    for (const data of columns) {
      const td = document.createElement('td');
      td.textContent = data;
      row.appendChild(td);
    }
    table.appendChild(row);
  }

  output.appendChild(table);
}

document.body.addEventListener('keyup', update);
update();

const div = document.createElement('div');
div.appendChild(textarea);
div.appendChild(output);

document.body.appendChild(div);
