/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const { encodeGG, decodeGG, encodeRaw, decodeRaw, isRawCode, isGGCode } = __webpack_require__(1);
const { encodeRocky, decodeRocky, isRockyCode } = __webpack_require__(2);

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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const LETTER_VALUES = 'APZLGITYEOXUKSVN';

function toDigit(letter) {
  return LETTER_VALUES.indexOf(letter);
}

function toLetter(digit) {
  return LETTER_VALUES.substr(digit, 1);
}

function isRawCode(code) {
  return !!code.match(/^([0-9a-fA-F]+)(\?[0-9a-fA-F]*)?:([0-9a-fA-F]+)$/) ||
    !!code.match(/^([0-9a-fA-F]+):([0-9a-fA-F]+)(\?[0-9a-fA-F]*)?$/);
}

function isGGCode(code) {
  return !!code.match(/^[APZLGITYEOXUKSVN]{6}([APZLGITYEOXUKSVN]{2})?$/i);
}

function decodeGG(code) {
  const digits = code.toUpperCase().split('').map(toDigit);

  let value = ((digits[0] & 8) << 4) + ((digits[1] & 7) << 4) + (digits[0] & 7);
  const address = ((digits[3] & 7) << 12) + ((digits[4] & 8) << 8) + ((digits[5] & 7) << 8) +
      ((digits[1] & 8) << 4) + ((digits[2] & 7) << 4) + (digits[3] & 8) + (digits[4] & 7);
  let key;

  if (digits.length === 8) {
    value += (digits[7] & 8);
    key = ((digits[6] & 8) << 4) + ((digits[7] & 7) << 4) + (digits[5] & 8) + (digits[6] & 7);
  } else {
    value += (digits[5] & 8);
  }
 
  const wantskey = !!(digits[2] >> 3);

  return { value, address, wantskey, key };
}

function encodeGG(address, value, key, wantskey) {
  let digits = Array(6);

  digits[0] = (value & 7) + ((value >> 4) & 8);
  digits[1] = ((value >> 4) & 7) + ((address >> 4) & 8);
  digits[2] = ((address >> 4) & 7);
  digits[3] = (address >> 12) + (address & 8);
  digits[4] = (address & 7) + ((address >> 8) & 8);
  digits[5] = ((address >> 8) & 7);

  if (key === undefined) {
    digits[5] += value & 8;
    if (wantskey) digits[2] += 8;
  } else {
    digits[2] += 8;
    digits[5] += key & 8;
    digits[6] = (key & 7) + ((key >> 4) & 8);
    digits[7] = ((key >> 4) & 7) + (value & 8);
  }

  const code = digits.map(toLetter).join('');

  return code;
}

function toHex(n, width) {
  const s = n.toString(16);
  return '0000'.substring(0, width - s.length) + s;
}

function encodeRaw(address, value, key, wantskey) {
  let s = toHex(address, 4);

  if (key !== undefined || wantskey) {
    s += '?';
  }

  if (key !== undefined) {
    s += toHex(key, 2);
  }

  s += ':' + toHex(value, 2);

  return s;
}

function decodeRaw(s) {
  // Conventional address?key:value
  let match = s.match(/^([0-9a-fA-F]+)(\?[0-9a-fA-F]*)?:([0-9a-fA-F]+)$/);
  if (match) {
    const address = parseInt(match[1], 16);
    const wantskey = match[2] !== undefined;
    const key = (match[2] !== undefined && match[2].length > 1) ? parseInt(match[2].substring(1), 16) : undefined;
    const value = parseInt(match[3], 16);

    return { value, address, wantskey, key };
  }

  // Non-standard but acceptable address:value?key
  match = s.match(/^([0-9a-fA-F]+):([0-9a-fA-F]+)(\?[0-9a-fA-F]*)?$/);
  if (match) {
    const address = parseInt(match[1], 16);
    const value = parseInt(match[2], 16);
    const wantskey = match[3] !== undefined;
    const key = (match[3] !== undefined && match[3].length > 1) ? parseInt(match[3].substring(1), 16) : undefined;

    return { value, address, wantskey, key };
  }

  return null;
}

module.exports = { encodeGG, decodeGG, encodeRaw, decodeRaw, isRawCode, isGGCode };



/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Snippets based on http://www.chrismcovell.com/CheatConverter.html - credit:
// "You may use snippits of this code in any program you want, if it is the game genie or pro action rockey decode or encode. Include this file with the program or put a thanks to Blue Hawk and this script title.
// Coded by Blue Hawk."

// Bit descrambling arrays
const rocky_shifts = [
	3,13,14,1,6,9,5,0,12,7,2,8,10,11,4,	// addr
	19,21,23,22,20,17,16,18,		// compare
	29,31,24,26,25,30,27,28			// replace
];


const rocky_key = 0x7e5ee93a;
const rocky_xor = 0x5c184b91;

function decodeRocky(s) {
  let encoded = parseInt(s, 16);
  encoded >>= 1;
  let key = rocky_key;
  let decoded = 0;
  let i = 31;
  while (i--) {
    if ((key ^ encoded) & 0x40000000) {
      decoded |= 1 << rocky_shifts[i];
      key ^= rocky_xor;
    }

    encoded <<= 1;
    key <<= 1;
  }

  const address = (decoded & 0x7fff);
  const compare = (decoded >> 16) & 0xff;
  const value   = (decoded >> 24) & 0xff;

  return { address, key: compare, value };
}

function toHex(n, width) {
  const s = n.toString(16);
  return '00000000'.substring(0, width - s.length) + s;
}

function encodeRocky(address, value, compare)
{
  if (compare === undefined || compare === null) return null;

  let decoded = address & 0x7fff;
  decoded |= compare << 16;
  decoded |= value << 24;

  let key = rocky_key;
  let encoded = new Uint32Array(1);
  let i = 31;
  while (i--) {
    const bit = decoded >> rocky_shifts[i];

    if (((key >> 30) ^ bit) & 1) {
      encoded[0] |= 2 << i;
    }

    if (bit & 1) {
      key ^= rocky_xor;
    }

    key <<= 1;
  }

  return toHex(encoded[0], 8).toUpperCase();
}

function isRockyCode(code) {
  return !!code.match(/^[0-9A-F]{8}$/);
}

module.exports = { decodeRocky, encodeRocky, isRockyCode };


/***/ })
/******/ ]);