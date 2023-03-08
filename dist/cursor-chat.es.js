var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var style = "";
const create$5 = () => /* @__PURE__ */ new Map();
const copy = (m) => {
  const r = create$5();
  m.forEach((v, k) => {
    r.set(k, v);
  });
  return r;
};
const setIfUndefined = (map2, key, createT) => {
  let set = map2.get(key);
  if (set === void 0) {
    map2.set(key, set = createT());
  }
  return set;
};
const map = (m, f) => {
  const res = [];
  for (const [key, value] of m) {
    res.push(f(value, key));
  }
  return res;
};
const any = (m, f) => {
  for (const [key, value] of m) {
    if (f(value, key)) {
      return true;
    }
  }
  return false;
};
const create$4 = () => /* @__PURE__ */ new Set();
const last = (arr) => arr[arr.length - 1];
const appendTo = (dest, src) => {
  for (let i = 0; i < src.length; i++) {
    dest.push(src[i]);
  }
};
const from = Array.from;
const isArray = Array.isArray;
class Observable {
  constructor() {
    this._observers = create$5();
  }
  on(name, f) {
    setIfUndefined(this._observers, name, create$4).add(f);
  }
  once(name, f) {
    const _f = (...args) => {
      this.off(name, _f);
      f(...args);
    };
    this.on(name, _f);
  }
  off(name, f) {
    const observers = this._observers.get(name);
    if (observers !== void 0) {
      observers.delete(f);
      if (observers.size === 0) {
        this._observers.delete(name);
      }
    }
  }
  emit(name, args) {
    return from((this._observers.get(name) || create$5()).values()).forEach((f) => f(...args));
  }
  destroy() {
    this._observers = create$5();
  }
}
const floor = Math.floor;
const abs = Math.abs;
const log10 = Math.log10;
const min = (a, b) => a < b ? a : b;
const max = (a, b) => a > b ? a : b;
const isNegativeZero = (n) => n !== 0 ? n < 0 : 1 / n < 0;
const fromCharCode = String.fromCharCode;
const toLowerCase = (s) => s.toLowerCase();
const trimLeftRegex = /^\s*/g;
const trimLeft = (s) => s.replace(trimLeftRegex, "");
const fromCamelCaseRegex = /([A-Z])/g;
const fromCamelCase = (s, separator) => trimLeft(s.replace(fromCamelCaseRegex, (match) => `${separator}${toLowerCase(match)}`));
const _encodeUtf8Polyfill = (str) => {
  const encodedString = unescape(encodeURIComponent(str));
  const len = encodedString.length;
  const buf = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    buf[i] = encodedString.codePointAt(i);
  }
  return buf;
};
const utf8TextEncoder = typeof TextEncoder !== "undefined" ? new TextEncoder() : null;
const _encodeUtf8Native = (str) => utf8TextEncoder.encode(str);
const encodeUtf8 = utf8TextEncoder ? _encodeUtf8Native : _encodeUtf8Polyfill;
let utf8TextDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
if (utf8TextDecoder && utf8TextDecoder.decode(new Uint8Array()).length === 1) {
  utf8TextDecoder = null;
}
const undefinedToNull = (v) => v === void 0 ? null : v;
class VarStoragePolyfill {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  setItem(key, newValue) {
    this.map.set(key, newValue);
  }
  getItem(key) {
    return this.map.get(key);
  }
}
let _localStorage = new VarStoragePolyfill();
let usePolyfill = true;
try {
  if (typeof localStorage !== "undefined") {
    _localStorage = localStorage;
    usePolyfill = false;
  }
} catch (e) {
}
const varStorage = _localStorage;
const onChange = (eventHandler) => usePolyfill || addEventListener("storage", eventHandler);
const keys = Object.keys;
const length$1 = (obj) => keys(obj).length;
const every = (obj, f) => {
  for (const key in obj) {
    if (!f(obj[key], key)) {
      return false;
    }
  }
  return true;
};
const hasProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const equalFlat = (a, b) => a === b || length$1(a) === length$1(b) && every(a, (val, key) => (val !== void 0 || hasProperty(b, key)) && b[key] === val);
const callAll = (fs, args, i = 0) => {
  try {
    for (; i < fs.length; i++) {
      fs[i](...args);
    }
  } finally {
    if (i < fs.length) {
      callAll(fs, args, i + 1);
    }
  }
};
const nop = () => {
};
const equalityStrict = (a, b) => a === b;
const equalityDeep = (a, b) => {
  if (a == null || b == null) {
    return equalityStrict(a, b);
  }
  if (a.constructor !== b.constructor) {
    return false;
  }
  if (a === b) {
    return true;
  }
  switch (a.constructor) {
    case ArrayBuffer:
      a = new Uint8Array(a);
      b = new Uint8Array(b);
    case Uint8Array: {
      if (a.byteLength !== b.byteLength) {
        return false;
      }
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      break;
    }
    case Set: {
      if (a.size !== b.size) {
        return false;
      }
      for (const value of a) {
        if (!b.has(value)) {
          return false;
        }
      }
      break;
    }
    case Map: {
      if (a.size !== b.size) {
        return false;
      }
      for (const key of a.keys()) {
        if (!b.has(key) || !equalityDeep(a.get(key), b.get(key))) {
          return false;
        }
      }
      break;
    }
    case Object:
      if (length$1(a) !== length$1(b)) {
        return false;
      }
      for (const key in a) {
        if (!hasProperty(a, key) || !equalityDeep(a[key], b[key])) {
          return false;
        }
      }
      break;
    case Array:
      if (a.length !== b.length) {
        return false;
      }
      for (let i = 0; i < a.length; i++) {
        if (!equalityDeep(a[i], b[i])) {
          return false;
        }
      }
      break;
    default:
      return false;
  }
  return true;
};
const isOneOf = (value, options) => options.includes(value);
const isNode = typeof process !== "undefined" && process.release && /node|io\.js/.test(process.release.name);
const isBrowser = typeof window !== "undefined" && !isNode;
typeof navigator !== "undefined" ? /Mac/.test(navigator.platform) : false;
let params;
const computeParams = () => {
  if (params === void 0) {
    if (isNode) {
      params = create$5();
      const pargs = process.argv;
      let currParamName = null;
      for (let i = 0; i < pargs.length; i++) {
        const parg = pargs[i];
        if (parg[0] === "-") {
          if (currParamName !== null) {
            params.set(currParamName, "");
          }
          currParamName = parg;
        } else {
          if (currParamName !== null) {
            params.set(currParamName, parg);
            currParamName = null;
          }
        }
      }
      if (currParamName !== null) {
        params.set(currParamName, "");
      }
    } else if (typeof location === "object") {
      params = create$5();
      (location.search || "?").slice(1).split("&").forEach((kv) => {
        if (kv.length !== 0) {
          const [key, value] = kv.split("=");
          params.set(`--${fromCamelCase(key, "-")}`, value);
          params.set(`-${fromCamelCase(key, "-")}`, value);
        }
      });
    } else {
      params = create$5();
    }
  }
  return params;
};
const hasParam = (name) => computeParams().has(name);
const getVariable = (name) => isNode ? undefinedToNull(process.env[name.toUpperCase()]) : undefinedToNull(varStorage.getItem(name));
const hasConf = (name) => hasParam("--" + name) || getVariable(name) !== null;
hasConf("production");
const forceColor = isNode && isOneOf({}.FORCE_COLOR, ["true", "1", "2"]);
const supportsColor = !hasParam("no-colors") && (!isNode || process.stdout.isTTY || forceColor) && (!isNode || hasParam("color") || forceColor || getVariable("COLORTERM") !== null || (getVariable("TERM") || "").includes("color"));
const BIT1 = 1;
const BIT2 = 2;
const BIT3 = 4;
const BIT4 = 8;
const BIT6 = 32;
const BIT7 = 64;
const BIT8 = 128;
const BITS5 = 31;
const BITS6 = 63;
const BITS7 = 127;
const BITS31 = 2147483647;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
const isInteger = Number.isInteger || ((num) => typeof num === "number" && isFinite(num) && floor(num) === num);
const create$3 = (s) => new Error(s);
const methodUnimplemented = () => {
  throw create$3("Method unimplemented");
};
const unexpectedCase = () => {
  throw create$3("Unexpected case");
};
const errorUnexpectedEndOfArray = create$3("Unexpected end of array");
const errorIntegerOutOfRange = create$3("Integer out of Range");
class Decoder {
  constructor(uint8Array) {
    this.arr = uint8Array;
    this.pos = 0;
  }
}
const createDecoder = (uint8Array) => new Decoder(uint8Array);
const hasContent = (decoder) => decoder.pos !== decoder.arr.length;
const readUint8Array = (decoder, len) => {
  const view = createUint8ArrayViewFromArrayBuffer(decoder.arr.buffer, decoder.pos + decoder.arr.byteOffset, len);
  decoder.pos += len;
  return view;
};
const readVarUint8Array = (decoder) => readUint8Array(decoder, readVarUint(decoder));
const readUint8 = (decoder) => decoder.arr[decoder.pos++];
const readVarUint = (decoder) => {
  let num = 0;
  let mult = 1;
  const len = decoder.arr.length;
  while (decoder.pos < len) {
    const r = decoder.arr[decoder.pos++];
    num = num + (r & BITS7) * mult;
    mult *= 128;
    if (r < BIT8) {
      return num;
    }
    if (num > MAX_SAFE_INTEGER) {
      throw errorIntegerOutOfRange;
    }
  }
  throw errorUnexpectedEndOfArray;
};
const readVarInt = (decoder) => {
  let r = decoder.arr[decoder.pos++];
  let num = r & BITS6;
  let mult = 64;
  const sign = (r & BIT7) > 0 ? -1 : 1;
  if ((r & BIT8) === 0) {
    return sign * num;
  }
  const len = decoder.arr.length;
  while (decoder.pos < len) {
    r = decoder.arr[decoder.pos++];
    num = num + (r & BITS7) * mult;
    mult *= 128;
    if (r < BIT8) {
      return sign * num;
    }
    if (num > MAX_SAFE_INTEGER) {
      throw errorIntegerOutOfRange;
    }
  }
  throw errorUnexpectedEndOfArray;
};
const _readVarStringPolyfill = (decoder) => {
  let remainingLen = readVarUint(decoder);
  if (remainingLen === 0) {
    return "";
  } else {
    let encodedString = String.fromCodePoint(readUint8(decoder));
    if (--remainingLen < 100) {
      while (remainingLen--) {
        encodedString += String.fromCodePoint(readUint8(decoder));
      }
    } else {
      while (remainingLen > 0) {
        const nextLen = remainingLen < 1e4 ? remainingLen : 1e4;
        const bytes = decoder.arr.subarray(decoder.pos, decoder.pos + nextLen);
        decoder.pos += nextLen;
        encodedString += String.fromCodePoint.apply(null, bytes);
        remainingLen -= nextLen;
      }
    }
    return decodeURIComponent(escape(encodedString));
  }
};
const _readVarStringNative = (decoder) => utf8TextDecoder.decode(readVarUint8Array(decoder));
const readVarString = utf8TextDecoder ? _readVarStringNative : _readVarStringPolyfill;
const readFromDataView = (decoder, len) => {
  const dv = new DataView(decoder.arr.buffer, decoder.arr.byteOffset + decoder.pos, len);
  decoder.pos += len;
  return dv;
};
const readFloat32 = (decoder) => readFromDataView(decoder, 4).getFloat32(0, false);
const readFloat64 = (decoder) => readFromDataView(decoder, 8).getFloat64(0, false);
const readBigInt64 = (decoder) => readFromDataView(decoder, 8).getBigInt64(0, false);
const readAnyLookupTable = [
  (decoder) => void 0,
  (decoder) => null,
  readVarInt,
  readFloat32,
  readFloat64,
  readBigInt64,
  (decoder) => false,
  (decoder) => true,
  readVarString,
  (decoder) => {
    const len = readVarUint(decoder);
    const obj = {};
    for (let i = 0; i < len; i++) {
      const key = readVarString(decoder);
      obj[key] = readAny(decoder);
    }
    return obj;
  },
  (decoder) => {
    const len = readVarUint(decoder);
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(readAny(decoder));
    }
    return arr;
  },
  readVarUint8Array
];
const readAny = (decoder) => readAnyLookupTable[127 - readUint8(decoder)](decoder);
class RleDecoder extends Decoder {
  constructor(uint8Array, reader) {
    super(uint8Array);
    this.reader = reader;
    this.s = null;
    this.count = 0;
  }
  read() {
    if (this.count === 0) {
      this.s = this.reader(this);
      if (hasContent(this)) {
        this.count = readVarUint(this) + 1;
      } else {
        this.count = -1;
      }
    }
    this.count--;
    return this.s;
  }
}
class UintOptRleDecoder extends Decoder {
  constructor(uint8Array) {
    super(uint8Array);
    this.s = 0;
    this.count = 0;
  }
  read() {
    if (this.count === 0) {
      this.s = readVarInt(this);
      const isNegative = isNegativeZero(this.s);
      this.count = 1;
      if (isNegative) {
        this.s = -this.s;
        this.count = readVarUint(this) + 2;
      }
    }
    this.count--;
    return this.s;
  }
}
class IntDiffOptRleDecoder extends Decoder {
  constructor(uint8Array) {
    super(uint8Array);
    this.s = 0;
    this.count = 0;
    this.diff = 0;
  }
  read() {
    if (this.count === 0) {
      const diff = readVarInt(this);
      const hasCount = diff & 1;
      this.diff = floor(diff / 2);
      this.count = 1;
      if (hasCount) {
        this.count = readVarUint(this) + 2;
      }
    }
    this.s += this.diff;
    this.count--;
    return this.s;
  }
}
class StringDecoder {
  constructor(uint8Array) {
    this.decoder = new UintOptRleDecoder(uint8Array);
    this.str = readVarString(this.decoder);
    this.spos = 0;
  }
  read() {
    const end = this.spos + this.decoder.read();
    const res = this.str.slice(this.spos, end);
    this.spos = end;
    return res;
  }
}
const createUint8ArrayFromLen = (len) => new Uint8Array(len);
const createUint8ArrayViewFromArrayBuffer = (buffer, byteOffset, length2) => new Uint8Array(buffer, byteOffset, length2);
const createUint8ArrayFromArrayBuffer = (buffer) => new Uint8Array(buffer);
const toBase64Browser = (bytes) => {
  let s = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    s += fromCharCode(bytes[i]);
  }
  return btoa(s);
};
const toBase64Node = (bytes) => Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("base64");
const fromBase64Browser = (s) => {
  const a = atob(s);
  const bytes = createUint8ArrayFromLen(a.length);
  for (let i = 0; i < a.length; i++) {
    bytes[i] = a.charCodeAt(i);
  }
  return bytes;
};
const fromBase64Node = (s) => {
  const buf = Buffer.from(s, "base64");
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
};
const toBase64 = isBrowser ? toBase64Browser : toBase64Node;
const fromBase64 = isBrowser ? fromBase64Browser : fromBase64Node;
const copyUint8Array = (uint8Array) => {
  const newBuf = createUint8ArrayFromLen(uint8Array.byteLength);
  newBuf.set(uint8Array);
  return newBuf;
};
class Encoder {
  constructor() {
    this.cpos = 0;
    this.cbuf = new Uint8Array(100);
    this.bufs = [];
  }
}
const createEncoder = () => new Encoder();
const length = (encoder) => {
  let len = encoder.cpos;
  for (let i = 0; i < encoder.bufs.length; i++) {
    len += encoder.bufs[i].length;
  }
  return len;
};
const toUint8Array = (encoder) => {
  const uint8arr = new Uint8Array(length(encoder));
  let curPos = 0;
  for (let i = 0; i < encoder.bufs.length; i++) {
    const d = encoder.bufs[i];
    uint8arr.set(d, curPos);
    curPos += d.length;
  }
  uint8arr.set(createUint8ArrayViewFromArrayBuffer(encoder.cbuf.buffer, 0, encoder.cpos), curPos);
  return uint8arr;
};
const verifyLen = (encoder, len) => {
  const bufferLen = encoder.cbuf.length;
  if (bufferLen - encoder.cpos < len) {
    encoder.bufs.push(createUint8ArrayViewFromArrayBuffer(encoder.cbuf.buffer, 0, encoder.cpos));
    encoder.cbuf = new Uint8Array(max(bufferLen, len) * 2);
    encoder.cpos = 0;
  }
};
const write = (encoder, num) => {
  const bufferLen = encoder.cbuf.length;
  if (encoder.cpos === bufferLen) {
    encoder.bufs.push(encoder.cbuf);
    encoder.cbuf = new Uint8Array(bufferLen * 2);
    encoder.cpos = 0;
  }
  encoder.cbuf[encoder.cpos++] = num;
};
const writeUint8 = write;
const writeVarUint = (encoder, num) => {
  while (num > BITS7) {
    write(encoder, BIT8 | BITS7 & num);
    num = floor(num / 128);
  }
  write(encoder, BITS7 & num);
};
const writeVarInt = (encoder, num) => {
  const isNegative = isNegativeZero(num);
  if (isNegative) {
    num = -num;
  }
  write(encoder, (num > BITS6 ? BIT8 : 0) | (isNegative ? BIT7 : 0) | BITS6 & num);
  num = floor(num / 64);
  while (num > 0) {
    write(encoder, (num > BITS7 ? BIT8 : 0) | BITS7 & num);
    num = floor(num / 128);
  }
};
const _strBuffer = new Uint8Array(3e4);
const _maxStrBSize = _strBuffer.length / 3;
const _writeVarStringNative = (encoder, str) => {
  if (str.length < _maxStrBSize) {
    const written = utf8TextEncoder.encodeInto(str, _strBuffer).written || 0;
    writeVarUint(encoder, written);
    for (let i = 0; i < written; i++) {
      write(encoder, _strBuffer[i]);
    }
  } else {
    writeVarUint8Array(encoder, encodeUtf8(str));
  }
};
const _writeVarStringPolyfill = (encoder, str) => {
  const encodedString = unescape(encodeURIComponent(str));
  const len = encodedString.length;
  writeVarUint(encoder, len);
  for (let i = 0; i < len; i++) {
    write(encoder, encodedString.codePointAt(i));
  }
};
const writeVarString = utf8TextEncoder && utf8TextEncoder.encodeInto ? _writeVarStringNative : _writeVarStringPolyfill;
const writeUint8Array = (encoder, uint8Array) => {
  const bufferLen = encoder.cbuf.length;
  const cpos = encoder.cpos;
  const leftCopyLen = min(bufferLen - cpos, uint8Array.length);
  const rightCopyLen = uint8Array.length - leftCopyLen;
  encoder.cbuf.set(uint8Array.subarray(0, leftCopyLen), cpos);
  encoder.cpos += leftCopyLen;
  if (rightCopyLen > 0) {
    encoder.bufs.push(encoder.cbuf);
    encoder.cbuf = new Uint8Array(max(bufferLen * 2, rightCopyLen));
    encoder.cbuf.set(uint8Array.subarray(leftCopyLen));
    encoder.cpos = rightCopyLen;
  }
};
const writeVarUint8Array = (encoder, uint8Array) => {
  writeVarUint(encoder, uint8Array.byteLength);
  writeUint8Array(encoder, uint8Array);
};
const writeOnDataView = (encoder, len) => {
  verifyLen(encoder, len);
  const dview = new DataView(encoder.cbuf.buffer, encoder.cpos, len);
  encoder.cpos += len;
  return dview;
};
const writeFloat32 = (encoder, num) => writeOnDataView(encoder, 4).setFloat32(0, num, false);
const writeFloat64 = (encoder, num) => writeOnDataView(encoder, 8).setFloat64(0, num, false);
const writeBigInt64 = (encoder, num) => writeOnDataView(encoder, 8).setBigInt64(0, num, false);
const floatTestBed = new DataView(new ArrayBuffer(4));
const isFloat32 = (num) => {
  floatTestBed.setFloat32(0, num);
  return floatTestBed.getFloat32(0) === num;
};
const writeAny = (encoder, data) => {
  switch (typeof data) {
    case "string":
      write(encoder, 119);
      writeVarString(encoder, data);
      break;
    case "number":
      if (isInteger(data) && abs(data) <= BITS31) {
        write(encoder, 125);
        writeVarInt(encoder, data);
      } else if (isFloat32(data)) {
        write(encoder, 124);
        writeFloat32(encoder, data);
      } else {
        write(encoder, 123);
        writeFloat64(encoder, data);
      }
      break;
    case "bigint":
      write(encoder, 122);
      writeBigInt64(encoder, data);
      break;
    case "object":
      if (data === null) {
        write(encoder, 126);
      } else if (data instanceof Array) {
        write(encoder, 117);
        writeVarUint(encoder, data.length);
        for (let i = 0; i < data.length; i++) {
          writeAny(encoder, data[i]);
        }
      } else if (data instanceof Uint8Array) {
        write(encoder, 116);
        writeVarUint8Array(encoder, data);
      } else {
        write(encoder, 118);
        const keys2 = Object.keys(data);
        writeVarUint(encoder, keys2.length);
        for (let i = 0; i < keys2.length; i++) {
          const key = keys2[i];
          writeVarString(encoder, key);
          writeAny(encoder, data[key]);
        }
      }
      break;
    case "boolean":
      write(encoder, data ? 120 : 121);
      break;
    default:
      write(encoder, 127);
  }
};
class RleEncoder extends Encoder {
  constructor(writer) {
    super();
    this.w = writer;
    this.s = null;
    this.count = 0;
  }
  write(v) {
    if (this.s === v) {
      this.count++;
    } else {
      if (this.count > 0) {
        writeVarUint(this, this.count - 1);
      }
      this.count = 1;
      this.w(this, v);
      this.s = v;
    }
  }
}
const flushUintOptRleEncoder = (encoder) => {
  if (encoder.count > 0) {
    writeVarInt(encoder.encoder, encoder.count === 1 ? encoder.s : -encoder.s);
    if (encoder.count > 1) {
      writeVarUint(encoder.encoder, encoder.count - 2);
    }
  }
};
class UintOptRleEncoder {
  constructor() {
    this.encoder = new Encoder();
    this.s = 0;
    this.count = 0;
  }
  write(v) {
    if (this.s === v) {
      this.count++;
    } else {
      flushUintOptRleEncoder(this);
      this.count = 1;
      this.s = v;
    }
  }
  toUint8Array() {
    flushUintOptRleEncoder(this);
    return toUint8Array(this.encoder);
  }
}
const flushIntDiffOptRleEncoder = (encoder) => {
  if (encoder.count > 0) {
    const encodedDiff = encoder.diff * 2 + (encoder.count === 1 ? 0 : 1);
    writeVarInt(encoder.encoder, encodedDiff);
    if (encoder.count > 1) {
      writeVarUint(encoder.encoder, encoder.count - 2);
    }
  }
};
class IntDiffOptRleEncoder {
  constructor() {
    this.encoder = new Encoder();
    this.s = 0;
    this.count = 0;
    this.diff = 0;
  }
  write(v) {
    if (this.diff === v - this.s) {
      this.s = v;
      this.count++;
    } else {
      flushIntDiffOptRleEncoder(this);
      this.count = 1;
      this.diff = v - this.s;
      this.s = v;
    }
  }
  toUint8Array() {
    flushIntDiffOptRleEncoder(this);
    return toUint8Array(this.encoder);
  }
}
class StringEncoder {
  constructor() {
    this.sarr = [];
    this.s = "";
    this.lensE = new UintOptRleEncoder();
  }
  write(string) {
    this.s += string;
    if (this.s.length > 19) {
      this.sarr.push(this.s);
      this.s = "";
    }
    this.lensE.write(string.length);
  }
  toUint8Array() {
    const encoder = new Encoder();
    this.sarr.push(this.s);
    this.s = "";
    writeVarString(encoder, this.sarr.join(""));
    writeUint8Array(encoder, this.lensE.toUint8Array());
    return toUint8Array(encoder);
  }
}
const isoCrypto = typeof crypto === "undefined" ? null : crypto;
const cryptoRandomBuffer = isoCrypto !== null ? (len) => {
  const buf = new ArrayBuffer(len);
  const arr = new Uint8Array(buf);
  isoCrypto.getRandomValues(arr);
  return buf;
} : (len) => {
  const buf = new ArrayBuffer(len);
  const arr = new Uint8Array(buf);
  for (let i = 0; i < len; i++) {
    arr[i] = Math.ceil(Math.random() * 4294967295 >>> 0);
  }
  return buf;
};
const rand = Math.random;
const uint32 = () => new Uint32Array(cryptoRandomBuffer(4))[0];
const uuidv4Template = [1e7] + -1e3 + -4e3 + -8e3 + -1e11;
const uuidv4 = () => uuidv4Template.replace(/[018]/g, (c) => (c ^ uint32() & 15 >> c / 4).toString(16));
const getUnixTime = Date.now;
const create$2 = (f) => new Promise(f);
const reject = (reason) => Promise.reject(reason);
const resolve = (res) => Promise.resolve(res);
const create$1 = Symbol;
class Pair {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }
}
const create = (left, right) => new Pair(left, right);
const doc = typeof document !== "undefined" ? document : {};
typeof DOMParser !== "undefined" ? new DOMParser() : null;
const mapToStyleString = (m) => map(m, (value, key) => `${key}:${value};`).join("");
doc.ELEMENT_NODE;
doc.TEXT_NODE;
doc.CDATA_SECTION_NODE;
doc.COMMENT_NODE;
doc.DOCUMENT_NODE;
doc.DOCUMENT_TYPE_NODE;
doc.DOCUMENT_FRAGMENT_NODE;
const BOLD = create$1();
const UNBOLD = create$1();
const BLUE = create$1();
const GREY = create$1();
const GREEN = create$1();
const RED = create$1();
const PURPLE = create$1();
const ORANGE = create$1();
const UNCOLOR = create$1();
const _browserStyleMap = {
  [BOLD]: create("font-weight", "bold"),
  [UNBOLD]: create("font-weight", "normal"),
  [BLUE]: create("color", "blue"),
  [GREEN]: create("color", "green"),
  [GREY]: create("color", "grey"),
  [RED]: create("color", "red"),
  [PURPLE]: create("color", "purple"),
  [ORANGE]: create("color", "orange"),
  [UNCOLOR]: create("color", "black")
};
const _nodeStyleMap = {
  [BOLD]: "\x1B[1m",
  [UNBOLD]: "\x1B[2m",
  [BLUE]: "\x1B[34m",
  [GREEN]: "\x1B[32m",
  [GREY]: "\x1B[37m",
  [RED]: "\x1B[31m",
  [PURPLE]: "\x1B[35m",
  [ORANGE]: "\x1B[38;5;208m",
  [UNCOLOR]: "\x1B[0m"
};
const computeBrowserLoggingArgs = (args) => {
  const strBuilder = [];
  const styles = [];
  const currentStyle = create$5();
  let logArgs = [];
  let i = 0;
  for (; i < args.length; i++) {
    const arg = args[i];
    const style2 = _browserStyleMap[arg];
    if (style2 !== void 0) {
      currentStyle.set(style2.left, style2.right);
    } else {
      if (arg.constructor === String || arg.constructor === Number) {
        const style3 = mapToStyleString(currentStyle);
        if (i > 0 || style3.length > 0) {
          strBuilder.push("%c" + arg);
          styles.push(style3);
        } else {
          strBuilder.push(arg);
        }
      } else {
        break;
      }
    }
  }
  if (i > 0) {
    logArgs = styles;
    logArgs.unshift(strBuilder.join(""));
  }
  for (; i < args.length; i++) {
    const arg = args[i];
    if (!(arg instanceof Symbol)) {
      logArgs.push(arg);
    }
  }
  return logArgs;
};
const computeNoColorLoggingArgs = (args) => {
  const strBuilder = [];
  const logArgs = [];
  let i = 0;
  for (; i < args.length; i++) {
    const arg = args[i];
    const style2 = _nodeStyleMap[arg];
    if (style2 === void 0) {
      if (arg.constructor === String || arg.constructor === Number) {
        strBuilder.push(arg);
      } else {
        break;
      }
    }
  }
  if (i > 0) {
    logArgs.push(strBuilder.join(""));
  }
  for (; i < args.length; i++) {
    const arg = args[i];
    if (!(arg instanceof Symbol)) {
      if (arg.constructor === Object) {
        logArgs.push(JSON.stringify(arg));
      } else {
        logArgs.push(arg);
      }
    }
  }
  return logArgs;
};
const computeNodeLoggingArgs = (args) => {
  const strBuilder = [];
  const logArgs = [];
  let i = 0;
  for (; i < args.length; i++) {
    const arg = args[i];
    const style2 = _nodeStyleMap[arg];
    if (style2 !== void 0) {
      strBuilder.push(style2);
    } else {
      if (arg.constructor === String || arg.constructor === Number) {
        strBuilder.push(arg);
      } else {
        break;
      }
    }
  }
  if (i > 0) {
    strBuilder.push("\x1B[0m");
    logArgs.push(strBuilder.join(""));
  }
  for (; i < args.length; i++) {
    const arg = args[i];
    if (!(arg instanceof Symbol)) {
      logArgs.push(arg);
    }
  }
  return logArgs;
};
const computeLoggingArgs = supportsColor ? isNode ? computeNodeLoggingArgs : computeBrowserLoggingArgs : computeNoColorLoggingArgs;
const print = (...args) => {
  console.log(...computeLoggingArgs(args));
  vconsoles.forEach((vc) => vc.print(args));
};
const vconsoles = create$4();
const loggingColors = [GREEN, PURPLE, ORANGE, BLUE];
let nextColor = 0;
let lastLoggingTime = getUnixTime();
const createModuleLogger = (moduleName) => {
  const color = loggingColors[nextColor];
  const debugRegexVar = getVariable("log");
  const doLogging = debugRegexVar !== null && (debugRegexVar === "*" || debugRegexVar === "true" || new RegExp(debugRegexVar, "gi").test(moduleName));
  nextColor = (nextColor + 1) % loggingColors.length;
  moduleName += ": ";
  return !doLogging ? nop : (...args) => {
    const timeNow = getUnixTime();
    const timeDiff = timeNow - lastLoggingTime;
    lastLoggingTime = timeNow;
    print(color, moduleName, UNCOLOR, ...args.map((arg) => typeof arg === "string" || typeof arg === "symbol" ? arg : JSON.stringify(arg)), color, " +" + timeDiff + "ms");
  };
};
const createIterator = (next) => ({
  [Symbol.iterator]() {
    return this;
  },
  next
});
const iteratorFilter = (iterator, filter) => createIterator(() => {
  let res;
  do {
    res = iterator.next();
  } while (!res.done && !filter(res.value));
  return res;
});
const iteratorMap = (iterator, fmap) => createIterator(() => {
  const { done, value } = iterator.next();
  return { done, value: done ? void 0 : fmap(value) };
});
class AbstractConnector extends Observable {
  constructor(ydoc, awareness) {
    super();
    this.doc = ydoc;
    this.awareness = awareness;
  }
}
class DeleteItem {
  constructor(clock, len) {
    this.clock = clock;
    this.len = len;
  }
}
class DeleteSet {
  constructor() {
    this.clients = /* @__PURE__ */ new Map();
  }
}
const iterateDeletedStructs = (transaction, ds, f) => ds.clients.forEach((deletes, clientid) => {
  const structs = transaction.doc.store.clients.get(clientid);
  for (let i = 0; i < deletes.length; i++) {
    const del = deletes[i];
    iterateStructs(transaction, structs, del.clock, del.len, f);
  }
});
const findIndexDS = (dis, clock) => {
  let left = 0;
  let right = dis.length - 1;
  while (left <= right) {
    const midindex = floor((left + right) / 2);
    const mid = dis[midindex];
    const midclock = mid.clock;
    if (midclock <= clock) {
      if (clock < midclock + mid.len) {
        return midindex;
      }
      left = midindex + 1;
    } else {
      right = midindex - 1;
    }
  }
  return null;
};
const isDeleted = (ds, id) => {
  const dis = ds.clients.get(id.client);
  return dis !== void 0 && findIndexDS(dis, id.clock) !== null;
};
const sortAndMergeDeleteSet = (ds) => {
  ds.clients.forEach((dels) => {
    dels.sort((a, b) => a.clock - b.clock);
    let i, j;
    for (i = 1, j = 1; i < dels.length; i++) {
      const left = dels[j - 1];
      const right = dels[i];
      if (left.clock + left.len >= right.clock) {
        left.len = max(left.len, right.clock + right.len - left.clock);
      } else {
        if (j < i) {
          dels[j] = right;
        }
        j++;
      }
    }
    dels.length = j;
  });
};
const mergeDeleteSets = (dss) => {
  const merged = new DeleteSet();
  for (let dssI = 0; dssI < dss.length; dssI++) {
    dss[dssI].clients.forEach((delsLeft, client) => {
      if (!merged.clients.has(client)) {
        const dels = delsLeft.slice();
        for (let i = dssI + 1; i < dss.length; i++) {
          appendTo(dels, dss[i].clients.get(client) || []);
        }
        merged.clients.set(client, dels);
      }
    });
  }
  sortAndMergeDeleteSet(merged);
  return merged;
};
const addToDeleteSet = (ds, client, clock, length2) => {
  setIfUndefined(ds.clients, client, () => []).push(new DeleteItem(clock, length2));
};
const createDeleteSet = () => new DeleteSet();
const createDeleteSetFromStructStore = (ss) => {
  const ds = createDeleteSet();
  ss.clients.forEach((structs, client) => {
    const dsitems = [];
    for (let i = 0; i < structs.length; i++) {
      const struct = structs[i];
      if (struct.deleted) {
        const clock = struct.id.clock;
        let len = struct.length;
        if (i + 1 < structs.length) {
          for (let next = structs[i + 1]; i + 1 < structs.length && next.deleted; next = structs[++i + 1]) {
            len += next.length;
          }
        }
        dsitems.push(new DeleteItem(clock, len));
      }
    }
    if (dsitems.length > 0) {
      ds.clients.set(client, dsitems);
    }
  });
  return ds;
};
const writeDeleteSet = (encoder, ds) => {
  writeVarUint(encoder.restEncoder, ds.clients.size);
  ds.clients.forEach((dsitems, client) => {
    encoder.resetDsCurVal();
    writeVarUint(encoder.restEncoder, client);
    const len = dsitems.length;
    writeVarUint(encoder.restEncoder, len);
    for (let i = 0; i < len; i++) {
      const item = dsitems[i];
      encoder.writeDsClock(item.clock);
      encoder.writeDsLen(item.len);
    }
  });
};
const readDeleteSet = (decoder) => {
  const ds = new DeleteSet();
  const numClients = readVarUint(decoder.restDecoder);
  for (let i = 0; i < numClients; i++) {
    decoder.resetDsCurVal();
    const client = readVarUint(decoder.restDecoder);
    const numberOfDeletes = readVarUint(decoder.restDecoder);
    if (numberOfDeletes > 0) {
      const dsField = setIfUndefined(ds.clients, client, () => []);
      for (let i2 = 0; i2 < numberOfDeletes; i2++) {
        dsField.push(new DeleteItem(decoder.readDsClock(), decoder.readDsLen()));
      }
    }
  }
  return ds;
};
const readAndApplyDeleteSet = (decoder, transaction, store) => {
  const unappliedDS = new DeleteSet();
  const numClients = readVarUint(decoder.restDecoder);
  for (let i = 0; i < numClients; i++) {
    decoder.resetDsCurVal();
    const client = readVarUint(decoder.restDecoder);
    const numberOfDeletes = readVarUint(decoder.restDecoder);
    const structs = store.clients.get(client) || [];
    const state = getState(store, client);
    for (let i2 = 0; i2 < numberOfDeletes; i2++) {
      const clock = decoder.readDsClock();
      const clockEnd = clock + decoder.readDsLen();
      if (clock < state) {
        if (state < clockEnd) {
          addToDeleteSet(unappliedDS, client, state, clockEnd - state);
        }
        let index = findIndexSS(structs, clock);
        let struct = structs[index];
        if (!struct.deleted && struct.id.clock < clock) {
          structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
          index++;
        }
        while (index < structs.length) {
          struct = structs[index++];
          if (struct.id.clock < clockEnd) {
            if (!struct.deleted) {
              if (clockEnd < struct.id.clock + struct.length) {
                structs.splice(index, 0, splitItem(transaction, struct, clockEnd - struct.id.clock));
              }
              struct.delete(transaction);
            }
          } else {
            break;
          }
        }
      } else {
        addToDeleteSet(unappliedDS, client, clock, clockEnd - clock);
      }
    }
  }
  if (unappliedDS.clients.size > 0) {
    const ds = new UpdateEncoderV2();
    writeVarUint(ds.restEncoder, 0);
    writeDeleteSet(ds, unappliedDS);
    return ds.toUint8Array();
  }
  return null;
};
const generateNewClientId = uint32;
class Doc extends Observable {
  constructor({ guid = uuidv4(), collectionid = null, gc = true, gcFilter = () => true, meta = null, autoLoad = false, shouldLoad = true } = {}) {
    super();
    this.gc = gc;
    this.gcFilter = gcFilter;
    this.clientID = generateNewClientId();
    this.guid = guid;
    this.collectionid = collectionid;
    this.share = /* @__PURE__ */ new Map();
    this.store = new StructStore();
    this._transaction = null;
    this._transactionCleanups = [];
    this.subdocs = /* @__PURE__ */ new Set();
    this._item = null;
    this.shouldLoad = shouldLoad;
    this.autoLoad = autoLoad;
    this.meta = meta;
    this.isLoaded = false;
    this.isSynced = false;
    this.whenLoaded = create$2((resolve2) => {
      this.on("load", () => {
        this.isLoaded = true;
        resolve2(this);
      });
    });
    const provideSyncedPromise = () => create$2((resolve2) => {
      const eventHandler = (isSynced) => {
        if (isSynced === void 0 || isSynced === true) {
          this.off("sync", eventHandler);
          resolve2();
        }
      };
      this.on("sync", eventHandler);
    });
    this.on("sync", (isSynced) => {
      if (isSynced === false && this.isSynced) {
        this.whenSynced = provideSyncedPromise();
      }
      this.isSynced = isSynced === void 0 || isSynced === true;
      if (!this.isLoaded) {
        this.emit("load", []);
      }
    });
    this.whenSynced = provideSyncedPromise();
  }
  load() {
    const item = this._item;
    if (item !== null && !this.shouldLoad) {
      transact(item.parent.doc, (transaction) => {
        transaction.subdocsLoaded.add(this);
      }, null, true);
    }
    this.shouldLoad = true;
  }
  getSubdocs() {
    return this.subdocs;
  }
  getSubdocGuids() {
    return new Set(Array.from(this.subdocs).map((doc2) => doc2.guid));
  }
  transact(f, origin = null) {
    transact(this, f, origin);
  }
  get(name, TypeConstructor = AbstractType) {
    const type = setIfUndefined(this.share, name, () => {
      const t = new TypeConstructor();
      t._integrate(this, null);
      return t;
    });
    const Constr = type.constructor;
    if (TypeConstructor !== AbstractType && Constr !== TypeConstructor) {
      if (Constr === AbstractType) {
        const t = new TypeConstructor();
        t._map = type._map;
        type._map.forEach((n) => {
          for (; n !== null; n = n.left) {
            n.parent = t;
          }
        });
        t._start = type._start;
        for (let n = t._start; n !== null; n = n.right) {
          n.parent = t;
        }
        t._length = type._length;
        this.share.set(name, t);
        t._integrate(this, null);
        return t;
      } else {
        throw new Error(`Type with the name ${name} has already been defined with a different constructor`);
      }
    }
    return type;
  }
  getArray(name = "") {
    return this.get(name, YArray);
  }
  getText(name = "") {
    return this.get(name, YText);
  }
  getMap(name = "") {
    return this.get(name, YMap);
  }
  getXmlFragment(name = "") {
    return this.get(name, YXmlFragment);
  }
  toJSON() {
    const doc2 = {};
    this.share.forEach((value, key) => {
      doc2[key] = value.toJSON();
    });
    return doc2;
  }
  destroy() {
    from(this.subdocs).forEach((subdoc) => subdoc.destroy());
    const item = this._item;
    if (item !== null) {
      this._item = null;
      const content = item.content;
      content.doc = new Doc(__spreadProps(__spreadValues({ guid: this.guid }, content.opts), { shouldLoad: false }));
      content.doc._item = item;
      transact(item.parent.doc, (transaction) => {
        const doc2 = content.doc;
        if (!item.deleted) {
          transaction.subdocsAdded.add(doc2);
        }
        transaction.subdocsRemoved.add(this);
      }, null, true);
    }
    this.emit("destroyed", [true]);
    this.emit("destroy", [this]);
    super.destroy();
  }
  on(eventName, f) {
    super.on(eventName, f);
  }
  off(eventName, f) {
    super.off(eventName, f);
  }
}
class DSDecoderV1 {
  constructor(decoder) {
    this.restDecoder = decoder;
  }
  resetDsCurVal() {
  }
  readDsClock() {
    return readVarUint(this.restDecoder);
  }
  readDsLen() {
    return readVarUint(this.restDecoder);
  }
}
class UpdateDecoderV1 extends DSDecoderV1 {
  readLeftID() {
    return createID(readVarUint(this.restDecoder), readVarUint(this.restDecoder));
  }
  readRightID() {
    return createID(readVarUint(this.restDecoder), readVarUint(this.restDecoder));
  }
  readClient() {
    return readVarUint(this.restDecoder);
  }
  readInfo() {
    return readUint8(this.restDecoder);
  }
  readString() {
    return readVarString(this.restDecoder);
  }
  readParentInfo() {
    return readVarUint(this.restDecoder) === 1;
  }
  readTypeRef() {
    return readVarUint(this.restDecoder);
  }
  readLen() {
    return readVarUint(this.restDecoder);
  }
  readAny() {
    return readAny(this.restDecoder);
  }
  readBuf() {
    return copyUint8Array(readVarUint8Array(this.restDecoder));
  }
  readJSON() {
    return JSON.parse(readVarString(this.restDecoder));
  }
  readKey() {
    return readVarString(this.restDecoder);
  }
}
class DSDecoderV2 {
  constructor(decoder) {
    this.dsCurrVal = 0;
    this.restDecoder = decoder;
  }
  resetDsCurVal() {
    this.dsCurrVal = 0;
  }
  readDsClock() {
    this.dsCurrVal += readVarUint(this.restDecoder);
    return this.dsCurrVal;
  }
  readDsLen() {
    const diff = readVarUint(this.restDecoder) + 1;
    this.dsCurrVal += diff;
    return diff;
  }
}
class UpdateDecoderV2 extends DSDecoderV2 {
  constructor(decoder) {
    super(decoder);
    this.keys = [];
    readVarUint(decoder);
    this.keyClockDecoder = new IntDiffOptRleDecoder(readVarUint8Array(decoder));
    this.clientDecoder = new UintOptRleDecoder(readVarUint8Array(decoder));
    this.leftClockDecoder = new IntDiffOptRleDecoder(readVarUint8Array(decoder));
    this.rightClockDecoder = new IntDiffOptRleDecoder(readVarUint8Array(decoder));
    this.infoDecoder = new RleDecoder(readVarUint8Array(decoder), readUint8);
    this.stringDecoder = new StringDecoder(readVarUint8Array(decoder));
    this.parentInfoDecoder = new RleDecoder(readVarUint8Array(decoder), readUint8);
    this.typeRefDecoder = new UintOptRleDecoder(readVarUint8Array(decoder));
    this.lenDecoder = new UintOptRleDecoder(readVarUint8Array(decoder));
  }
  readLeftID() {
    return new ID(this.clientDecoder.read(), this.leftClockDecoder.read());
  }
  readRightID() {
    return new ID(this.clientDecoder.read(), this.rightClockDecoder.read());
  }
  readClient() {
    return this.clientDecoder.read();
  }
  readInfo() {
    return this.infoDecoder.read();
  }
  readString() {
    return this.stringDecoder.read();
  }
  readParentInfo() {
    return this.parentInfoDecoder.read() === 1;
  }
  readTypeRef() {
    return this.typeRefDecoder.read();
  }
  readLen() {
    return this.lenDecoder.read();
  }
  readAny() {
    return readAny(this.restDecoder);
  }
  readBuf() {
    return readVarUint8Array(this.restDecoder);
  }
  readJSON() {
    return readAny(this.restDecoder);
  }
  readKey() {
    const keyClock = this.keyClockDecoder.read();
    if (keyClock < this.keys.length) {
      return this.keys[keyClock];
    } else {
      const key = this.stringDecoder.read();
      this.keys.push(key);
      return key;
    }
  }
}
class DSEncoderV1 {
  constructor() {
    this.restEncoder = createEncoder();
  }
  toUint8Array() {
    return toUint8Array(this.restEncoder);
  }
  resetDsCurVal() {
  }
  writeDsClock(clock) {
    writeVarUint(this.restEncoder, clock);
  }
  writeDsLen(len) {
    writeVarUint(this.restEncoder, len);
  }
}
class UpdateEncoderV1 extends DSEncoderV1 {
  writeLeftID(id) {
    writeVarUint(this.restEncoder, id.client);
    writeVarUint(this.restEncoder, id.clock);
  }
  writeRightID(id) {
    writeVarUint(this.restEncoder, id.client);
    writeVarUint(this.restEncoder, id.clock);
  }
  writeClient(client) {
    writeVarUint(this.restEncoder, client);
  }
  writeInfo(info) {
    writeUint8(this.restEncoder, info);
  }
  writeString(s) {
    writeVarString(this.restEncoder, s);
  }
  writeParentInfo(isYKey) {
    writeVarUint(this.restEncoder, isYKey ? 1 : 0);
  }
  writeTypeRef(info) {
    writeVarUint(this.restEncoder, info);
  }
  writeLen(len) {
    writeVarUint(this.restEncoder, len);
  }
  writeAny(any2) {
    writeAny(this.restEncoder, any2);
  }
  writeBuf(buf) {
    writeVarUint8Array(this.restEncoder, buf);
  }
  writeJSON(embed) {
    writeVarString(this.restEncoder, JSON.stringify(embed));
  }
  writeKey(key) {
    writeVarString(this.restEncoder, key);
  }
}
class DSEncoderV2 {
  constructor() {
    this.restEncoder = createEncoder();
    this.dsCurrVal = 0;
  }
  toUint8Array() {
    return toUint8Array(this.restEncoder);
  }
  resetDsCurVal() {
    this.dsCurrVal = 0;
  }
  writeDsClock(clock) {
    const diff = clock - this.dsCurrVal;
    this.dsCurrVal = clock;
    writeVarUint(this.restEncoder, diff);
  }
  writeDsLen(len) {
    if (len === 0) {
      unexpectedCase();
    }
    writeVarUint(this.restEncoder, len - 1);
    this.dsCurrVal += len;
  }
}
class UpdateEncoderV2 extends DSEncoderV2 {
  constructor() {
    super();
    this.keyMap = /* @__PURE__ */ new Map();
    this.keyClock = 0;
    this.keyClockEncoder = new IntDiffOptRleEncoder();
    this.clientEncoder = new UintOptRleEncoder();
    this.leftClockEncoder = new IntDiffOptRleEncoder();
    this.rightClockEncoder = new IntDiffOptRleEncoder();
    this.infoEncoder = new RleEncoder(writeUint8);
    this.stringEncoder = new StringEncoder();
    this.parentInfoEncoder = new RleEncoder(writeUint8);
    this.typeRefEncoder = new UintOptRleEncoder();
    this.lenEncoder = new UintOptRleEncoder();
  }
  toUint8Array() {
    const encoder = createEncoder();
    writeVarUint(encoder, 0);
    writeVarUint8Array(encoder, this.keyClockEncoder.toUint8Array());
    writeVarUint8Array(encoder, this.clientEncoder.toUint8Array());
    writeVarUint8Array(encoder, this.leftClockEncoder.toUint8Array());
    writeVarUint8Array(encoder, this.rightClockEncoder.toUint8Array());
    writeVarUint8Array(encoder, toUint8Array(this.infoEncoder));
    writeVarUint8Array(encoder, this.stringEncoder.toUint8Array());
    writeVarUint8Array(encoder, toUint8Array(this.parentInfoEncoder));
    writeVarUint8Array(encoder, this.typeRefEncoder.toUint8Array());
    writeVarUint8Array(encoder, this.lenEncoder.toUint8Array());
    writeUint8Array(encoder, toUint8Array(this.restEncoder));
    return toUint8Array(encoder);
  }
  writeLeftID(id) {
    this.clientEncoder.write(id.client);
    this.leftClockEncoder.write(id.clock);
  }
  writeRightID(id) {
    this.clientEncoder.write(id.client);
    this.rightClockEncoder.write(id.clock);
  }
  writeClient(client) {
    this.clientEncoder.write(client);
  }
  writeInfo(info) {
    this.infoEncoder.write(info);
  }
  writeString(s) {
    this.stringEncoder.write(s);
  }
  writeParentInfo(isYKey) {
    this.parentInfoEncoder.write(isYKey ? 1 : 0);
  }
  writeTypeRef(info) {
    this.typeRefEncoder.write(info);
  }
  writeLen(len) {
    this.lenEncoder.write(len);
  }
  writeAny(any2) {
    writeAny(this.restEncoder, any2);
  }
  writeBuf(buf) {
    writeVarUint8Array(this.restEncoder, buf);
  }
  writeJSON(embed) {
    writeAny(this.restEncoder, embed);
  }
  writeKey(key) {
    const clock = this.keyMap.get(key);
    if (clock === void 0) {
      this.keyClockEncoder.write(this.keyClock++);
      this.stringEncoder.write(key);
    } else {
      this.keyClockEncoder.write(clock);
    }
  }
}
const writeStructs = (encoder, structs, client, clock) => {
  clock = max(clock, structs[0].id.clock);
  const startNewStructs = findIndexSS(structs, clock);
  writeVarUint(encoder.restEncoder, structs.length - startNewStructs);
  encoder.writeClient(client);
  writeVarUint(encoder.restEncoder, clock);
  const firstStruct = structs[startNewStructs];
  firstStruct.write(encoder, clock - firstStruct.id.clock);
  for (let i = startNewStructs + 1; i < structs.length; i++) {
    structs[i].write(encoder, 0);
  }
};
const writeClientsStructs = (encoder, store, _sm) => {
  const sm = /* @__PURE__ */ new Map();
  _sm.forEach((clock, client) => {
    if (getState(store, client) > clock) {
      sm.set(client, clock);
    }
  });
  getStateVector(store).forEach((clock, client) => {
    if (!_sm.has(client)) {
      sm.set(client, 0);
    }
  });
  writeVarUint(encoder.restEncoder, sm.size);
  Array.from(sm.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
    writeStructs(encoder, store.clients.get(client), client, clock);
  });
};
const readClientsStructRefs = (decoder, doc2) => {
  const clientRefs = create$5();
  const numOfStateUpdates = readVarUint(decoder.restDecoder);
  for (let i = 0; i < numOfStateUpdates; i++) {
    const numberOfStructs = readVarUint(decoder.restDecoder);
    const refs = new Array(numberOfStructs);
    const client = decoder.readClient();
    let clock = readVarUint(decoder.restDecoder);
    clientRefs.set(client, { i: 0, refs });
    for (let i2 = 0; i2 < numberOfStructs; i2++) {
      const info = decoder.readInfo();
      switch (BITS5 & info) {
        case 0: {
          const len = decoder.readLen();
          refs[i2] = new GC(createID(client, clock), len);
          clock += len;
          break;
        }
        case 10: {
          const len = readVarUint(decoder.restDecoder);
          refs[i2] = new Skip(createID(client, clock), len);
          clock += len;
          break;
        }
        default: {
          const cantCopyParentInfo = (info & (BIT7 | BIT8)) === 0;
          const struct = new Item(createID(client, clock), null, (info & BIT8) === BIT8 ? decoder.readLeftID() : null, null, (info & BIT7) === BIT7 ? decoder.readRightID() : null, cantCopyParentInfo ? decoder.readParentInfo() ? doc2.get(decoder.readString()) : decoder.readLeftID() : null, cantCopyParentInfo && (info & BIT6) === BIT6 ? decoder.readString() : null, readItemContent(decoder, info));
          refs[i2] = struct;
          clock += struct.length;
        }
      }
    }
  }
  return clientRefs;
};
const integrateStructs = (transaction, store, clientsStructRefs) => {
  const stack = [];
  let clientsStructRefsIds = Array.from(clientsStructRefs.keys()).sort((a, b) => a - b);
  if (clientsStructRefsIds.length === 0) {
    return null;
  }
  const getNextStructTarget = () => {
    if (clientsStructRefsIds.length === 0) {
      return null;
    }
    let nextStructsTarget = clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1]);
    while (nextStructsTarget.refs.length === nextStructsTarget.i) {
      clientsStructRefsIds.pop();
      if (clientsStructRefsIds.length > 0) {
        nextStructsTarget = clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1]);
      } else {
        return null;
      }
    }
    return nextStructsTarget;
  };
  let curStructsTarget = getNextStructTarget();
  if (curStructsTarget === null && stack.length === 0) {
    return null;
  }
  const restStructs = new StructStore();
  const missingSV = /* @__PURE__ */ new Map();
  const updateMissingSv = (client, clock) => {
    const mclock = missingSV.get(client);
    if (mclock == null || mclock > clock) {
      missingSV.set(client, clock);
    }
  };
  let stackHead = curStructsTarget.refs[curStructsTarget.i++];
  const state = /* @__PURE__ */ new Map();
  const addStackToRestSS = () => {
    for (const item of stack) {
      const client = item.id.client;
      const unapplicableItems = clientsStructRefs.get(client);
      if (unapplicableItems) {
        unapplicableItems.i--;
        restStructs.clients.set(client, unapplicableItems.refs.slice(unapplicableItems.i));
        clientsStructRefs.delete(client);
        unapplicableItems.i = 0;
        unapplicableItems.refs = [];
      } else {
        restStructs.clients.set(client, [item]);
      }
      clientsStructRefsIds = clientsStructRefsIds.filter((c) => c !== client);
    }
    stack.length = 0;
  };
  while (true) {
    if (stackHead.constructor !== Skip) {
      const localClock = setIfUndefined(state, stackHead.id.client, () => getState(store, stackHead.id.client));
      const offset = localClock - stackHead.id.clock;
      if (offset < 0) {
        stack.push(stackHead);
        updateMissingSv(stackHead.id.client, stackHead.id.clock - 1);
        addStackToRestSS();
      } else {
        const missing = stackHead.getMissing(transaction, store);
        if (missing !== null) {
          stack.push(stackHead);
          const structRefs = clientsStructRefs.get(missing) || { refs: [], i: 0 };
          if (structRefs.refs.length === structRefs.i) {
            updateMissingSv(missing, getState(store, missing));
            addStackToRestSS();
          } else {
            stackHead = structRefs.refs[structRefs.i++];
            continue;
          }
        } else if (offset === 0 || offset < stackHead.length) {
          stackHead.integrate(transaction, offset);
          state.set(stackHead.id.client, stackHead.id.clock + stackHead.length);
        }
      }
    }
    if (stack.length > 0) {
      stackHead = stack.pop();
    } else if (curStructsTarget !== null && curStructsTarget.i < curStructsTarget.refs.length) {
      stackHead = curStructsTarget.refs[curStructsTarget.i++];
    } else {
      curStructsTarget = getNextStructTarget();
      if (curStructsTarget === null) {
        break;
      } else {
        stackHead = curStructsTarget.refs[curStructsTarget.i++];
      }
    }
  }
  if (restStructs.clients.size > 0) {
    const encoder = new UpdateEncoderV2();
    writeClientsStructs(encoder, restStructs, /* @__PURE__ */ new Map());
    writeVarUint(encoder.restEncoder, 0);
    return { missing: missingSV, update: encoder.toUint8Array() };
  }
  return null;
};
const writeStructsFromTransaction = (encoder, transaction) => writeClientsStructs(encoder, transaction.doc.store, transaction.beforeState);
const readUpdateV2 = (decoder, ydoc, transactionOrigin, structDecoder = new UpdateDecoderV2(decoder)) => transact(ydoc, (transaction) => {
  transaction.local = false;
  let retry = false;
  const doc2 = transaction.doc;
  const store = doc2.store;
  const ss = readClientsStructRefs(structDecoder, doc2);
  const restStructs = integrateStructs(transaction, store, ss);
  const pending = store.pendingStructs;
  if (pending) {
    for (const [client, clock] of pending.missing) {
      if (clock < getState(store, client)) {
        retry = true;
        break;
      }
    }
    if (restStructs) {
      for (const [client, clock] of restStructs.missing) {
        const mclock = pending.missing.get(client);
        if (mclock == null || mclock > clock) {
          pending.missing.set(client, clock);
        }
      }
      pending.update = mergeUpdatesV2([pending.update, restStructs.update]);
    }
  } else {
    store.pendingStructs = restStructs;
  }
  const dsRest = readAndApplyDeleteSet(structDecoder, transaction, store);
  if (store.pendingDs) {
    const pendingDSUpdate = new UpdateDecoderV2(createDecoder(store.pendingDs));
    readVarUint(pendingDSUpdate.restDecoder);
    const dsRest2 = readAndApplyDeleteSet(pendingDSUpdate, transaction, store);
    if (dsRest && dsRest2) {
      store.pendingDs = mergeUpdatesV2([dsRest, dsRest2]);
    } else {
      store.pendingDs = dsRest || dsRest2;
    }
  } else {
    store.pendingDs = dsRest;
  }
  if (retry) {
    const update = store.pendingStructs.update;
    store.pendingStructs = null;
    applyUpdateV2(transaction.doc, update);
  }
}, transactionOrigin, false);
const applyUpdateV2 = (ydoc, update, transactionOrigin, YDecoder = UpdateDecoderV2) => {
  const decoder = createDecoder(update);
  readUpdateV2(decoder, ydoc, transactionOrigin, new YDecoder(decoder));
};
const applyUpdate = (ydoc, update, transactionOrigin) => applyUpdateV2(ydoc, update, transactionOrigin, UpdateDecoderV1);
const writeStateAsUpdate = (encoder, doc2, targetStateVector = /* @__PURE__ */ new Map()) => {
  writeClientsStructs(encoder, doc2.store, targetStateVector);
  writeDeleteSet(encoder, createDeleteSetFromStructStore(doc2.store));
};
const encodeStateAsUpdateV2 = (doc2, encodedTargetStateVector = new Uint8Array([0]), encoder = new UpdateEncoderV2()) => {
  const targetStateVector = decodeStateVector(encodedTargetStateVector);
  writeStateAsUpdate(encoder, doc2, targetStateVector);
  const updates = [encoder.toUint8Array()];
  if (doc2.store.pendingDs) {
    updates.push(doc2.store.pendingDs);
  }
  if (doc2.store.pendingStructs) {
    updates.push(diffUpdateV2(doc2.store.pendingStructs.update, encodedTargetStateVector));
  }
  if (updates.length > 1) {
    if (encoder.constructor === UpdateEncoderV1) {
      return mergeUpdates(updates.map((update, i) => i === 0 ? update : convertUpdateFormatV2ToV1(update)));
    } else if (encoder.constructor === UpdateEncoderV2) {
      return mergeUpdatesV2(updates);
    }
  }
  return updates[0];
};
const encodeStateAsUpdate = (doc2, encodedTargetStateVector) => encodeStateAsUpdateV2(doc2, encodedTargetStateVector, new UpdateEncoderV1());
const readStateVector = (decoder) => {
  const ss = /* @__PURE__ */ new Map();
  const ssLength = readVarUint(decoder.restDecoder);
  for (let i = 0; i < ssLength; i++) {
    const client = readVarUint(decoder.restDecoder);
    const clock = readVarUint(decoder.restDecoder);
    ss.set(client, clock);
  }
  return ss;
};
const decodeStateVector = (decodedState) => readStateVector(new DSDecoderV1(createDecoder(decodedState)));
const writeStateVector = (encoder, sv) => {
  writeVarUint(encoder.restEncoder, sv.size);
  Array.from(sv.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
    writeVarUint(encoder.restEncoder, client);
    writeVarUint(encoder.restEncoder, clock);
  });
  return encoder;
};
const writeDocumentStateVector = (encoder, doc2) => writeStateVector(encoder, getStateVector(doc2.store));
const encodeStateVectorV2 = (doc2, encoder = new DSEncoderV2()) => {
  if (doc2 instanceof Map) {
    writeStateVector(encoder, doc2);
  } else {
    writeDocumentStateVector(encoder, doc2);
  }
  return encoder.toUint8Array();
};
const encodeStateVector = (doc2) => encodeStateVectorV2(doc2, new DSEncoderV1());
class EventHandler {
  constructor() {
    this.l = [];
  }
}
const createEventHandler = () => new EventHandler();
const addEventHandlerListener = (eventHandler, f) => eventHandler.l.push(f);
const removeEventHandlerListener = (eventHandler, f) => {
  const l = eventHandler.l;
  const len = l.length;
  eventHandler.l = l.filter((g) => f !== g);
  if (len === eventHandler.l.length) {
    console.error("[yjs] Tried to remove event handler that doesn't exist.");
  }
};
const callEventHandlerListeners = (eventHandler, arg0, arg1) => callAll(eventHandler.l, [arg0, arg1]);
class ID {
  constructor(client, clock) {
    this.client = client;
    this.clock = clock;
  }
}
const compareIDs = (a, b) => a === b || a !== null && b !== null && a.client === b.client && a.clock === b.clock;
const createID = (client, clock) => new ID(client, clock);
const findRootTypeKey = (type) => {
  for (const [key, value] of type.doc.share.entries()) {
    if (value === type) {
      return key;
    }
  }
  throw unexpectedCase();
};
const isParentOf = (parent, child) => {
  while (child !== null) {
    if (child.parent === parent) {
      return true;
    }
    child = child.parent._item;
  }
  return false;
};
class Snapshot {
  constructor(ds, sv) {
    this.ds = ds;
    this.sv = sv;
  }
}
const createSnapshot = (ds, sm) => new Snapshot(ds, sm);
createSnapshot(createDeleteSet(), /* @__PURE__ */ new Map());
const isVisible = (item, snapshot) => snapshot === void 0 ? !item.deleted : snapshot.sv.has(item.id.client) && (snapshot.sv.get(item.id.client) || 0) > item.id.clock && !isDeleted(snapshot.ds, item.id);
const splitSnapshotAffectedStructs = (transaction, snapshot) => {
  const meta = setIfUndefined(transaction.meta, splitSnapshotAffectedStructs, create$4);
  const store = transaction.doc.store;
  if (!meta.has(snapshot)) {
    snapshot.sv.forEach((clock, client) => {
      if (clock < getState(store, client)) {
        getItemCleanStart(transaction, createID(client, clock));
      }
    });
    iterateDeletedStructs(transaction, snapshot.ds, (item) => {
    });
    meta.add(snapshot);
  }
};
class StructStore {
  constructor() {
    this.clients = /* @__PURE__ */ new Map();
    this.pendingStructs = null;
    this.pendingDs = null;
  }
}
const getStateVector = (store) => {
  const sm = /* @__PURE__ */ new Map();
  store.clients.forEach((structs, client) => {
    const struct = structs[structs.length - 1];
    sm.set(client, struct.id.clock + struct.length);
  });
  return sm;
};
const getState = (store, client) => {
  const structs = store.clients.get(client);
  if (structs === void 0) {
    return 0;
  }
  const lastStruct = structs[structs.length - 1];
  return lastStruct.id.clock + lastStruct.length;
};
const addStruct = (store, struct) => {
  let structs = store.clients.get(struct.id.client);
  if (structs === void 0) {
    structs = [];
    store.clients.set(struct.id.client, structs);
  } else {
    const lastStruct = structs[structs.length - 1];
    if (lastStruct.id.clock + lastStruct.length !== struct.id.clock) {
      throw unexpectedCase();
    }
  }
  structs.push(struct);
};
const findIndexSS = (structs, clock) => {
  let left = 0;
  let right = structs.length - 1;
  let mid = structs[right];
  let midclock = mid.id.clock;
  if (midclock === clock) {
    return right;
  }
  let midindex = floor(clock / (midclock + mid.length - 1) * right);
  while (left <= right) {
    mid = structs[midindex];
    midclock = mid.id.clock;
    if (midclock <= clock) {
      if (clock < midclock + mid.length) {
        return midindex;
      }
      left = midindex + 1;
    } else {
      right = midindex - 1;
    }
    midindex = floor((left + right) / 2);
  }
  throw unexpectedCase();
};
const find = (store, id) => {
  const structs = store.clients.get(id.client);
  return structs[findIndexSS(structs, id.clock)];
};
const getItem = find;
const findIndexCleanStart = (transaction, structs, clock) => {
  const index = findIndexSS(structs, clock);
  const struct = structs[index];
  if (struct.id.clock < clock && struct instanceof Item) {
    structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
    return index + 1;
  }
  return index;
};
const getItemCleanStart = (transaction, id) => {
  const structs = transaction.doc.store.clients.get(id.client);
  return structs[findIndexCleanStart(transaction, structs, id.clock)];
};
const getItemCleanEnd = (transaction, store, id) => {
  const structs = store.clients.get(id.client);
  const index = findIndexSS(structs, id.clock);
  const struct = structs[index];
  if (id.clock !== struct.id.clock + struct.length - 1 && struct.constructor !== GC) {
    structs.splice(index + 1, 0, splitItem(transaction, struct, id.clock - struct.id.clock + 1));
  }
  return struct;
};
const replaceStruct = (store, struct, newStruct) => {
  const structs = store.clients.get(struct.id.client);
  structs[findIndexSS(structs, struct.id.clock)] = newStruct;
};
const iterateStructs = (transaction, structs, clockStart, len, f) => {
  if (len === 0) {
    return;
  }
  const clockEnd = clockStart + len;
  let index = findIndexCleanStart(transaction, structs, clockStart);
  let struct;
  do {
    struct = structs[index++];
    if (clockEnd < struct.id.clock + struct.length) {
      findIndexCleanStart(transaction, structs, clockEnd);
    }
    f(struct);
  } while (index < structs.length && structs[index].id.clock < clockEnd);
};
class Transaction {
  constructor(doc2, origin, local) {
    this.doc = doc2;
    this.deleteSet = new DeleteSet();
    this.beforeState = getStateVector(doc2.store);
    this.afterState = /* @__PURE__ */ new Map();
    this.changed = /* @__PURE__ */ new Map();
    this.changedParentTypes = /* @__PURE__ */ new Map();
    this._mergeStructs = [];
    this.origin = origin;
    this.meta = /* @__PURE__ */ new Map();
    this.local = local;
    this.subdocsAdded = /* @__PURE__ */ new Set();
    this.subdocsRemoved = /* @__PURE__ */ new Set();
    this.subdocsLoaded = /* @__PURE__ */ new Set();
  }
}
const writeUpdateMessageFromTransaction = (encoder, transaction) => {
  if (transaction.deleteSet.clients.size === 0 && !any(transaction.afterState, (clock, client) => transaction.beforeState.get(client) !== clock)) {
    return false;
  }
  sortAndMergeDeleteSet(transaction.deleteSet);
  writeStructsFromTransaction(encoder, transaction);
  writeDeleteSet(encoder, transaction.deleteSet);
  return true;
};
const addChangedTypeToTransaction = (transaction, type, parentSub) => {
  const item = type._item;
  if (item === null || item.id.clock < (transaction.beforeState.get(item.id.client) || 0) && !item.deleted) {
    setIfUndefined(transaction.changed, type, create$4).add(parentSub);
  }
};
const tryToMergeWithLeft = (structs, pos) => {
  const left = structs[pos - 1];
  const right = structs[pos];
  if (left.deleted === right.deleted && left.constructor === right.constructor) {
    if (left.mergeWith(right)) {
      structs.splice(pos, 1);
      if (right instanceof Item && right.parentSub !== null && right.parent._map.get(right.parentSub) === right) {
        right.parent._map.set(right.parentSub, left);
      }
    }
  }
};
const tryGcDeleteSet = (ds, store, gcFilter) => {
  for (const [client, deleteItems] of ds.clients.entries()) {
    const structs = store.clients.get(client);
    for (let di = deleteItems.length - 1; di >= 0; di--) {
      const deleteItem = deleteItems[di];
      const endDeleteItemClock = deleteItem.clock + deleteItem.len;
      for (let si = findIndexSS(structs, deleteItem.clock), struct = structs[si]; si < structs.length && struct.id.clock < endDeleteItemClock; struct = structs[++si]) {
        const struct2 = structs[si];
        if (deleteItem.clock + deleteItem.len <= struct2.id.clock) {
          break;
        }
        if (struct2 instanceof Item && struct2.deleted && !struct2.keep && gcFilter(struct2)) {
          struct2.gc(store, false);
        }
      }
    }
  }
};
const tryMergeDeleteSet = (ds, store) => {
  ds.clients.forEach((deleteItems, client) => {
    const structs = store.clients.get(client);
    for (let di = deleteItems.length - 1; di >= 0; di--) {
      const deleteItem = deleteItems[di];
      const mostRightIndexToCheck = min(structs.length - 1, 1 + findIndexSS(structs, deleteItem.clock + deleteItem.len - 1));
      for (let si = mostRightIndexToCheck, struct = structs[si]; si > 0 && struct.id.clock >= deleteItem.clock; struct = structs[--si]) {
        tryToMergeWithLeft(structs, si);
      }
    }
  });
};
const cleanupTransactions = (transactionCleanups, i) => {
  if (i < transactionCleanups.length) {
    const transaction = transactionCleanups[i];
    const doc2 = transaction.doc;
    const store = doc2.store;
    const ds = transaction.deleteSet;
    const mergeStructs = transaction._mergeStructs;
    try {
      sortAndMergeDeleteSet(ds);
      transaction.afterState = getStateVector(transaction.doc.store);
      doc2.emit("beforeObserverCalls", [transaction, doc2]);
      const fs = [];
      transaction.changed.forEach((subs, itemtype) => fs.push(() => {
        if (itemtype._item === null || !itemtype._item.deleted) {
          itemtype._callObserver(transaction, subs);
        }
      }));
      fs.push(() => {
        transaction.changedParentTypes.forEach((events, type) => fs.push(() => {
          if (type._item === null || !type._item.deleted) {
            events = events.filter((event) => event.target._item === null || !event.target._item.deleted);
            events.forEach((event) => {
              event.currentTarget = type;
            });
            events.sort((event1, event2) => event1.path.length - event2.path.length);
            callEventHandlerListeners(type._dEH, events, transaction);
          }
        }));
        fs.push(() => doc2.emit("afterTransaction", [transaction, doc2]));
      });
      callAll(fs, []);
    } finally {
      if (doc2.gc) {
        tryGcDeleteSet(ds, store, doc2.gcFilter);
      }
      tryMergeDeleteSet(ds, store);
      transaction.afterState.forEach((clock, client) => {
        const beforeClock = transaction.beforeState.get(client) || 0;
        if (beforeClock !== clock) {
          const structs = store.clients.get(client);
          const firstChangePos = max(findIndexSS(structs, beforeClock), 1);
          for (let i2 = structs.length - 1; i2 >= firstChangePos; i2--) {
            tryToMergeWithLeft(structs, i2);
          }
        }
      });
      for (let i2 = 0; i2 < mergeStructs.length; i2++) {
        const { client, clock } = mergeStructs[i2].id;
        const structs = store.clients.get(client);
        const replacedStructPos = findIndexSS(structs, clock);
        if (replacedStructPos + 1 < structs.length) {
          tryToMergeWithLeft(structs, replacedStructPos + 1);
        }
        if (replacedStructPos > 0) {
          tryToMergeWithLeft(structs, replacedStructPos);
        }
      }
      if (!transaction.local && transaction.afterState.get(doc2.clientID) !== transaction.beforeState.get(doc2.clientID)) {
        print(ORANGE, BOLD, "[yjs] ", UNBOLD, RED, "Changed the client-id because another client seems to be using it.");
        doc2.clientID = generateNewClientId();
      }
      doc2.emit("afterTransactionCleanup", [transaction, doc2]);
      if (doc2._observers.has("update")) {
        const encoder = new UpdateEncoderV1();
        const hasContent2 = writeUpdateMessageFromTransaction(encoder, transaction);
        if (hasContent2) {
          doc2.emit("update", [encoder.toUint8Array(), transaction.origin, doc2, transaction]);
        }
      }
      if (doc2._observers.has("updateV2")) {
        const encoder = new UpdateEncoderV2();
        const hasContent2 = writeUpdateMessageFromTransaction(encoder, transaction);
        if (hasContent2) {
          doc2.emit("updateV2", [encoder.toUint8Array(), transaction.origin, doc2, transaction]);
        }
      }
      const { subdocsAdded, subdocsLoaded, subdocsRemoved } = transaction;
      if (subdocsAdded.size > 0 || subdocsRemoved.size > 0 || subdocsLoaded.size > 0) {
        subdocsAdded.forEach((subdoc) => {
          subdoc.clientID = doc2.clientID;
          if (subdoc.collectionid == null) {
            subdoc.collectionid = doc2.collectionid;
          }
          doc2.subdocs.add(subdoc);
        });
        subdocsRemoved.forEach((subdoc) => doc2.subdocs.delete(subdoc));
        doc2.emit("subdocs", [{ loaded: subdocsLoaded, added: subdocsAdded, removed: subdocsRemoved }, doc2, transaction]);
        subdocsRemoved.forEach((subdoc) => subdoc.destroy());
      }
      if (transactionCleanups.length <= i + 1) {
        doc2._transactionCleanups = [];
        doc2.emit("afterAllTransactions", [doc2, transactionCleanups]);
      } else {
        cleanupTransactions(transactionCleanups, i + 1);
      }
    }
  }
};
const transact = (doc2, f, origin = null, local = true) => {
  const transactionCleanups = doc2._transactionCleanups;
  let initialCall = false;
  if (doc2._transaction === null) {
    initialCall = true;
    doc2._transaction = new Transaction(doc2, origin, local);
    transactionCleanups.push(doc2._transaction);
    if (transactionCleanups.length === 1) {
      doc2.emit("beforeAllTransactions", [doc2]);
    }
    doc2.emit("beforeTransaction", [doc2._transaction, doc2]);
  }
  try {
    f(doc2._transaction);
  } finally {
    if (initialCall) {
      const finishCleanup = doc2._transaction === transactionCleanups[0];
      doc2._transaction = null;
      if (finishCleanup) {
        cleanupTransactions(transactionCleanups, 0);
      }
    }
  }
};
class StackItem {
  constructor(deletions, insertions) {
    this.insertions = insertions;
    this.deletions = deletions;
    this.meta = /* @__PURE__ */ new Map();
  }
}
const clearUndoManagerStackItem = (tr, um, stackItem) => {
  iterateDeletedStructs(tr, stackItem.deletions, (item) => {
    if (item instanceof Item && um.scope.some((type) => isParentOf(type, item))) {
      keepItem(item, false);
    }
  });
};
const popStackItem = (undoManager, stack, eventType) => {
  let result = null;
  let _tr = null;
  const doc2 = undoManager.doc;
  const scope = undoManager.scope;
  transact(doc2, (transaction) => {
    while (stack.length > 0 && result === null) {
      const store = doc2.store;
      const stackItem = stack.pop();
      const itemsToRedo = /* @__PURE__ */ new Set();
      const itemsToDelete = [];
      let performedChange = false;
      iterateDeletedStructs(transaction, stackItem.insertions, (struct) => {
        if (struct instanceof Item) {
          if (struct.redone !== null) {
            let { item, diff } = followRedone(store, struct.id);
            if (diff > 0) {
              item = getItemCleanStart(transaction, createID(item.id.client, item.id.clock + diff));
            }
            struct = item;
          }
          if (!struct.deleted && scope.some((type) => isParentOf(type, struct))) {
            itemsToDelete.push(struct);
          }
        }
      });
      iterateDeletedStructs(transaction, stackItem.deletions, (struct) => {
        if (struct instanceof Item && scope.some((type) => isParentOf(type, struct)) && !isDeleted(stackItem.insertions, struct.id)) {
          itemsToRedo.add(struct);
        }
      });
      itemsToRedo.forEach((struct) => {
        performedChange = redoItem(transaction, struct, itemsToRedo, stackItem.insertions, undoManager.ignoreRemoteMapChanges) !== null || performedChange;
      });
      for (let i = itemsToDelete.length - 1; i >= 0; i--) {
        const item = itemsToDelete[i];
        if (undoManager.deleteFilter(item)) {
          item.delete(transaction);
          performedChange = true;
        }
      }
      result = performedChange ? stackItem : null;
    }
    transaction.changed.forEach((subProps, type) => {
      if (subProps.has(null) && type._searchMarker) {
        type._searchMarker.length = 0;
      }
    });
    _tr = transaction;
  }, undoManager);
  if (result != null) {
    const changedParentTypes = _tr.changedParentTypes;
    undoManager.emit("stack-item-popped", [{ stackItem: result, type: eventType, changedParentTypes }, undoManager]);
  }
  return result;
};
class UndoManager extends Observable {
  constructor(typeScope, {
    captureTimeout = 500,
    captureTransaction = (tr) => true,
    deleteFilter = () => true,
    trackedOrigins = /* @__PURE__ */ new Set([null]),
    ignoreRemoteMapChanges = false,
    doc: doc2 = isArray(typeScope) ? typeScope[0].doc : typeScope.doc
  } = {}) {
    super();
    this.scope = [];
    this.addToScope(typeScope);
    this.deleteFilter = deleteFilter;
    trackedOrigins.add(this);
    this.trackedOrigins = trackedOrigins;
    this.captureTransaction = captureTransaction;
    this.undoStack = [];
    this.redoStack = [];
    this.undoing = false;
    this.redoing = false;
    this.doc = doc2;
    this.lastChange = 0;
    this.ignoreRemoteMapChanges = ignoreRemoteMapChanges;
    this.captureTimeout = captureTimeout;
    this.afterTransactionHandler = (transaction) => {
      if (!this.captureTransaction(transaction) || !this.scope.some((type) => transaction.changedParentTypes.has(type)) || !this.trackedOrigins.has(transaction.origin) && (!transaction.origin || !this.trackedOrigins.has(transaction.origin.constructor))) {
        return;
      }
      const undoing = this.undoing;
      const redoing = this.redoing;
      const stack = undoing ? this.redoStack : this.undoStack;
      if (undoing) {
        this.stopCapturing();
      } else if (!redoing) {
        this.clear(false, true);
      }
      const insertions = new DeleteSet();
      transaction.afterState.forEach((endClock, client) => {
        const startClock = transaction.beforeState.get(client) || 0;
        const len = endClock - startClock;
        if (len > 0) {
          addToDeleteSet(insertions, client, startClock, len);
        }
      });
      const now = getUnixTime();
      let didAdd = false;
      if (this.lastChange > 0 && now - this.lastChange < this.captureTimeout && stack.length > 0 && !undoing && !redoing) {
        const lastOp = stack[stack.length - 1];
        lastOp.deletions = mergeDeleteSets([lastOp.deletions, transaction.deleteSet]);
        lastOp.insertions = mergeDeleteSets([lastOp.insertions, insertions]);
      } else {
        stack.push(new StackItem(transaction.deleteSet, insertions));
        didAdd = true;
      }
      if (!undoing && !redoing) {
        this.lastChange = now;
      }
      iterateDeletedStructs(transaction, transaction.deleteSet, (item) => {
        if (item instanceof Item && this.scope.some((type) => isParentOf(type, item))) {
          keepItem(item, true);
        }
      });
      const changeEvent = [{ stackItem: stack[stack.length - 1], origin: transaction.origin, type: undoing ? "redo" : "undo", changedParentTypes: transaction.changedParentTypes }, this];
      if (didAdd) {
        this.emit("stack-item-added", changeEvent);
      } else {
        this.emit("stack-item-updated", changeEvent);
      }
    };
    this.doc.on("afterTransaction", this.afterTransactionHandler);
    this.doc.on("destroy", () => {
      this.destroy();
    });
  }
  addToScope(ytypes) {
    ytypes = isArray(ytypes) ? ytypes : [ytypes];
    ytypes.forEach((ytype) => {
      if (this.scope.every((yt) => yt !== ytype)) {
        this.scope.push(ytype);
      }
    });
  }
  addTrackedOrigin(origin) {
    this.trackedOrigins.add(origin);
  }
  removeTrackedOrigin(origin) {
    this.trackedOrigins.delete(origin);
  }
  clear(clearUndoStack = true, clearRedoStack = true) {
    if (clearUndoStack && this.canUndo() || clearRedoStack && this.canRedo()) {
      this.doc.transact((tr) => {
        if (clearUndoStack) {
          this.undoStack.forEach((item) => clearUndoManagerStackItem(tr, this, item));
          this.undoStack = [];
        }
        if (clearRedoStack) {
          this.redoStack.forEach((item) => clearUndoManagerStackItem(tr, this, item));
          this.redoStack = [];
        }
        this.emit("stack-cleared", [{ undoStackCleared: clearUndoStack, redoStackCleared: clearRedoStack }]);
      });
    }
  }
  stopCapturing() {
    this.lastChange = 0;
  }
  undo() {
    this.undoing = true;
    let res;
    try {
      res = popStackItem(this, this.undoStack, "undo");
    } finally {
      this.undoing = false;
    }
    return res;
  }
  redo() {
    this.redoing = true;
    let res;
    try {
      res = popStackItem(this, this.redoStack, "redo");
    } finally {
      this.redoing = false;
    }
    return res;
  }
  canUndo() {
    return this.undoStack.length > 0;
  }
  canRedo() {
    return this.redoStack.length > 0;
  }
  destroy() {
    this.trackedOrigins.delete(this);
    this.doc.off("afterTransaction", this.afterTransactionHandler);
    super.destroy();
  }
}
function* lazyStructReaderGenerator(decoder) {
  const numOfStateUpdates = readVarUint(decoder.restDecoder);
  for (let i = 0; i < numOfStateUpdates; i++) {
    const numberOfStructs = readVarUint(decoder.restDecoder);
    const client = decoder.readClient();
    let clock = readVarUint(decoder.restDecoder);
    for (let i2 = 0; i2 < numberOfStructs; i2++) {
      const info = decoder.readInfo();
      if (info === 10) {
        const len = readVarUint(decoder.restDecoder);
        yield new Skip(createID(client, clock), len);
        clock += len;
      } else if ((BITS5 & info) !== 0) {
        const cantCopyParentInfo = (info & (BIT7 | BIT8)) === 0;
        const struct = new Item(createID(client, clock), null, (info & BIT8) === BIT8 ? decoder.readLeftID() : null, null, (info & BIT7) === BIT7 ? decoder.readRightID() : null, cantCopyParentInfo ? decoder.readParentInfo() ? decoder.readString() : decoder.readLeftID() : null, cantCopyParentInfo && (info & BIT6) === BIT6 ? decoder.readString() : null, readItemContent(decoder, info));
        yield struct;
        clock += struct.length;
      } else {
        const len = decoder.readLen();
        yield new GC(createID(client, clock), len);
        clock += len;
      }
    }
  }
}
class LazyStructReader {
  constructor(decoder, filterSkips) {
    this.gen = lazyStructReaderGenerator(decoder);
    this.curr = null;
    this.done = false;
    this.filterSkips = filterSkips;
    this.next();
  }
  next() {
    do {
      this.curr = this.gen.next().value || null;
    } while (this.filterSkips && this.curr !== null && this.curr.constructor === Skip);
    return this.curr;
  }
}
class LazyStructWriter {
  constructor(encoder) {
    this.currClient = 0;
    this.startClock = 0;
    this.written = 0;
    this.encoder = encoder;
    this.clientStructs = [];
  }
}
const mergeUpdates = (updates) => mergeUpdatesV2(updates, UpdateDecoderV1, UpdateEncoderV1);
const sliceStruct = (left, diff) => {
  if (left.constructor === GC) {
    const { client, clock } = left.id;
    return new GC(createID(client, clock + diff), left.length - diff);
  } else if (left.constructor === Skip) {
    const { client, clock } = left.id;
    return new Skip(createID(client, clock + diff), left.length - diff);
  } else {
    const leftItem = left;
    const { client, clock } = leftItem.id;
    return new Item(createID(client, clock + diff), null, createID(client, clock + diff - 1), null, leftItem.rightOrigin, leftItem.parent, leftItem.parentSub, leftItem.content.splice(diff));
  }
};
const mergeUpdatesV2 = (updates, YDecoder = UpdateDecoderV2, YEncoder = UpdateEncoderV2) => {
  if (updates.length === 1) {
    return updates[0];
  }
  const updateDecoders = updates.map((update) => new YDecoder(createDecoder(update)));
  let lazyStructDecoders = updateDecoders.map((decoder) => new LazyStructReader(decoder, true));
  let currWrite = null;
  const updateEncoder = new YEncoder();
  const lazyStructEncoder = new LazyStructWriter(updateEncoder);
  while (true) {
    lazyStructDecoders = lazyStructDecoders.filter((dec) => dec.curr !== null);
    lazyStructDecoders.sort((dec1, dec2) => {
      if (dec1.curr.id.client === dec2.curr.id.client) {
        const clockDiff = dec1.curr.id.clock - dec2.curr.id.clock;
        if (clockDiff === 0) {
          return dec1.curr.constructor === dec2.curr.constructor ? 0 : dec1.curr.constructor === Skip ? 1 : -1;
        } else {
          return clockDiff;
        }
      } else {
        return dec2.curr.id.client - dec1.curr.id.client;
      }
    });
    if (lazyStructDecoders.length === 0) {
      break;
    }
    const currDecoder = lazyStructDecoders[0];
    const firstClient = currDecoder.curr.id.client;
    if (currWrite !== null) {
      let curr = currDecoder.curr;
      let iterated = false;
      while (curr !== null && curr.id.clock + curr.length <= currWrite.struct.id.clock + currWrite.struct.length && curr.id.client >= currWrite.struct.id.client) {
        curr = currDecoder.next();
        iterated = true;
      }
      if (curr === null || curr.id.client !== firstClient || iterated && curr.id.clock > currWrite.struct.id.clock + currWrite.struct.length) {
        continue;
      }
      if (firstClient !== currWrite.struct.id.client) {
        writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
        currWrite = { struct: curr, offset: 0 };
        currDecoder.next();
      } else {
        if (currWrite.struct.id.clock + currWrite.struct.length < curr.id.clock) {
          if (currWrite.struct.constructor === Skip) {
            currWrite.struct.length = curr.id.clock + curr.length - currWrite.struct.id.clock;
          } else {
            writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
            const diff = curr.id.clock - currWrite.struct.id.clock - currWrite.struct.length;
            const struct = new Skip(createID(firstClient, currWrite.struct.id.clock + currWrite.struct.length), diff);
            currWrite = { struct, offset: 0 };
          }
        } else {
          const diff = currWrite.struct.id.clock + currWrite.struct.length - curr.id.clock;
          if (diff > 0) {
            if (currWrite.struct.constructor === Skip) {
              currWrite.struct.length -= diff;
            } else {
              curr = sliceStruct(curr, diff);
            }
          }
          if (!currWrite.struct.mergeWith(curr)) {
            writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
            currWrite = { struct: curr, offset: 0 };
            currDecoder.next();
          }
        }
      }
    } else {
      currWrite = { struct: currDecoder.curr, offset: 0 };
      currDecoder.next();
    }
    for (let next = currDecoder.curr; next !== null && next.id.client === firstClient && next.id.clock === currWrite.struct.id.clock + currWrite.struct.length && next.constructor !== Skip; next = currDecoder.next()) {
      writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
      currWrite = { struct: next, offset: 0 };
    }
  }
  if (currWrite !== null) {
    writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
    currWrite = null;
  }
  finishLazyStructWriting(lazyStructEncoder);
  const dss = updateDecoders.map((decoder) => readDeleteSet(decoder));
  const ds = mergeDeleteSets(dss);
  writeDeleteSet(updateEncoder, ds);
  return updateEncoder.toUint8Array();
};
const diffUpdateV2 = (update, sv, YDecoder = UpdateDecoderV2, YEncoder = UpdateEncoderV2) => {
  const state = decodeStateVector(sv);
  const encoder = new YEncoder();
  const lazyStructWriter = new LazyStructWriter(encoder);
  const decoder = new YDecoder(createDecoder(update));
  const reader = new LazyStructReader(decoder, false);
  while (reader.curr) {
    const curr = reader.curr;
    const currClient = curr.id.client;
    const svClock = state.get(currClient) || 0;
    if (reader.curr.constructor === Skip) {
      reader.next();
      continue;
    }
    if (curr.id.clock + curr.length > svClock) {
      writeStructToLazyStructWriter(lazyStructWriter, curr, max(svClock - curr.id.clock, 0));
      reader.next();
      while (reader.curr && reader.curr.id.client === currClient) {
        writeStructToLazyStructWriter(lazyStructWriter, reader.curr, 0);
        reader.next();
      }
    } else {
      while (reader.curr && reader.curr.id.client === currClient && reader.curr.id.clock + reader.curr.length <= svClock) {
        reader.next();
      }
    }
  }
  finishLazyStructWriting(lazyStructWriter);
  const ds = readDeleteSet(decoder);
  writeDeleteSet(encoder, ds);
  return encoder.toUint8Array();
};
const flushLazyStructWriter = (lazyWriter) => {
  if (lazyWriter.written > 0) {
    lazyWriter.clientStructs.push({ written: lazyWriter.written, restEncoder: toUint8Array(lazyWriter.encoder.restEncoder) });
    lazyWriter.encoder.restEncoder = createEncoder();
    lazyWriter.written = 0;
  }
};
const writeStructToLazyStructWriter = (lazyWriter, struct, offset) => {
  if (lazyWriter.written > 0 && lazyWriter.currClient !== struct.id.client) {
    flushLazyStructWriter(lazyWriter);
  }
  if (lazyWriter.written === 0) {
    lazyWriter.currClient = struct.id.client;
    lazyWriter.encoder.writeClient(struct.id.client);
    writeVarUint(lazyWriter.encoder.restEncoder, struct.id.clock + offset);
  }
  struct.write(lazyWriter.encoder, offset);
  lazyWriter.written++;
};
const finishLazyStructWriting = (lazyWriter) => {
  flushLazyStructWriter(lazyWriter);
  const restEncoder = lazyWriter.encoder.restEncoder;
  writeVarUint(restEncoder, lazyWriter.clientStructs.length);
  for (let i = 0; i < lazyWriter.clientStructs.length; i++) {
    const partStructs = lazyWriter.clientStructs[i];
    writeVarUint(restEncoder, partStructs.written);
    writeUint8Array(restEncoder, partStructs.restEncoder);
  }
};
const convertUpdateFormat = (update, YDecoder, YEncoder) => {
  const updateDecoder = new YDecoder(createDecoder(update));
  const lazyDecoder = new LazyStructReader(updateDecoder, false);
  const updateEncoder = new YEncoder();
  const lazyWriter = new LazyStructWriter(updateEncoder);
  for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
    writeStructToLazyStructWriter(lazyWriter, curr, 0);
  }
  finishLazyStructWriting(lazyWriter);
  const ds = readDeleteSet(updateDecoder);
  writeDeleteSet(updateEncoder, ds);
  return updateEncoder.toUint8Array();
};
const convertUpdateFormatV2ToV1 = (update) => convertUpdateFormat(update, UpdateDecoderV2, UpdateEncoderV1);
class YEvent {
  constructor(target, transaction) {
    this.target = target;
    this.currentTarget = target;
    this.transaction = transaction;
    this._changes = null;
    this._keys = null;
    this._delta = null;
  }
  get path() {
    return getPathTo(this.currentTarget, this.target);
  }
  deletes(struct) {
    return isDeleted(this.transaction.deleteSet, struct.id);
  }
  get keys() {
    if (this._keys === null) {
      const keys2 = /* @__PURE__ */ new Map();
      const target = this.target;
      const changed = this.transaction.changed.get(target);
      changed.forEach((key) => {
        if (key !== null) {
          const item = target._map.get(key);
          let action;
          let oldValue;
          if (this.adds(item)) {
            let prev = item.left;
            while (prev !== null && this.adds(prev)) {
              prev = prev.left;
            }
            if (this.deletes(item)) {
              if (prev !== null && this.deletes(prev)) {
                action = "delete";
                oldValue = last(prev.content.getContent());
              } else {
                return;
              }
            } else {
              if (prev !== null && this.deletes(prev)) {
                action = "update";
                oldValue = last(prev.content.getContent());
              } else {
                action = "add";
                oldValue = void 0;
              }
            }
          } else {
            if (this.deletes(item)) {
              action = "delete";
              oldValue = last(item.content.getContent());
            } else {
              return;
            }
          }
          keys2.set(key, { action, oldValue });
        }
      });
      this._keys = keys2;
    }
    return this._keys;
  }
  get delta() {
    return this.changes.delta;
  }
  adds(struct) {
    return struct.id.clock >= (this.transaction.beforeState.get(struct.id.client) || 0);
  }
  get changes() {
    let changes = this._changes;
    if (changes === null) {
      const target = this.target;
      const added = create$4();
      const deleted = create$4();
      const delta = [];
      changes = {
        added,
        deleted,
        delta,
        keys: this.keys
      };
      const changed = this.transaction.changed.get(target);
      if (changed.has(null)) {
        let lastOp = null;
        const packOp = () => {
          if (lastOp) {
            delta.push(lastOp);
          }
        };
        for (let item = target._start; item !== null; item = item.right) {
          if (item.deleted) {
            if (this.deletes(item) && !this.adds(item)) {
              if (lastOp === null || lastOp.delete === void 0) {
                packOp();
                lastOp = { delete: 0 };
              }
              lastOp.delete += item.length;
              deleted.add(item);
            }
          } else {
            if (this.adds(item)) {
              if (lastOp === null || lastOp.insert === void 0) {
                packOp();
                lastOp = { insert: [] };
              }
              lastOp.insert = lastOp.insert.concat(item.content.getContent());
              added.add(item);
            } else {
              if (lastOp === null || lastOp.retain === void 0) {
                packOp();
                lastOp = { retain: 0 };
              }
              lastOp.retain += item.length;
            }
          }
        }
        if (lastOp !== null && lastOp.retain === void 0) {
          packOp();
        }
      }
      this._changes = changes;
    }
    return changes;
  }
}
const getPathTo = (parent, child) => {
  const path = [];
  while (child._item !== null && child !== parent) {
    if (child._item.parentSub !== null) {
      path.unshift(child._item.parentSub);
    } else {
      let i = 0;
      let c = child._item.parent._start;
      while (c !== child._item && c !== null) {
        if (!c.deleted) {
          i++;
        }
        c = c.right;
      }
      path.unshift(i);
    }
    child = child._item.parent;
  }
  return path;
};
const maxSearchMarker = 80;
let globalSearchMarkerTimestamp = 0;
class ArraySearchMarker {
  constructor(p, index) {
    p.marker = true;
    this.p = p;
    this.index = index;
    this.timestamp = globalSearchMarkerTimestamp++;
  }
}
const refreshMarkerTimestamp = (marker) => {
  marker.timestamp = globalSearchMarkerTimestamp++;
};
const overwriteMarker = (marker, p, index) => {
  marker.p.marker = false;
  marker.p = p;
  p.marker = true;
  marker.index = index;
  marker.timestamp = globalSearchMarkerTimestamp++;
};
const markPosition = (searchMarker, p, index) => {
  if (searchMarker.length >= maxSearchMarker) {
    const marker = searchMarker.reduce((a, b) => a.timestamp < b.timestamp ? a : b);
    overwriteMarker(marker, p, index);
    return marker;
  } else {
    const pm = new ArraySearchMarker(p, index);
    searchMarker.push(pm);
    return pm;
  }
};
const findMarker = (yarray, index) => {
  if (yarray._start === null || index === 0 || yarray._searchMarker === null) {
    return null;
  }
  const marker = yarray._searchMarker.length === 0 ? null : yarray._searchMarker.reduce((a, b) => abs(index - a.index) < abs(index - b.index) ? a : b);
  let p = yarray._start;
  let pindex = 0;
  if (marker !== null) {
    p = marker.p;
    pindex = marker.index;
    refreshMarkerTimestamp(marker);
  }
  while (p.right !== null && pindex < index) {
    if (!p.deleted && p.countable) {
      if (index < pindex + p.length) {
        break;
      }
      pindex += p.length;
    }
    p = p.right;
  }
  while (p.left !== null && pindex > index) {
    p = p.left;
    if (!p.deleted && p.countable) {
      pindex -= p.length;
    }
  }
  while (p.left !== null && p.left.id.client === p.id.client && p.left.id.clock + p.left.length === p.id.clock) {
    p = p.left;
    if (!p.deleted && p.countable) {
      pindex -= p.length;
    }
  }
  if (marker !== null && abs(marker.index - pindex) < p.parent.length / maxSearchMarker) {
    overwriteMarker(marker, p, pindex);
    return marker;
  } else {
    return markPosition(yarray._searchMarker, p, pindex);
  }
};
const updateMarkerChanges = (searchMarker, index, len) => {
  for (let i = searchMarker.length - 1; i >= 0; i--) {
    const m = searchMarker[i];
    if (len > 0) {
      let p = m.p;
      p.marker = false;
      while (p && (p.deleted || !p.countable)) {
        p = p.left;
        if (p && !p.deleted && p.countable) {
          m.index -= p.length;
        }
      }
      if (p === null || p.marker === true) {
        searchMarker.splice(i, 1);
        continue;
      }
      m.p = p;
      p.marker = true;
    }
    if (index < m.index || len > 0 && index === m.index) {
      m.index = max(index, m.index + len);
    }
  }
};
const callTypeObservers = (type, transaction, event) => {
  const changedType = type;
  const changedParentTypes = transaction.changedParentTypes;
  while (true) {
    setIfUndefined(changedParentTypes, type, () => []).push(event);
    if (type._item === null) {
      break;
    }
    type = type._item.parent;
  }
  callEventHandlerListeners(changedType._eH, event, transaction);
};
class AbstractType {
  constructor() {
    this._item = null;
    this._map = /* @__PURE__ */ new Map();
    this._start = null;
    this.doc = null;
    this._length = 0;
    this._eH = createEventHandler();
    this._dEH = createEventHandler();
    this._searchMarker = null;
  }
  get parent() {
    return this._item ? this._item.parent : null;
  }
  _integrate(y, item) {
    this.doc = y;
    this._item = item;
  }
  _copy() {
    throw methodUnimplemented();
  }
  clone() {
    throw methodUnimplemented();
  }
  _write(_encoder) {
  }
  get _first() {
    let n = this._start;
    while (n !== null && n.deleted) {
      n = n.right;
    }
    return n;
  }
  _callObserver(transaction, _parentSubs) {
    if (!transaction.local && this._searchMarker) {
      this._searchMarker.length = 0;
    }
  }
  observe(f) {
    addEventHandlerListener(this._eH, f);
  }
  observeDeep(f) {
    addEventHandlerListener(this._dEH, f);
  }
  unobserve(f) {
    removeEventHandlerListener(this._eH, f);
  }
  unobserveDeep(f) {
    removeEventHandlerListener(this._dEH, f);
  }
  toJSON() {
  }
}
const typeListSlice = (type, start, end) => {
  if (start < 0) {
    start = type._length + start;
  }
  if (end < 0) {
    end = type._length + end;
  }
  let len = end - start;
  const cs = [];
  let n = type._start;
  while (n !== null && len > 0) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      if (c.length <= start) {
        start -= c.length;
      } else {
        for (let i = start; i < c.length && len > 0; i++) {
          cs.push(c[i]);
          len--;
        }
        start = 0;
      }
    }
    n = n.right;
  }
  return cs;
};
const typeListToArray = (type) => {
  const cs = [];
  let n = type._start;
  while (n !== null) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      for (let i = 0; i < c.length; i++) {
        cs.push(c[i]);
      }
    }
    n = n.right;
  }
  return cs;
};
const typeListForEach = (type, f) => {
  let index = 0;
  let n = type._start;
  while (n !== null) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      for (let i = 0; i < c.length; i++) {
        f(c[i], index++, type);
      }
    }
    n = n.right;
  }
};
const typeListMap = (type, f) => {
  const result = [];
  typeListForEach(type, (c, i) => {
    result.push(f(c, i, type));
  });
  return result;
};
const typeListCreateIterator = (type) => {
  let n = type._start;
  let currentContent = null;
  let currentContentIndex = 0;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next: () => {
      if (currentContent === null) {
        while (n !== null && n.deleted) {
          n = n.right;
        }
        if (n === null) {
          return {
            done: true,
            value: void 0
          };
        }
        currentContent = n.content.getContent();
        currentContentIndex = 0;
        n = n.right;
      }
      const value = currentContent[currentContentIndex++];
      if (currentContent.length <= currentContentIndex) {
        currentContent = null;
      }
      return {
        done: false,
        value
      };
    }
  };
};
const typeListGet = (type, index) => {
  const marker = findMarker(type, index);
  let n = type._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
  }
  for (; n !== null; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index < n.length) {
        return n.content.getContent()[index];
      }
      index -= n.length;
    }
  }
};
const typeListInsertGenericsAfter = (transaction, parent, referenceItem, content) => {
  let left = referenceItem;
  const doc2 = transaction.doc;
  const ownClientId = doc2.clientID;
  const store = doc2.store;
  const right = referenceItem === null ? parent._start : referenceItem.right;
  let jsonContent = [];
  const packJsonContent = () => {
    if (jsonContent.length > 0) {
      left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentAny(jsonContent));
      left.integrate(transaction, 0);
      jsonContent = [];
    }
  };
  content.forEach((c) => {
    if (c === null) {
      jsonContent.push(c);
    } else {
      switch (c.constructor) {
        case Number:
        case Object:
        case Boolean:
        case Array:
        case String:
          jsonContent.push(c);
          break;
        default:
          packJsonContent();
          switch (c.constructor) {
            case Uint8Array:
            case ArrayBuffer:
              left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentBinary(new Uint8Array(c)));
              left.integrate(transaction, 0);
              break;
            case Doc:
              left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentDoc(c));
              left.integrate(transaction, 0);
              break;
            default:
              if (c instanceof AbstractType) {
                left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentType(c));
                left.integrate(transaction, 0);
              } else {
                throw new Error("Unexpected content type in insert operation");
              }
          }
      }
    }
  });
  packJsonContent();
};
const lengthExceeded = create$3("Length exceeded!");
const typeListInsertGenerics = (transaction, parent, index, content) => {
  if (index > parent._length) {
    throw lengthExceeded;
  }
  if (index === 0) {
    if (parent._searchMarker) {
      updateMarkerChanges(parent._searchMarker, index, content.length);
    }
    return typeListInsertGenericsAfter(transaction, parent, null, content);
  }
  const startIndex = index;
  const marker = findMarker(parent, index);
  let n = parent._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
    if (index === 0) {
      n = n.prev;
      index += n && n.countable && !n.deleted ? n.length : 0;
    }
  }
  for (; n !== null; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index <= n.length) {
        if (index < n.length) {
          getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
        }
        break;
      }
      index -= n.length;
    }
  }
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, startIndex, content.length);
  }
  return typeListInsertGenericsAfter(transaction, parent, n, content);
};
const typeListPushGenerics = (transaction, parent, content) => {
  const marker = (parent._searchMarker || []).reduce((maxMarker, currMarker) => currMarker.index > maxMarker.index ? currMarker : maxMarker, { index: 0, p: parent._start });
  let n = marker.p;
  if (n) {
    while (n.right) {
      n = n.right;
    }
  }
  return typeListInsertGenericsAfter(transaction, parent, n, content);
};
const typeListDelete = (transaction, parent, index, length2) => {
  if (length2 === 0) {
    return;
  }
  const startIndex = index;
  const startLength = length2;
  const marker = findMarker(parent, index);
  let n = parent._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
  }
  for (; n !== null && index > 0; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index < n.length) {
        getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
      }
      index -= n.length;
    }
  }
  while (length2 > 0 && n !== null) {
    if (!n.deleted) {
      if (length2 < n.length) {
        getItemCleanStart(transaction, createID(n.id.client, n.id.clock + length2));
      }
      n.delete(transaction);
      length2 -= n.length;
    }
    n = n.right;
  }
  if (length2 > 0) {
    throw lengthExceeded;
  }
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, startIndex, -startLength + length2);
  }
};
const typeMapDelete = (transaction, parent, key) => {
  const c = parent._map.get(key);
  if (c !== void 0) {
    c.delete(transaction);
  }
};
const typeMapSet = (transaction, parent, key, value) => {
  const left = parent._map.get(key) || null;
  const doc2 = transaction.doc;
  const ownClientId = doc2.clientID;
  let content;
  if (value == null) {
    content = new ContentAny([value]);
  } else {
    switch (value.constructor) {
      case Number:
      case Object:
      case Boolean:
      case Array:
      case String:
        content = new ContentAny([value]);
        break;
      case Uint8Array:
        content = new ContentBinary(value);
        break;
      case Doc:
        content = new ContentDoc(value);
        break;
      default:
        if (value instanceof AbstractType) {
          content = new ContentType(value);
        } else {
          throw new Error("Unexpected content type");
        }
    }
  }
  new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, null, null, parent, key, content).integrate(transaction, 0);
};
const typeMapGet = (parent, key) => {
  const val = parent._map.get(key);
  return val !== void 0 && !val.deleted ? val.content.getContent()[val.length - 1] : void 0;
};
const typeMapGetAll = (parent) => {
  const res = {};
  parent._map.forEach((value, key) => {
    if (!value.deleted) {
      res[key] = value.content.getContent()[value.length - 1];
    }
  });
  return res;
};
const typeMapHas = (parent, key) => {
  const val = parent._map.get(key);
  return val !== void 0 && !val.deleted;
};
const createMapIterator = (map2) => iteratorFilter(map2.entries(), (entry) => !entry[1].deleted);
class YArrayEvent extends YEvent {
  constructor(yarray, transaction) {
    super(yarray, transaction);
    this._transaction = transaction;
  }
}
class YArray extends AbstractType {
  constructor() {
    super();
    this._prelimContent = [];
    this._searchMarker = [];
  }
  static from(items) {
    const a = new YArray();
    a.push(items);
    return a;
  }
  _integrate(y, item) {
    super._integrate(y, item);
    this.insert(0, this._prelimContent);
    this._prelimContent = null;
  }
  _copy() {
    return new YArray();
  }
  clone() {
    const arr = new YArray();
    arr.insert(0, this.toArray().map((el) => el instanceof AbstractType ? el.clone() : el));
    return arr;
  }
  get length() {
    return this._prelimContent === null ? this._length : this._prelimContent.length;
  }
  _callObserver(transaction, parentSubs) {
    super._callObserver(transaction, parentSubs);
    callTypeObservers(this, transaction, new YArrayEvent(this, transaction));
  }
  insert(index, content) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListInsertGenerics(transaction, this, index, content);
      });
    } else {
      this._prelimContent.splice(index, 0, ...content);
    }
  }
  push(content) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListPushGenerics(transaction, this, content);
      });
    } else {
      this._prelimContent.push(...content);
    }
  }
  unshift(content) {
    this.insert(0, content);
  }
  delete(index, length2 = 1) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListDelete(transaction, this, index, length2);
      });
    } else {
      this._prelimContent.splice(index, length2);
    }
  }
  get(index) {
    return typeListGet(this, index);
  }
  toArray() {
    return typeListToArray(this);
  }
  slice(start = 0, end = this.length) {
    return typeListSlice(this, start, end);
  }
  toJSON() {
    return this.map((c) => c instanceof AbstractType ? c.toJSON() : c);
  }
  map(f) {
    return typeListMap(this, f);
  }
  forEach(f) {
    typeListForEach(this, f);
  }
  [Symbol.iterator]() {
    return typeListCreateIterator(this);
  }
  _write(encoder) {
    encoder.writeTypeRef(YArrayRefID);
  }
}
const readYArray = (_decoder) => new YArray();
class YMapEvent extends YEvent {
  constructor(ymap, transaction, subs) {
    super(ymap, transaction);
    this.keysChanged = subs;
  }
}
class YMap extends AbstractType {
  constructor(entries) {
    super();
    this._prelimContent = null;
    if (entries === void 0) {
      this._prelimContent = /* @__PURE__ */ new Map();
    } else {
      this._prelimContent = new Map(entries);
    }
  }
  _integrate(y, item) {
    super._integrate(y, item);
    this._prelimContent.forEach((value, key) => {
      this.set(key, value);
    });
    this._prelimContent = null;
  }
  _copy() {
    return new YMap();
  }
  clone() {
    const map2 = new YMap();
    this.forEach((value, key) => {
      map2.set(key, value instanceof AbstractType ? value.clone() : value);
    });
    return map2;
  }
  _callObserver(transaction, parentSubs) {
    callTypeObservers(this, transaction, new YMapEvent(this, transaction, parentSubs));
  }
  toJSON() {
    const map2 = {};
    this._map.forEach((item, key) => {
      if (!item.deleted) {
        const v = item.content.getContent()[item.length - 1];
        map2[key] = v instanceof AbstractType ? v.toJSON() : v;
      }
    });
    return map2;
  }
  get size() {
    return [...createMapIterator(this._map)].length;
  }
  keys() {
    return iteratorMap(createMapIterator(this._map), (v) => v[0]);
  }
  values() {
    return iteratorMap(createMapIterator(this._map), (v) => v[1].content.getContent()[v[1].length - 1]);
  }
  entries() {
    return iteratorMap(createMapIterator(this._map), (v) => [v[0], v[1].content.getContent()[v[1].length - 1]]);
  }
  forEach(f) {
    this._map.forEach((item, key) => {
      if (!item.deleted) {
        f(item.content.getContent()[item.length - 1], key, this);
      }
    });
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  delete(key) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapDelete(transaction, this, key);
      });
    } else {
      this._prelimContent.delete(key);
    }
  }
  set(key, value) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapSet(transaction, this, key, value);
      });
    } else {
      this._prelimContent.set(key, value);
    }
    return value;
  }
  get(key) {
    return typeMapGet(this, key);
  }
  has(key) {
    return typeMapHas(this, key);
  }
  clear() {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        this.forEach(function(_value, key, map2) {
          typeMapDelete(transaction, map2, key);
        });
      });
    } else {
      this._prelimContent.clear();
    }
  }
  _write(encoder) {
    encoder.writeTypeRef(YMapRefID);
  }
}
const readYMap = (_decoder) => new YMap();
const equalAttrs = (a, b) => a === b || typeof a === "object" && typeof b === "object" && a && b && equalFlat(a, b);
class ItemTextListPosition {
  constructor(left, right, index, currentAttributes) {
    this.left = left;
    this.right = right;
    this.index = index;
    this.currentAttributes = currentAttributes;
  }
  forward() {
    if (this.right === null) {
      unexpectedCase();
    }
    switch (this.right.content.constructor) {
      case ContentFormat:
        if (!this.right.deleted) {
          updateCurrentAttributes(this.currentAttributes, this.right.content);
        }
        break;
      default:
        if (!this.right.deleted) {
          this.index += this.right.length;
        }
        break;
    }
    this.left = this.right;
    this.right = this.right.right;
  }
}
const findNextPosition = (transaction, pos, count) => {
  while (pos.right !== null && count > 0) {
    switch (pos.right.content.constructor) {
      case ContentFormat:
        if (!pos.right.deleted) {
          updateCurrentAttributes(pos.currentAttributes, pos.right.content);
        }
        break;
      default:
        if (!pos.right.deleted) {
          if (count < pos.right.length) {
            getItemCleanStart(transaction, createID(pos.right.id.client, pos.right.id.clock + count));
          }
          pos.index += pos.right.length;
          count -= pos.right.length;
        }
        break;
    }
    pos.left = pos.right;
    pos.right = pos.right.right;
  }
  return pos;
};
const findPosition = (transaction, parent, index) => {
  const currentAttributes = /* @__PURE__ */ new Map();
  const marker = findMarker(parent, index);
  if (marker) {
    const pos = new ItemTextListPosition(marker.p.left, marker.p, marker.index, currentAttributes);
    return findNextPosition(transaction, pos, index - marker.index);
  } else {
    const pos = new ItemTextListPosition(null, parent._start, 0, currentAttributes);
    return findNextPosition(transaction, pos, index);
  }
};
const insertNegatedAttributes = (transaction, parent, currPos, negatedAttributes) => {
  while (currPos.right !== null && (currPos.right.deleted === true || currPos.right.content.constructor === ContentFormat && equalAttrs(negatedAttributes.get(currPos.right.content.key), currPos.right.content.value))) {
    if (!currPos.right.deleted) {
      negatedAttributes.delete(currPos.right.content.key);
    }
    currPos.forward();
  }
  const doc2 = transaction.doc;
  const ownClientId = doc2.clientID;
  negatedAttributes.forEach((val, key) => {
    const left = currPos.left;
    const right = currPos.right;
    const nextFormat = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
    nextFormat.integrate(transaction, 0);
    currPos.right = nextFormat;
    currPos.forward();
  });
};
const updateCurrentAttributes = (currentAttributes, format) => {
  const { key, value } = format;
  if (value === null) {
    currentAttributes.delete(key);
  } else {
    currentAttributes.set(key, value);
  }
};
const minimizeAttributeChanges = (currPos, attributes) => {
  while (true) {
    if (currPos.right === null) {
      break;
    } else if (currPos.right.deleted || currPos.right.content.constructor === ContentFormat && equalAttrs(attributes[currPos.right.content.key] || null, currPos.right.content.value))
      ;
    else {
      break;
    }
    currPos.forward();
  }
};
const insertAttributes = (transaction, parent, currPos, attributes) => {
  const doc2 = transaction.doc;
  const ownClientId = doc2.clientID;
  const negatedAttributes = /* @__PURE__ */ new Map();
  for (const key in attributes) {
    const val = attributes[key];
    const currentVal = currPos.currentAttributes.get(key) || null;
    if (!equalAttrs(currentVal, val)) {
      negatedAttributes.set(key, currentVal);
      const { left, right } = currPos;
      currPos.right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
      currPos.right.integrate(transaction, 0);
      currPos.forward();
    }
  }
  return negatedAttributes;
};
const insertText = (transaction, parent, currPos, text, attributes) => {
  currPos.currentAttributes.forEach((_val, key) => {
    if (attributes[key] === void 0) {
      attributes[key] = null;
    }
  });
  const doc2 = transaction.doc;
  const ownClientId = doc2.clientID;
  minimizeAttributeChanges(currPos, attributes);
  const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
  const content = text.constructor === String ? new ContentString(text) : text instanceof AbstractType ? new ContentType(text) : new ContentEmbed(text);
  let { left, right, index } = currPos;
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, currPos.index, content.getLength());
  }
  right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, content);
  right.integrate(transaction, 0);
  currPos.right = right;
  currPos.index = index;
  currPos.forward();
  insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
};
const formatText = (transaction, parent, currPos, length2, attributes) => {
  const doc2 = transaction.doc;
  const ownClientId = doc2.clientID;
  minimizeAttributeChanges(currPos, attributes);
  const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
  iterationLoop:
    while (currPos.right !== null && (length2 > 0 || negatedAttributes.size > 0 && (currPos.right.deleted || currPos.right.content.constructor === ContentFormat))) {
      if (!currPos.right.deleted) {
        switch (currPos.right.content.constructor) {
          case ContentFormat: {
            const { key, value } = currPos.right.content;
            const attr = attributes[key];
            if (attr !== void 0) {
              if (equalAttrs(attr, value)) {
                negatedAttributes.delete(key);
              } else {
                if (length2 === 0) {
                  break iterationLoop;
                }
                negatedAttributes.set(key, value);
              }
              currPos.right.delete(transaction);
            } else {
              currPos.currentAttributes.set(key, value);
            }
            break;
          }
          default:
            if (length2 < currPos.right.length) {
              getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length2));
            }
            length2 -= currPos.right.length;
            break;
        }
      }
      currPos.forward();
    }
  if (length2 > 0) {
    let newlines = "";
    for (; length2 > 0; length2--) {
      newlines += "\n";
    }
    currPos.right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), currPos.left, currPos.left && currPos.left.lastId, currPos.right, currPos.right && currPos.right.id, parent, null, new ContentString(newlines));
    currPos.right.integrate(transaction, 0);
    currPos.forward();
  }
  insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
};
const cleanupFormattingGap = (transaction, start, curr, startAttributes, currAttributes) => {
  let end = curr;
  const endAttributes = copy(currAttributes);
  while (end && (!end.countable || end.deleted)) {
    if (!end.deleted && end.content.constructor === ContentFormat) {
      updateCurrentAttributes(endAttributes, end.content);
    }
    end = end.right;
  }
  let cleanups = 0;
  let reachedEndOfCurr = false;
  while (start !== end) {
    if (curr === start) {
      reachedEndOfCurr = true;
    }
    if (!start.deleted) {
      const content = start.content;
      switch (content.constructor) {
        case ContentFormat: {
          const { key, value } = content;
          const startAttrValue = startAttributes.get(key) || null;
          if ((endAttributes.get(key) || null) !== value || startAttrValue === value) {
            start.delete(transaction);
            cleanups++;
            if (!reachedEndOfCurr && (currAttributes.get(key) || null) === value && (startAttributes.get(key) || null) !== value) {
              if (startAttrValue === null) {
                currAttributes.delete(key);
              } else {
                currAttributes.set(key, startAttrValue);
              }
            }
          }
          break;
        }
      }
    }
    start = start.right;
  }
  return cleanups;
};
const cleanupContextlessFormattingGap = (transaction, item) => {
  while (item && item.right && (item.right.deleted || !item.right.countable)) {
    item = item.right;
  }
  const attrs = /* @__PURE__ */ new Set();
  while (item && (item.deleted || !item.countable)) {
    if (!item.deleted && item.content.constructor === ContentFormat) {
      const key = item.content.key;
      if (attrs.has(key)) {
        item.delete(transaction);
      } else {
        attrs.add(key);
      }
    }
    item = item.left;
  }
};
const cleanupYTextFormatting = (type) => {
  let res = 0;
  transact(type.doc, (transaction) => {
    let start = type._start;
    let end = type._start;
    let startAttributes = create$5();
    const currentAttributes = copy(startAttributes);
    while (end) {
      if (end.deleted === false) {
        switch (end.content.constructor) {
          case ContentFormat:
            updateCurrentAttributes(currentAttributes, end.content);
            break;
          default:
            res += cleanupFormattingGap(transaction, start, end, startAttributes, currentAttributes);
            startAttributes = copy(currentAttributes);
            start = end;
            break;
        }
      }
      end = end.right;
    }
  });
  return res;
};
const deleteText = (transaction, currPos, length2) => {
  const startLength = length2;
  const startAttrs = copy(currPos.currentAttributes);
  const start = currPos.right;
  while (length2 > 0 && currPos.right !== null) {
    if (currPos.right.deleted === false) {
      switch (currPos.right.content.constructor) {
        case ContentType:
        case ContentEmbed:
        case ContentString:
          if (length2 < currPos.right.length) {
            getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length2));
          }
          length2 -= currPos.right.length;
          currPos.right.delete(transaction);
          break;
      }
    }
    currPos.forward();
  }
  if (start) {
    cleanupFormattingGap(transaction, start, currPos.right, startAttrs, currPos.currentAttributes);
  }
  const parent = (currPos.left || currPos.right).parent;
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, currPos.index, -startLength + length2);
  }
  return currPos;
};
class YTextEvent extends YEvent {
  constructor(ytext, transaction, subs) {
    super(ytext, transaction);
    this.childListChanged = false;
    this.keysChanged = /* @__PURE__ */ new Set();
    subs.forEach((sub) => {
      if (sub === null) {
        this.childListChanged = true;
      } else {
        this.keysChanged.add(sub);
      }
    });
  }
  get changes() {
    if (this._changes === null) {
      const changes = {
        keys: this.keys,
        delta: this.delta,
        added: /* @__PURE__ */ new Set(),
        deleted: /* @__PURE__ */ new Set()
      };
      this._changes = changes;
    }
    return this._changes;
  }
  get delta() {
    if (this._delta === null) {
      const y = this.target.doc;
      const delta = [];
      transact(y, (transaction) => {
        const currentAttributes = /* @__PURE__ */ new Map();
        const oldAttributes = /* @__PURE__ */ new Map();
        let item = this.target._start;
        let action = null;
        const attributes = {};
        let insert = "";
        let retain = 0;
        let deleteLen = 0;
        const addOp = () => {
          if (action !== null) {
            let op;
            switch (action) {
              case "delete":
                op = { delete: deleteLen };
                deleteLen = 0;
                break;
              case "insert":
                op = { insert };
                if (currentAttributes.size > 0) {
                  op.attributes = {};
                  currentAttributes.forEach((value, key) => {
                    if (value !== null) {
                      op.attributes[key] = value;
                    }
                  });
                }
                insert = "";
                break;
              case "retain":
                op = { retain };
                if (Object.keys(attributes).length > 0) {
                  op.attributes = {};
                  for (const key in attributes) {
                    op.attributes[key] = attributes[key];
                  }
                }
                retain = 0;
                break;
            }
            delta.push(op);
            action = null;
          }
        };
        while (item !== null) {
          switch (item.content.constructor) {
            case ContentType:
            case ContentEmbed:
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  addOp();
                  action = "insert";
                  insert = item.content.getContent()[0];
                  addOp();
                }
              } else if (this.deletes(item)) {
                if (action !== "delete") {
                  addOp();
                  action = "delete";
                }
                deleteLen += 1;
              } else if (!item.deleted) {
                if (action !== "retain") {
                  addOp();
                  action = "retain";
                }
                retain += 1;
              }
              break;
            case ContentString:
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  if (action !== "insert") {
                    addOp();
                    action = "insert";
                  }
                  insert += item.content.str;
                }
              } else if (this.deletes(item)) {
                if (action !== "delete") {
                  addOp();
                  action = "delete";
                }
                deleteLen += item.length;
              } else if (!item.deleted) {
                if (action !== "retain") {
                  addOp();
                  action = "retain";
                }
                retain += item.length;
              }
              break;
            case ContentFormat: {
              const { key, value } = item.content;
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  const curVal = currentAttributes.get(key) || null;
                  if (!equalAttrs(curVal, value)) {
                    if (action === "retain") {
                      addOp();
                    }
                    if (equalAttrs(value, oldAttributes.get(key) || null)) {
                      delete attributes[key];
                    } else {
                      attributes[key] = value;
                    }
                  } else if (value !== null) {
                    item.delete(transaction);
                  }
                }
              } else if (this.deletes(item)) {
                oldAttributes.set(key, value);
                const curVal = currentAttributes.get(key) || null;
                if (!equalAttrs(curVal, value)) {
                  if (action === "retain") {
                    addOp();
                  }
                  attributes[key] = curVal;
                }
              } else if (!item.deleted) {
                oldAttributes.set(key, value);
                const attr = attributes[key];
                if (attr !== void 0) {
                  if (!equalAttrs(attr, value)) {
                    if (action === "retain") {
                      addOp();
                    }
                    if (value === null) {
                      delete attributes[key];
                    } else {
                      attributes[key] = value;
                    }
                  } else if (attr !== null) {
                    item.delete(transaction);
                  }
                }
              }
              if (!item.deleted) {
                if (action === "insert") {
                  addOp();
                }
                updateCurrentAttributes(currentAttributes, item.content);
              }
              break;
            }
          }
          item = item.right;
        }
        addOp();
        while (delta.length > 0) {
          const lastOp = delta[delta.length - 1];
          if (lastOp.retain !== void 0 && lastOp.attributes === void 0) {
            delta.pop();
          } else {
            break;
          }
        }
      });
      this._delta = delta;
    }
    return this._delta;
  }
}
class YText extends AbstractType {
  constructor(string) {
    super();
    this._pending = string !== void 0 ? [() => this.insert(0, string)] : [];
    this._searchMarker = [];
  }
  get length() {
    return this._length;
  }
  _integrate(y, item) {
    super._integrate(y, item);
    try {
      this._pending.forEach((f) => f());
    } catch (e) {
      console.error(e);
    }
    this._pending = null;
  }
  _copy() {
    return new YText();
  }
  clone() {
    const text = new YText();
    text.applyDelta(this.toDelta());
    return text;
  }
  _callObserver(transaction, parentSubs) {
    super._callObserver(transaction, parentSubs);
    const event = new YTextEvent(this, transaction, parentSubs);
    const doc2 = transaction.doc;
    callTypeObservers(this, transaction, event);
    if (!transaction.local) {
      let foundFormattingItem = false;
      for (const [client, afterClock] of transaction.afterState.entries()) {
        const clock = transaction.beforeState.get(client) || 0;
        if (afterClock === clock) {
          continue;
        }
        iterateStructs(transaction, doc2.store.clients.get(client), clock, afterClock, (item) => {
          if (!item.deleted && item.content.constructor === ContentFormat) {
            foundFormattingItem = true;
          }
        });
        if (foundFormattingItem) {
          break;
        }
      }
      if (!foundFormattingItem) {
        iterateDeletedStructs(transaction, transaction.deleteSet, (item) => {
          if (item instanceof GC || foundFormattingItem) {
            return;
          }
          if (item.parent === this && item.content.constructor === ContentFormat) {
            foundFormattingItem = true;
          }
        });
      }
      transact(doc2, (t) => {
        if (foundFormattingItem) {
          cleanupYTextFormatting(this);
        } else {
          iterateDeletedStructs(t, t.deleteSet, (item) => {
            if (item instanceof GC) {
              return;
            }
            if (item.parent === this) {
              cleanupContextlessFormattingGap(t, item);
            }
          });
        }
      });
    }
  }
  toString() {
    let str = "";
    let n = this._start;
    while (n !== null) {
      if (!n.deleted && n.countable && n.content.constructor === ContentString) {
        str += n.content.str;
      }
      n = n.right;
    }
    return str;
  }
  toJSON() {
    return this.toString();
  }
  applyDelta(delta, { sanitize = true } = {}) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        const currPos = new ItemTextListPosition(null, this._start, 0, /* @__PURE__ */ new Map());
        for (let i = 0; i < delta.length; i++) {
          const op = delta[i];
          if (op.insert !== void 0) {
            const ins = !sanitize && typeof op.insert === "string" && i === delta.length - 1 && currPos.right === null && op.insert.slice(-1) === "\n" ? op.insert.slice(0, -1) : op.insert;
            if (typeof ins !== "string" || ins.length > 0) {
              insertText(transaction, this, currPos, ins, op.attributes || {});
            }
          } else if (op.retain !== void 0) {
            formatText(transaction, this, currPos, op.retain, op.attributes || {});
          } else if (op.delete !== void 0) {
            deleteText(transaction, currPos, op.delete);
          }
        }
      });
    } else {
      this._pending.push(() => this.applyDelta(delta));
    }
  }
  toDelta(snapshot, prevSnapshot, computeYChange) {
    const ops = [];
    const currentAttributes = /* @__PURE__ */ new Map();
    const doc2 = this.doc;
    let str = "";
    let n = this._start;
    function packStr() {
      if (str.length > 0) {
        const attributes = {};
        let addAttributes = false;
        currentAttributes.forEach((value, key) => {
          addAttributes = true;
          attributes[key] = value;
        });
        const op = { insert: str };
        if (addAttributes) {
          op.attributes = attributes;
        }
        ops.push(op);
        str = "";
      }
    }
    transact(doc2, (transaction) => {
      if (snapshot) {
        splitSnapshotAffectedStructs(transaction, snapshot);
      }
      if (prevSnapshot) {
        splitSnapshotAffectedStructs(transaction, prevSnapshot);
      }
      while (n !== null) {
        if (isVisible(n, snapshot) || prevSnapshot !== void 0 && isVisible(n, prevSnapshot)) {
          switch (n.content.constructor) {
            case ContentString: {
              const cur = currentAttributes.get("ychange");
              if (snapshot !== void 0 && !isVisible(n, snapshot)) {
                if (cur === void 0 || cur.user !== n.id.client || cur.type !== "removed") {
                  packStr();
                  currentAttributes.set("ychange", computeYChange ? computeYChange("removed", n.id) : { type: "removed" });
                }
              } else if (prevSnapshot !== void 0 && !isVisible(n, prevSnapshot)) {
                if (cur === void 0 || cur.user !== n.id.client || cur.type !== "added") {
                  packStr();
                  currentAttributes.set("ychange", computeYChange ? computeYChange("added", n.id) : { type: "added" });
                }
              } else if (cur !== void 0) {
                packStr();
                currentAttributes.delete("ychange");
              }
              str += n.content.str;
              break;
            }
            case ContentType:
            case ContentEmbed: {
              packStr();
              const op = {
                insert: n.content.getContent()[0]
              };
              if (currentAttributes.size > 0) {
                const attrs = {};
                op.attributes = attrs;
                currentAttributes.forEach((value, key) => {
                  attrs[key] = value;
                });
              }
              ops.push(op);
              break;
            }
            case ContentFormat:
              if (isVisible(n, snapshot)) {
                packStr();
                updateCurrentAttributes(currentAttributes, n.content);
              }
              break;
          }
        }
        n = n.right;
      }
      packStr();
    }, "cleanup");
    return ops;
  }
  insert(index, text, attributes) {
    if (text.length <= 0) {
      return;
    }
    const y = this.doc;
    if (y !== null) {
      transact(y, (transaction) => {
        const pos = findPosition(transaction, this, index);
        if (!attributes) {
          attributes = {};
          pos.currentAttributes.forEach((v, k) => {
            attributes[k] = v;
          });
        }
        insertText(transaction, this, pos, text, attributes);
      });
    } else {
      this._pending.push(() => this.insert(index, text, attributes));
    }
  }
  insertEmbed(index, embed, attributes = {}) {
    const y = this.doc;
    if (y !== null) {
      transact(y, (transaction) => {
        const pos = findPosition(transaction, this, index);
        insertText(transaction, this, pos, embed, attributes);
      });
    } else {
      this._pending.push(() => this.insertEmbed(index, embed, attributes));
    }
  }
  delete(index, length2) {
    if (length2 === 0) {
      return;
    }
    const y = this.doc;
    if (y !== null) {
      transact(y, (transaction) => {
        deleteText(transaction, findPosition(transaction, this, index), length2);
      });
    } else {
      this._pending.push(() => this.delete(index, length2));
    }
  }
  format(index, length2, attributes) {
    if (length2 === 0) {
      return;
    }
    const y = this.doc;
    if (y !== null) {
      transact(y, (transaction) => {
        const pos = findPosition(transaction, this, index);
        if (pos.right === null) {
          return;
        }
        formatText(transaction, this, pos, length2, attributes);
      });
    } else {
      this._pending.push(() => this.format(index, length2, attributes));
    }
  }
  removeAttribute(attributeName) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapDelete(transaction, this, attributeName);
      });
    } else {
      this._pending.push(() => this.removeAttribute(attributeName));
    }
  }
  setAttribute(attributeName, attributeValue) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapSet(transaction, this, attributeName, attributeValue);
      });
    } else {
      this._pending.push(() => this.setAttribute(attributeName, attributeValue));
    }
  }
  getAttribute(attributeName) {
    return typeMapGet(this, attributeName);
  }
  getAttributes() {
    return typeMapGetAll(this);
  }
  _write(encoder) {
    encoder.writeTypeRef(YTextRefID);
  }
}
const readYText = (_decoder) => new YText();
class YXmlTreeWalker {
  constructor(root, f = () => true) {
    this._filter = f;
    this._root = root;
    this._currentNode = root._start;
    this._firstCall = true;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    let n = this._currentNode;
    let type = n && n.content && n.content.type;
    if (n !== null && (!this._firstCall || n.deleted || !this._filter(type))) {
      do {
        type = n.content.type;
        if (!n.deleted && (type.constructor === YXmlElement || type.constructor === YXmlFragment) && type._start !== null) {
          n = type._start;
        } else {
          while (n !== null) {
            if (n.right !== null) {
              n = n.right;
              break;
            } else if (n.parent === this._root) {
              n = null;
            } else {
              n = n.parent._item;
            }
          }
        }
      } while (n !== null && (n.deleted || !this._filter(n.content.type)));
    }
    this._firstCall = false;
    if (n === null) {
      return { value: void 0, done: true };
    }
    this._currentNode = n;
    return { value: n.content.type, done: false };
  }
}
class YXmlFragment extends AbstractType {
  constructor() {
    super();
    this._prelimContent = [];
  }
  get firstChild() {
    const first = this._first;
    return first ? first.content.getContent()[0] : null;
  }
  _integrate(y, item) {
    super._integrate(y, item);
    this.insert(0, this._prelimContent);
    this._prelimContent = null;
  }
  _copy() {
    return new YXmlFragment();
  }
  clone() {
    const el = new YXmlFragment();
    el.insert(0, this.toArray().map((item) => item instanceof AbstractType ? item.clone() : item));
    return el;
  }
  get length() {
    return this._prelimContent === null ? this._length : this._prelimContent.length;
  }
  createTreeWalker(filter) {
    return new YXmlTreeWalker(this, filter);
  }
  querySelector(query) {
    query = query.toUpperCase();
    const iterator = new YXmlTreeWalker(this, (element) => element.nodeName && element.nodeName.toUpperCase() === query);
    const next = iterator.next();
    if (next.done) {
      return null;
    } else {
      return next.value;
    }
  }
  querySelectorAll(query) {
    query = query.toUpperCase();
    return Array.from(new YXmlTreeWalker(this, (element) => element.nodeName && element.nodeName.toUpperCase() === query));
  }
  _callObserver(transaction, parentSubs) {
    callTypeObservers(this, transaction, new YXmlEvent(this, parentSubs, transaction));
  }
  toString() {
    return typeListMap(this, (xml) => xml.toString()).join("");
  }
  toJSON() {
    return this.toString();
  }
  toDOM(_document = document, hooks = {}, binding) {
    const fragment = _document.createDocumentFragment();
    if (binding !== void 0) {
      binding._createAssociation(fragment, this);
    }
    typeListForEach(this, (xmlType) => {
      fragment.insertBefore(xmlType.toDOM(_document, hooks, binding), null);
    });
    return fragment;
  }
  insert(index, content) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListInsertGenerics(transaction, this, index, content);
      });
    } else {
      this._prelimContent.splice(index, 0, ...content);
    }
  }
  insertAfter(ref, content) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        const refItem = ref && ref instanceof AbstractType ? ref._item : ref;
        typeListInsertGenericsAfter(transaction, this, refItem, content);
      });
    } else {
      const pc = this._prelimContent;
      const index = ref === null ? 0 : pc.findIndex((el) => el === ref) + 1;
      if (index === 0 && ref !== null) {
        throw create$3("Reference item not found");
      }
      pc.splice(index, 0, ...content);
    }
  }
  delete(index, length2 = 1) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListDelete(transaction, this, index, length2);
      });
    } else {
      this._prelimContent.splice(index, length2);
    }
  }
  toArray() {
    return typeListToArray(this);
  }
  push(content) {
    this.insert(this.length, content);
  }
  unshift(content) {
    this.insert(0, content);
  }
  get(index) {
    return typeListGet(this, index);
  }
  slice(start = 0, end = this.length) {
    return typeListSlice(this, start, end);
  }
  forEach(f) {
    typeListForEach(this, f);
  }
  _write(encoder) {
    encoder.writeTypeRef(YXmlFragmentRefID);
  }
}
const readYXmlFragment = (_decoder) => new YXmlFragment();
class YXmlElement extends YXmlFragment {
  constructor(nodeName = "UNDEFINED") {
    super();
    this.nodeName = nodeName;
    this._prelimAttrs = /* @__PURE__ */ new Map();
  }
  get nextSibling() {
    const n = this._item ? this._item.next : null;
    return n ? n.content.type : null;
  }
  get prevSibling() {
    const n = this._item ? this._item.prev : null;
    return n ? n.content.type : null;
  }
  _integrate(y, item) {
    super._integrate(y, item);
    this._prelimAttrs.forEach((value, key) => {
      this.setAttribute(key, value);
    });
    this._prelimAttrs = null;
  }
  _copy() {
    return new YXmlElement(this.nodeName);
  }
  clone() {
    const el = new YXmlElement(this.nodeName);
    const attrs = this.getAttributes();
    for (const key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
    el.insert(0, this.toArray().map((item) => item instanceof AbstractType ? item.clone() : item));
    return el;
  }
  toString() {
    const attrs = this.getAttributes();
    const stringBuilder = [];
    const keys2 = [];
    for (const key in attrs) {
      keys2.push(key);
    }
    keys2.sort();
    const keysLen = keys2.length;
    for (let i = 0; i < keysLen; i++) {
      const key = keys2[i];
      stringBuilder.push(key + '="' + attrs[key] + '"');
    }
    const nodeName = this.nodeName.toLocaleLowerCase();
    const attrsString = stringBuilder.length > 0 ? " " + stringBuilder.join(" ") : "";
    return `<${nodeName}${attrsString}>${super.toString()}</${nodeName}>`;
  }
  removeAttribute(attributeName) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapDelete(transaction, this, attributeName);
      });
    } else {
      this._prelimAttrs.delete(attributeName);
    }
  }
  setAttribute(attributeName, attributeValue) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapSet(transaction, this, attributeName, attributeValue);
      });
    } else {
      this._prelimAttrs.set(attributeName, attributeValue);
    }
  }
  getAttribute(attributeName) {
    return typeMapGet(this, attributeName);
  }
  hasAttribute(attributeName) {
    return typeMapHas(this, attributeName);
  }
  getAttributes() {
    return typeMapGetAll(this);
  }
  toDOM(_document = document, hooks = {}, binding) {
    const dom = _document.createElement(this.nodeName);
    const attrs = this.getAttributes();
    for (const key in attrs) {
      dom.setAttribute(key, attrs[key]);
    }
    typeListForEach(this, (yxml) => {
      dom.appendChild(yxml.toDOM(_document, hooks, binding));
    });
    if (binding !== void 0) {
      binding._createAssociation(dom, this);
    }
    return dom;
  }
  _write(encoder) {
    encoder.writeTypeRef(YXmlElementRefID);
    encoder.writeKey(this.nodeName);
  }
}
const readYXmlElement = (decoder) => new YXmlElement(decoder.readKey());
class YXmlEvent extends YEvent {
  constructor(target, subs, transaction) {
    super(target, transaction);
    this.childListChanged = false;
    this.attributesChanged = /* @__PURE__ */ new Set();
    subs.forEach((sub) => {
      if (sub === null) {
        this.childListChanged = true;
      } else {
        this.attributesChanged.add(sub);
      }
    });
  }
}
class YXmlHook extends YMap {
  constructor(hookName) {
    super();
    this.hookName = hookName;
  }
  _copy() {
    return new YXmlHook(this.hookName);
  }
  clone() {
    const el = new YXmlHook(this.hookName);
    this.forEach((value, key) => {
      el.set(key, value);
    });
    return el;
  }
  toDOM(_document = document, hooks = {}, binding) {
    const hook = hooks[this.hookName];
    let dom;
    if (hook !== void 0) {
      dom = hook.createDom(this);
    } else {
      dom = document.createElement(this.hookName);
    }
    dom.setAttribute("data-yjs-hook", this.hookName);
    if (binding !== void 0) {
      binding._createAssociation(dom, this);
    }
    return dom;
  }
  _write(encoder) {
    encoder.writeTypeRef(YXmlHookRefID);
    encoder.writeKey(this.hookName);
  }
}
const readYXmlHook = (decoder) => new YXmlHook(decoder.readKey());
class YXmlText extends YText {
  get nextSibling() {
    const n = this._item ? this._item.next : null;
    return n ? n.content.type : null;
  }
  get prevSibling() {
    const n = this._item ? this._item.prev : null;
    return n ? n.content.type : null;
  }
  _copy() {
    return new YXmlText();
  }
  clone() {
    const text = new YXmlText();
    text.applyDelta(this.toDelta());
    return text;
  }
  toDOM(_document = document, hooks, binding) {
    const dom = _document.createTextNode(this.toString());
    if (binding !== void 0) {
      binding._createAssociation(dom, this);
    }
    return dom;
  }
  toString() {
    return this.toDelta().map((delta) => {
      const nestedNodes = [];
      for (const nodeName in delta.attributes) {
        const attrs = [];
        for (const key in delta.attributes[nodeName]) {
          attrs.push({ key, value: delta.attributes[nodeName][key] });
        }
        attrs.sort((a, b) => a.key < b.key ? -1 : 1);
        nestedNodes.push({ nodeName, attrs });
      }
      nestedNodes.sort((a, b) => a.nodeName < b.nodeName ? -1 : 1);
      let str = "";
      for (let i = 0; i < nestedNodes.length; i++) {
        const node = nestedNodes[i];
        str += `<${node.nodeName}`;
        for (let j = 0; j < node.attrs.length; j++) {
          const attr = node.attrs[j];
          str += ` ${attr.key}="${attr.value}"`;
        }
        str += ">";
      }
      str += delta.insert;
      for (let i = nestedNodes.length - 1; i >= 0; i--) {
        str += `</${nestedNodes[i].nodeName}>`;
      }
      return str;
    }).join("");
  }
  toJSON() {
    return this.toString();
  }
  _write(encoder) {
    encoder.writeTypeRef(YXmlTextRefID);
  }
}
const readYXmlText = (decoder) => new YXmlText();
class AbstractStruct {
  constructor(id, length2) {
    this.id = id;
    this.length = length2;
  }
  get deleted() {
    throw methodUnimplemented();
  }
  mergeWith(right) {
    return false;
  }
  write(encoder, offset, encodingRef) {
    throw methodUnimplemented();
  }
  integrate(transaction, offset) {
    throw methodUnimplemented();
  }
}
const structGCRefNumber = 0;
class GC extends AbstractStruct {
  get deleted() {
    return true;
  }
  delete() {
  }
  mergeWith(right) {
    if (this.constructor !== right.constructor) {
      return false;
    }
    this.length += right.length;
    return true;
  }
  integrate(transaction, offset) {
    if (offset > 0) {
      this.id.clock += offset;
      this.length -= offset;
    }
    addStruct(transaction.doc.store, this);
  }
  write(encoder, offset) {
    encoder.writeInfo(structGCRefNumber);
    encoder.writeLen(this.length - offset);
  }
  getMissing(transaction, store) {
    return null;
  }
}
class ContentBinary {
  constructor(content) {
    this.content = content;
  }
  getLength() {
    return 1;
  }
  getContent() {
    return [this.content];
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentBinary(this.content);
  }
  splice(offset) {
    throw methodUnimplemented();
  }
  mergeWith(right) {
    return false;
  }
  integrate(transaction, item) {
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    encoder.writeBuf(this.content);
  }
  getRef() {
    return 3;
  }
}
const readContentBinary = (decoder) => new ContentBinary(decoder.readBuf());
class ContentDeleted {
  constructor(len) {
    this.len = len;
  }
  getLength() {
    return this.len;
  }
  getContent() {
    return [];
  }
  isCountable() {
    return false;
  }
  copy() {
    return new ContentDeleted(this.len);
  }
  splice(offset) {
    const right = new ContentDeleted(this.len - offset);
    this.len = offset;
    return right;
  }
  mergeWith(right) {
    this.len += right.len;
    return true;
  }
  integrate(transaction, item) {
    addToDeleteSet(transaction.deleteSet, item.id.client, item.id.clock, this.len);
    item.markDeleted();
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    encoder.writeLen(this.len - offset);
  }
  getRef() {
    return 1;
  }
}
const readContentDeleted = (decoder) => new ContentDeleted(decoder.readLen());
const createDocFromOpts = (guid, opts) => new Doc(__spreadProps(__spreadValues({ guid }, opts), { shouldLoad: opts.shouldLoad || opts.autoLoad || false }));
class ContentDoc {
  constructor(doc2) {
    if (doc2._item) {
      console.error("This document was already integrated as a sub-document. You should create a second instance instead with the same guid.");
    }
    this.doc = doc2;
    const opts = {};
    this.opts = opts;
    if (!doc2.gc) {
      opts.gc = false;
    }
    if (doc2.autoLoad) {
      opts.autoLoad = true;
    }
    if (doc2.meta !== null) {
      opts.meta = doc2.meta;
    }
  }
  getLength() {
    return 1;
  }
  getContent() {
    return [this.doc];
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentDoc(createDocFromOpts(this.doc.guid, this.opts));
  }
  splice(offset) {
    throw methodUnimplemented();
  }
  mergeWith(right) {
    return false;
  }
  integrate(transaction, item) {
    this.doc._item = item;
    transaction.subdocsAdded.add(this.doc);
    if (this.doc.shouldLoad) {
      transaction.subdocsLoaded.add(this.doc);
    }
  }
  delete(transaction) {
    if (transaction.subdocsAdded.has(this.doc)) {
      transaction.subdocsAdded.delete(this.doc);
    } else {
      transaction.subdocsRemoved.add(this.doc);
    }
  }
  gc(store) {
  }
  write(encoder, offset) {
    encoder.writeString(this.doc.guid);
    encoder.writeAny(this.opts);
  }
  getRef() {
    return 9;
  }
}
const readContentDoc = (decoder) => new ContentDoc(createDocFromOpts(decoder.readString(), decoder.readAny()));
class ContentEmbed {
  constructor(embed) {
    this.embed = embed;
  }
  getLength() {
    return 1;
  }
  getContent() {
    return [this.embed];
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentEmbed(this.embed);
  }
  splice(offset) {
    throw methodUnimplemented();
  }
  mergeWith(right) {
    return false;
  }
  integrate(transaction, item) {
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    encoder.writeJSON(this.embed);
  }
  getRef() {
    return 5;
  }
}
const readContentEmbed = (decoder) => new ContentEmbed(decoder.readJSON());
class ContentFormat {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
  getLength() {
    return 1;
  }
  getContent() {
    return [];
  }
  isCountable() {
    return false;
  }
  copy() {
    return new ContentFormat(this.key, this.value);
  }
  splice(offset) {
    throw methodUnimplemented();
  }
  mergeWith(right) {
    return false;
  }
  integrate(transaction, item) {
    item.parent._searchMarker = null;
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    encoder.writeKey(this.key);
    encoder.writeJSON(this.value);
  }
  getRef() {
    return 6;
  }
}
const readContentFormat = (decoder) => new ContentFormat(decoder.readKey(), decoder.readJSON());
class ContentJSON {
  constructor(arr) {
    this.arr = arr;
  }
  getLength() {
    return this.arr.length;
  }
  getContent() {
    return this.arr;
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentJSON(this.arr);
  }
  splice(offset) {
    const right = new ContentJSON(this.arr.slice(offset));
    this.arr = this.arr.slice(0, offset);
    return right;
  }
  mergeWith(right) {
    this.arr = this.arr.concat(right.arr);
    return true;
  }
  integrate(transaction, item) {
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    const len = this.arr.length;
    encoder.writeLen(len - offset);
    for (let i = offset; i < len; i++) {
      const c = this.arr[i];
      encoder.writeString(c === void 0 ? "undefined" : JSON.stringify(c));
    }
  }
  getRef() {
    return 2;
  }
}
const readContentJSON = (decoder) => {
  const len = decoder.readLen();
  const cs = [];
  for (let i = 0; i < len; i++) {
    const c = decoder.readString();
    if (c === "undefined") {
      cs.push(void 0);
    } else {
      cs.push(JSON.parse(c));
    }
  }
  return new ContentJSON(cs);
};
class ContentAny {
  constructor(arr) {
    this.arr = arr;
  }
  getLength() {
    return this.arr.length;
  }
  getContent() {
    return this.arr;
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentAny(this.arr);
  }
  splice(offset) {
    const right = new ContentAny(this.arr.slice(offset));
    this.arr = this.arr.slice(0, offset);
    return right;
  }
  mergeWith(right) {
    this.arr = this.arr.concat(right.arr);
    return true;
  }
  integrate(transaction, item) {
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    const len = this.arr.length;
    encoder.writeLen(len - offset);
    for (let i = offset; i < len; i++) {
      const c = this.arr[i];
      encoder.writeAny(c);
    }
  }
  getRef() {
    return 8;
  }
}
const readContentAny = (decoder) => {
  const len = decoder.readLen();
  const cs = [];
  for (let i = 0; i < len; i++) {
    cs.push(decoder.readAny());
  }
  return new ContentAny(cs);
};
class ContentString {
  constructor(str) {
    this.str = str;
  }
  getLength() {
    return this.str.length;
  }
  getContent() {
    return this.str.split("");
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentString(this.str);
  }
  splice(offset) {
    const right = new ContentString(this.str.slice(offset));
    this.str = this.str.slice(0, offset);
    const firstCharCode = this.str.charCodeAt(offset - 1);
    if (firstCharCode >= 55296 && firstCharCode <= 56319) {
      this.str = this.str.slice(0, offset - 1) + "\uFFFD";
      right.str = "\uFFFD" + right.str.slice(1);
    }
    return right;
  }
  mergeWith(right) {
    this.str += right.str;
    return true;
  }
  integrate(transaction, item) {
  }
  delete(transaction) {
  }
  gc(store) {
  }
  write(encoder, offset) {
    encoder.writeString(offset === 0 ? this.str : this.str.slice(offset));
  }
  getRef() {
    return 4;
  }
}
const readContentString = (decoder) => new ContentString(decoder.readString());
const typeRefs = [
  readYArray,
  readYMap,
  readYText,
  readYXmlElement,
  readYXmlFragment,
  readYXmlHook,
  readYXmlText
];
const YArrayRefID = 0;
const YMapRefID = 1;
const YTextRefID = 2;
const YXmlElementRefID = 3;
const YXmlFragmentRefID = 4;
const YXmlHookRefID = 5;
const YXmlTextRefID = 6;
class ContentType {
  constructor(type) {
    this.type = type;
  }
  getLength() {
    return 1;
  }
  getContent() {
    return [this.type];
  }
  isCountable() {
    return true;
  }
  copy() {
    return new ContentType(this.type._copy());
  }
  splice(offset) {
    throw methodUnimplemented();
  }
  mergeWith(right) {
    return false;
  }
  integrate(transaction, item) {
    this.type._integrate(transaction.doc, item);
  }
  delete(transaction) {
    let item = this.type._start;
    while (item !== null) {
      if (!item.deleted) {
        item.delete(transaction);
      } else {
        transaction._mergeStructs.push(item);
      }
      item = item.right;
    }
    this.type._map.forEach((item2) => {
      if (!item2.deleted) {
        item2.delete(transaction);
      } else {
        transaction._mergeStructs.push(item2);
      }
    });
    transaction.changed.delete(this.type);
  }
  gc(store) {
    let item = this.type._start;
    while (item !== null) {
      item.gc(store, true);
      item = item.right;
    }
    this.type._start = null;
    this.type._map.forEach((item2) => {
      while (item2 !== null) {
        item2.gc(store, true);
        item2 = item2.left;
      }
    });
    this.type._map = /* @__PURE__ */ new Map();
  }
  write(encoder, offset) {
    this.type._write(encoder);
  }
  getRef() {
    return 7;
  }
}
const readContentType = (decoder) => new ContentType(typeRefs[decoder.readTypeRef()](decoder));
const followRedone = (store, id) => {
  let nextID = id;
  let diff = 0;
  let item;
  do {
    if (diff > 0) {
      nextID = createID(nextID.client, nextID.clock + diff);
    }
    item = getItem(store, nextID);
    diff = nextID.clock - item.id.clock;
    nextID = item.redone;
  } while (nextID !== null && item instanceof Item);
  return {
    item,
    diff
  };
};
const keepItem = (item, keep) => {
  while (item !== null && item.keep !== keep) {
    item.keep = keep;
    item = item.parent._item;
  }
};
const splitItem = (transaction, leftItem, diff) => {
  const { client, clock } = leftItem.id;
  const rightItem = new Item(createID(client, clock + diff), leftItem, createID(client, clock + diff - 1), leftItem.right, leftItem.rightOrigin, leftItem.parent, leftItem.parentSub, leftItem.content.splice(diff));
  if (leftItem.deleted) {
    rightItem.markDeleted();
  }
  if (leftItem.keep) {
    rightItem.keep = true;
  }
  if (leftItem.redone !== null) {
    rightItem.redone = createID(leftItem.redone.client, leftItem.redone.clock + diff);
  }
  leftItem.right = rightItem;
  if (rightItem.right !== null) {
    rightItem.right.left = rightItem;
  }
  transaction._mergeStructs.push(rightItem);
  if (rightItem.parentSub !== null && rightItem.right === null) {
    rightItem.parent._map.set(rightItem.parentSub, rightItem);
  }
  leftItem.length = diff;
  return rightItem;
};
const redoItem = (transaction, item, redoitems, itemsToDelete, ignoreRemoteMapChanges) => {
  const doc2 = transaction.doc;
  const store = doc2.store;
  const ownClientID = doc2.clientID;
  const redone = item.redone;
  if (redone !== null) {
    return getItemCleanStart(transaction, redone);
  }
  let parentItem = item.parent._item;
  let left = null;
  let right;
  if (parentItem !== null && parentItem.deleted === true) {
    if (parentItem.redone === null && (!redoitems.has(parentItem) || redoItem(transaction, parentItem, redoitems, itemsToDelete, ignoreRemoteMapChanges) === null)) {
      return null;
    }
    while (parentItem.redone !== null) {
      parentItem = getItemCleanStart(transaction, parentItem.redone);
    }
  }
  const parentType = parentItem === null ? item.parent : parentItem.content.type;
  if (item.parentSub === null) {
    left = item.left;
    right = item;
    while (left !== null) {
      let leftTrace = left;
      while (leftTrace !== null && leftTrace.parent._item !== parentItem) {
        leftTrace = leftTrace.redone === null ? null : getItemCleanStart(transaction, leftTrace.redone);
      }
      if (leftTrace !== null && leftTrace.parent._item === parentItem) {
        left = leftTrace;
        break;
      }
      left = left.left;
    }
    while (right !== null) {
      let rightTrace = right;
      while (rightTrace !== null && rightTrace.parent._item !== parentItem) {
        rightTrace = rightTrace.redone === null ? null : getItemCleanStart(transaction, rightTrace.redone);
      }
      if (rightTrace !== null && rightTrace.parent._item === parentItem) {
        right = rightTrace;
        break;
      }
      right = right.right;
    }
  } else {
    right = null;
    if (item.right && !ignoreRemoteMapChanges) {
      left = item;
      while (left !== null && left.right !== null && isDeleted(itemsToDelete, left.right.id)) {
        left = left.right;
      }
      while (left !== null && left.redone !== null) {
        left = getItemCleanStart(transaction, left.redone);
      }
      if (left && left.right !== null) {
        return null;
      }
    } else {
      left = parentType._map.get(item.parentSub) || null;
    }
  }
  const nextClock = getState(store, ownClientID);
  const nextId = createID(ownClientID, nextClock);
  const redoneItem = new Item(nextId, left, left && left.lastId, right, right && right.id, parentType, item.parentSub, item.content.copy());
  item.redone = nextId;
  keepItem(redoneItem, true);
  redoneItem.integrate(transaction, 0);
  return redoneItem;
};
class Item extends AbstractStruct {
  constructor(id, left, origin, right, rightOrigin, parent, parentSub, content) {
    super(id, content.getLength());
    this.origin = origin;
    this.left = left;
    this.right = right;
    this.rightOrigin = rightOrigin;
    this.parent = parent;
    this.parentSub = parentSub;
    this.redone = null;
    this.content = content;
    this.info = this.content.isCountable() ? BIT2 : 0;
  }
  set marker(isMarked) {
    if ((this.info & BIT4) > 0 !== isMarked) {
      this.info ^= BIT4;
    }
  }
  get marker() {
    return (this.info & BIT4) > 0;
  }
  get keep() {
    return (this.info & BIT1) > 0;
  }
  set keep(doKeep) {
    if (this.keep !== doKeep) {
      this.info ^= BIT1;
    }
  }
  get countable() {
    return (this.info & BIT2) > 0;
  }
  get deleted() {
    return (this.info & BIT3) > 0;
  }
  set deleted(doDelete) {
    if (this.deleted !== doDelete) {
      this.info ^= BIT3;
    }
  }
  markDeleted() {
    this.info |= BIT3;
  }
  getMissing(transaction, store) {
    if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= getState(store, this.origin.client)) {
      return this.origin.client;
    }
    if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= getState(store, this.rightOrigin.client)) {
      return this.rightOrigin.client;
    }
    if (this.parent && this.parent.constructor === ID && this.id.client !== this.parent.client && this.parent.clock >= getState(store, this.parent.client)) {
      return this.parent.client;
    }
    if (this.origin) {
      this.left = getItemCleanEnd(transaction, store, this.origin);
      this.origin = this.left.lastId;
    }
    if (this.rightOrigin) {
      this.right = getItemCleanStart(transaction, this.rightOrigin);
      this.rightOrigin = this.right.id;
    }
    if (this.left && this.left.constructor === GC || this.right && this.right.constructor === GC) {
      this.parent = null;
    }
    if (!this.parent) {
      if (this.left && this.left.constructor === Item) {
        this.parent = this.left.parent;
        this.parentSub = this.left.parentSub;
      }
      if (this.right && this.right.constructor === Item) {
        this.parent = this.right.parent;
        this.parentSub = this.right.parentSub;
      }
    } else if (this.parent.constructor === ID) {
      const parentItem = getItem(store, this.parent);
      if (parentItem.constructor === GC) {
        this.parent = null;
      } else {
        this.parent = parentItem.content.type;
      }
    }
    return null;
  }
  integrate(transaction, offset) {
    if (offset > 0) {
      this.id.clock += offset;
      this.left = getItemCleanEnd(transaction, transaction.doc.store, createID(this.id.client, this.id.clock - 1));
      this.origin = this.left.lastId;
      this.content = this.content.splice(offset);
      this.length -= offset;
    }
    if (this.parent) {
      if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
        let left = this.left;
        let o;
        if (left !== null) {
          o = left.right;
        } else if (this.parentSub !== null) {
          o = this.parent._map.get(this.parentSub) || null;
          while (o !== null && o.left !== null) {
            o = o.left;
          }
        } else {
          o = this.parent._start;
        }
        const conflictingItems = /* @__PURE__ */ new Set();
        const itemsBeforeOrigin = /* @__PURE__ */ new Set();
        while (o !== null && o !== this.right) {
          itemsBeforeOrigin.add(o);
          conflictingItems.add(o);
          if (compareIDs(this.origin, o.origin)) {
            if (o.id.client < this.id.client) {
              left = o;
              conflictingItems.clear();
            } else if (compareIDs(this.rightOrigin, o.rightOrigin)) {
              break;
            }
          } else if (o.origin !== null && itemsBeforeOrigin.has(getItem(transaction.doc.store, o.origin))) {
            if (!conflictingItems.has(getItem(transaction.doc.store, o.origin))) {
              left = o;
              conflictingItems.clear();
            }
          } else {
            break;
          }
          o = o.right;
        }
        this.left = left;
      }
      if (this.left !== null) {
        const right = this.left.right;
        this.right = right;
        this.left.right = this;
      } else {
        let r;
        if (this.parentSub !== null) {
          r = this.parent._map.get(this.parentSub) || null;
          while (r !== null && r.left !== null) {
            r = r.left;
          }
        } else {
          r = this.parent._start;
          this.parent._start = this;
        }
        this.right = r;
      }
      if (this.right !== null) {
        this.right.left = this;
      } else if (this.parentSub !== null) {
        this.parent._map.set(this.parentSub, this);
        if (this.left !== null) {
          this.left.delete(transaction);
        }
      }
      if (this.parentSub === null && this.countable && !this.deleted) {
        this.parent._length += this.length;
      }
      addStruct(transaction.doc.store, this);
      this.content.integrate(transaction, this);
      addChangedTypeToTransaction(transaction, this.parent, this.parentSub);
      if (this.parent._item !== null && this.parent._item.deleted || this.parentSub !== null && this.right !== null) {
        this.delete(transaction);
      }
    } else {
      new GC(this.id, this.length).integrate(transaction, 0);
    }
  }
  get next() {
    let n = this.right;
    while (n !== null && n.deleted) {
      n = n.right;
    }
    return n;
  }
  get prev() {
    let n = this.left;
    while (n !== null && n.deleted) {
      n = n.left;
    }
    return n;
  }
  get lastId() {
    return this.length === 1 ? this.id : createID(this.id.client, this.id.clock + this.length - 1);
  }
  mergeWith(right) {
    if (this.constructor === right.constructor && compareIDs(right.origin, this.lastId) && this.right === right && compareIDs(this.rightOrigin, right.rightOrigin) && this.id.client === right.id.client && this.id.clock + this.length === right.id.clock && this.deleted === right.deleted && this.redone === null && right.redone === null && this.content.constructor === right.content.constructor && this.content.mergeWith(right.content)) {
      const searchMarker = this.parent._searchMarker;
      if (searchMarker) {
        searchMarker.forEach((marker) => {
          if (marker.p === right) {
            marker.p = this;
            if (!this.deleted && this.countable) {
              marker.index -= this.length;
            }
          }
        });
      }
      if (right.keep) {
        this.keep = true;
      }
      this.right = right.right;
      if (this.right !== null) {
        this.right.left = this;
      }
      this.length += right.length;
      return true;
    }
    return false;
  }
  delete(transaction) {
    if (!this.deleted) {
      const parent = this.parent;
      if (this.countable && this.parentSub === null) {
        parent._length -= this.length;
      }
      this.markDeleted();
      addToDeleteSet(transaction.deleteSet, this.id.client, this.id.clock, this.length);
      addChangedTypeToTransaction(transaction, parent, this.parentSub);
      this.content.delete(transaction);
    }
  }
  gc(store, parentGCd) {
    if (!this.deleted) {
      throw unexpectedCase();
    }
    this.content.gc(store);
    if (parentGCd) {
      replaceStruct(store, this, new GC(this.id, this.length));
    } else {
      this.content = new ContentDeleted(this.length);
    }
  }
  write(encoder, offset) {
    const origin = offset > 0 ? createID(this.id.client, this.id.clock + offset - 1) : this.origin;
    const rightOrigin = this.rightOrigin;
    const parentSub = this.parentSub;
    const info = this.content.getRef() & BITS5 | (origin === null ? 0 : BIT8) | (rightOrigin === null ? 0 : BIT7) | (parentSub === null ? 0 : BIT6);
    encoder.writeInfo(info);
    if (origin !== null) {
      encoder.writeLeftID(origin);
    }
    if (rightOrigin !== null) {
      encoder.writeRightID(rightOrigin);
    }
    if (origin === null && rightOrigin === null) {
      const parent = this.parent;
      if (parent._item !== void 0) {
        const parentItem = parent._item;
        if (parentItem === null) {
          const ykey = findRootTypeKey(parent);
          encoder.writeParentInfo(true);
          encoder.writeString(ykey);
        } else {
          encoder.writeParentInfo(false);
          encoder.writeLeftID(parentItem.id);
        }
      } else if (parent.constructor === String) {
        encoder.writeParentInfo(true);
        encoder.writeString(parent);
      } else if (parent.constructor === ID) {
        encoder.writeParentInfo(false);
        encoder.writeLeftID(parent);
      } else {
        unexpectedCase();
      }
      if (parentSub !== null) {
        encoder.writeString(parentSub);
      }
    }
    this.content.write(encoder, offset);
  }
}
const readItemContent = (decoder, info) => contentRefs[info & BITS5](decoder);
const contentRefs = [
  () => {
    unexpectedCase();
  },
  readContentDeleted,
  readContentJSON,
  readContentBinary,
  readContentString,
  readContentEmbed,
  readContentFormat,
  readContentType,
  readContentAny,
  readContentDoc,
  () => {
    unexpectedCase();
  }
];
const structSkipRefNumber = 10;
class Skip extends AbstractStruct {
  get deleted() {
    return true;
  }
  delete() {
  }
  mergeWith(right) {
    if (this.constructor !== right.constructor) {
      return false;
    }
    this.length += right.length;
    return true;
  }
  integrate(transaction, offset) {
    unexpectedCase();
  }
  write(encoder, offset) {
    encoder.writeInfo(structSkipRefNumber);
    writeVarUint(encoder.restEncoder, this.length - offset);
  }
  getMissing(transaction, store) {
    return null;
  }
}
const glo = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
const importIdentifier = "__ $YJS$ __";
if (glo[importIdentifier] === true) {
  console.error("Yjs was already imported. This breaks constructor checks and will lead to issues! - https://github.com/yjs/yjs/issues/438");
}
glo[importIdentifier] = true;
const reconnectTimeoutBase = 1200;
const maxReconnectTimeout = 2500;
const messageReconnectTimeout = 3e4;
const setupWS = (wsclient) => {
  if (wsclient.shouldConnect && wsclient.ws === null) {
    const websocket = new WebSocket(wsclient.url);
    const binaryType = wsclient.binaryType;
    let pingTimeout = null;
    if (binaryType) {
      websocket.binaryType = binaryType;
    }
    wsclient.ws = websocket;
    wsclient.connecting = true;
    wsclient.connected = false;
    websocket.onmessage = (event) => {
      wsclient.lastMessageReceived = getUnixTime();
      const data = event.data;
      const message = typeof data === "string" ? JSON.parse(data) : data;
      if (message && message.type === "pong") {
        clearTimeout(pingTimeout);
        pingTimeout = setTimeout(sendPing, messageReconnectTimeout / 2);
      }
      wsclient.emit("message", [message, wsclient]);
    };
    const onclose = (error) => {
      if (wsclient.ws !== null) {
        wsclient.ws = null;
        wsclient.connecting = false;
        if (wsclient.connected) {
          wsclient.connected = false;
          wsclient.emit("disconnect", [{ type: "disconnect", error }, wsclient]);
        } else {
          wsclient.unsuccessfulReconnects++;
        }
        setTimeout(setupWS, min(log10(wsclient.unsuccessfulReconnects + 1) * reconnectTimeoutBase, maxReconnectTimeout), wsclient);
      }
      clearTimeout(pingTimeout);
    };
    const sendPing = () => {
      if (wsclient.ws === websocket) {
        wsclient.send({
          type: "ping"
        });
      }
    };
    websocket.onclose = () => onclose(null);
    websocket.onerror = (error) => onclose(error);
    websocket.onopen = () => {
      wsclient.lastMessageReceived = getUnixTime();
      wsclient.connecting = false;
      wsclient.connected = true;
      wsclient.unsuccessfulReconnects = 0;
      wsclient.emit("connect", [{ type: "connect" }, wsclient]);
      pingTimeout = setTimeout(sendPing, messageReconnectTimeout / 2);
    };
  }
};
class WebsocketClient extends Observable {
  constructor(url, { binaryType } = {}) {
    super();
    this.url = url;
    this.ws = null;
    this.binaryType = binaryType || null;
    this.connected = false;
    this.connecting = false;
    this.unsuccessfulReconnects = 0;
    this.lastMessageReceived = 0;
    this.shouldConnect = true;
    this._checkInterval = setInterval(() => {
      if (this.connected && messageReconnectTimeout < getUnixTime() - this.lastMessageReceived) {
        this.ws.close();
      }
    }, messageReconnectTimeout / 2);
    setupWS(this);
  }
  send(message) {
    if (this.ws) {
      this.ws.send(JSON.stringify(message));
    }
  }
  destroy() {
    clearInterval(this._checkInterval);
    this.disconnect();
    super.destroy();
  }
  disconnect() {
    this.shouldConnect = false;
    if (this.ws !== null) {
      this.ws.close();
    }
  }
  connect() {
    this.shouldConnect = true;
    if (!this.connected && this.ws === null) {
      setupWS(this);
    }
  }
}
const channels = /* @__PURE__ */ new Map();
class LocalStoragePolyfill {
  constructor(room) {
    this.room = room;
    this.onmessage = null;
    onChange((e) => e.key === room && this.onmessage !== null && this.onmessage({ data: fromBase64(e.newValue || "") }));
  }
  postMessage(buf) {
    varStorage.setItem(this.room, toBase64(createUint8ArrayFromArrayBuffer(buf)));
  }
}
const BC = typeof BroadcastChannel === "undefined" ? LocalStoragePolyfill : BroadcastChannel;
const getChannel = (room) => setIfUndefined(channels, room, () => {
  const subs = create$4();
  const bc = new BC(room);
  bc.onmessage = (e) => subs.forEach((sub) => sub(e.data, "broadcastchannel"));
  return {
    bc,
    subs
  };
});
const subscribe = (room, f) => {
  getChannel(room).subs.add(f);
  return f;
};
const unsubscribe = (room, f) => {
  const channel = getChannel(room);
  const unsubscribed = channel.subs.delete(f);
  if (unsubscribed && channel.subs.size === 0) {
    channel.bc.close();
    channels.delete(room);
  }
  return unsubscribed;
};
const publish = (room, data, origin = null) => {
  const c = getChannel(room);
  c.bc.postMessage(data);
  c.subs.forEach((sub) => sub(data, origin));
};
const createMutex = () => {
  let token = true;
  return (f, g) => {
    if (token) {
      token = false;
      try {
        f();
      } finally {
        token = true;
      }
    } else if (g !== void 0) {
      g();
    }
  };
};
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var simplepeer_min = { exports: {} };
(function(module, exports) {
  (function(e) {
    module.exports = e();
  })(function() {
    var t = Math.floor, n = Math.abs, r = Math.pow;
    return function() {
      function d(s, e, n2) {
        function t2(o, i) {
          if (!e[o]) {
            if (!s[o]) {
              var l = typeof commonjsRequire == "function" && commonjsRequire;
              if (!i && l)
                return l(o, true);
              if (r2)
                return r2(o, true);
              var c = new Error("Cannot find module '" + o + "'");
              throw c.code = "MODULE_NOT_FOUND", c;
            }
            var a2 = e[o] = { exports: {} };
            s[o][0].call(a2.exports, function(e2) {
              var r3 = s[o][1][e2];
              return t2(r3 || e2);
            }, a2, a2.exports, d, s, e, n2);
          }
          return e[o].exports;
        }
        for (var r2 = typeof commonjsRequire == "function" && commonjsRequire, a = 0; a < n2.length; a++)
          t2(n2[a]);
        return t2;
      }
      return d;
    }()({ 1: [function(e, t2, n2) {
      function r2(e2) {
        var t3 = e2.length;
        if (0 < t3 % 4)
          throw new Error("Invalid string. Length must be a multiple of 4");
        var n3 = e2.indexOf("=");
        n3 === -1 && (n3 = t3);
        var r3 = n3 === t3 ? 0 : 4 - n3 % 4;
        return [n3, r3];
      }
      function a(e2, t3, n3) {
        return 3 * (t3 + n3) / 4 - n3;
      }
      function o(e2) {
        var t3, n3, o2 = r2(e2), d2 = o2[0], s2 = o2[1], l2 = new p(a(e2, d2, s2)), c2 = 0, f2 = 0 < s2 ? d2 - 4 : d2;
        for (n3 = 0; n3 < f2; n3 += 4)
          t3 = u[e2.charCodeAt(n3)] << 18 | u[e2.charCodeAt(n3 + 1)] << 12 | u[e2.charCodeAt(n3 + 2)] << 6 | u[e2.charCodeAt(n3 + 3)], l2[c2++] = 255 & t3 >> 16, l2[c2++] = 255 & t3 >> 8, l2[c2++] = 255 & t3;
        return s2 === 2 && (t3 = u[e2.charCodeAt(n3)] << 2 | u[e2.charCodeAt(n3 + 1)] >> 4, l2[c2++] = 255 & t3), s2 === 1 && (t3 = u[e2.charCodeAt(n3)] << 10 | u[e2.charCodeAt(n3 + 1)] << 4 | u[e2.charCodeAt(n3 + 2)] >> 2, l2[c2++] = 255 & t3 >> 8, l2[c2++] = 255 & t3), l2;
      }
      function d(e2) {
        return c[63 & e2 >> 18] + c[63 & e2 >> 12] + c[63 & e2 >> 6] + c[63 & e2];
      }
      function s(e2, t3, n3) {
        for (var r3, a2 = [], o2 = t3; o2 < n3; o2 += 3)
          r3 = (16711680 & e2[o2] << 16) + (65280 & e2[o2 + 1] << 8) + (255 & e2[o2 + 2]), a2.push(d(r3));
        return a2.join("");
      }
      function l(e2) {
        for (var t3, n3 = e2.length, r3 = n3 % 3, a2 = [], o2 = 16383, d2 = 0, l2 = n3 - r3; d2 < l2; d2 += o2)
          a2.push(s(e2, d2, d2 + o2 > l2 ? l2 : d2 + o2));
        return r3 === 1 ? (t3 = e2[n3 - 1], a2.push(c[t3 >> 2] + c[63 & t3 << 4] + "==")) : r3 === 2 && (t3 = (e2[n3 - 2] << 8) + e2[n3 - 1], a2.push(c[t3 >> 10] + c[63 & t3 >> 4] + c[63 & t3 << 2] + "=")), a2.join("");
      }
      n2.byteLength = function(e2) {
        var t3 = r2(e2), n3 = t3[0], a2 = t3[1];
        return 3 * (n3 + a2) / 4 - a2;
      }, n2.toByteArray = o, n2.fromByteArray = l;
      for (var c = [], u = [], p = typeof Uint8Array == "undefined" ? Array : Uint8Array, f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", g = 0, _ = f.length; g < _; ++g)
        c[g] = f[g], u[f.charCodeAt(g)] = g;
      u[45] = 62, u[95] = 63;
    }, {}], 2: [function() {
    }, {}], 3: [function(e, t2, n2) {
      (function() {
        (function() {
          var t3 = String.fromCharCode, o = Math.min;
          function d(e2) {
            if (2147483647 < e2)
              throw new RangeError('The value "' + e2 + '" is invalid for option "size"');
            var t4 = new Uint8Array(e2);
            return t4.__proto__ = s.prototype, t4;
          }
          function s(e2, t4, n3) {
            if (typeof e2 == "number") {
              if (typeof t4 == "string")
                throw new TypeError('The "string" argument must be of type string. Received type number');
              return p(e2);
            }
            return l(e2, t4, n3);
          }
          function l(e2, t4, n3) {
            if (typeof e2 == "string")
              return f(e2, t4);
            if (ArrayBuffer.isView(e2))
              return g(e2);
            if (e2 == null)
              throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e2);
            if (K(e2, ArrayBuffer) || e2 && K(e2.buffer, ArrayBuffer))
              return _(e2, t4, n3);
            if (typeof e2 == "number")
              throw new TypeError('The "value" argument must not be of type number. Received type number');
            var r2 = e2.valueOf && e2.valueOf();
            if (r2 != null && r2 !== e2)
              return s.from(r2, t4, n3);
            var a = h(e2);
            if (a)
              return a;
            if (typeof Symbol != "undefined" && Symbol.toPrimitive != null && typeof e2[Symbol.toPrimitive] == "function")
              return s.from(e2[Symbol.toPrimitive]("string"), t4, n3);
            throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e2);
          }
          function c(e2) {
            if (typeof e2 != "number")
              throw new TypeError('"size" argument must be of type number');
            else if (0 > e2)
              throw new RangeError('The value "' + e2 + '" is invalid for option "size"');
          }
          function u(e2, t4, n3) {
            return c(e2), 0 >= e2 ? d(e2) : t4 === void 0 ? d(e2) : typeof n3 == "string" ? d(e2).fill(t4, n3) : d(e2).fill(t4);
          }
          function p(e2) {
            return c(e2), d(0 > e2 ? 0 : 0 | m(e2));
          }
          function f(e2, t4) {
            if ((typeof t4 != "string" || t4 === "") && (t4 = "utf8"), !s.isEncoding(t4))
              throw new TypeError("Unknown encoding: " + t4);
            var n3 = 0 | b(e2, t4), r2 = d(n3), a = r2.write(e2, t4);
            return a !== n3 && (r2 = r2.slice(0, a)), r2;
          }
          function g(e2) {
            for (var t4 = 0 > e2.length ? 0 : 0 | m(e2.length), n3 = d(t4), r2 = 0; r2 < t4; r2 += 1)
              n3[r2] = 255 & e2[r2];
            return n3;
          }
          function _(e2, t4, n3) {
            if (0 > t4 || e2.byteLength < t4)
              throw new RangeError('"offset" is outside of buffer bounds');
            if (e2.byteLength < t4 + (n3 || 0))
              throw new RangeError('"length" is outside of buffer bounds');
            var r2;
            return r2 = t4 === void 0 && n3 === void 0 ? new Uint8Array(e2) : n3 === void 0 ? new Uint8Array(e2, t4) : new Uint8Array(e2, t4, n3), r2.__proto__ = s.prototype, r2;
          }
          function h(e2) {
            if (s.isBuffer(e2)) {
              var t4 = 0 | m(e2.length), n3 = d(t4);
              return n3.length === 0 ? n3 : (e2.copy(n3, 0, 0, t4), n3);
            }
            return e2.length === void 0 ? e2.type === "Buffer" && Array.isArray(e2.data) ? g(e2.data) : void 0 : typeof e2.length != "number" || X(e2.length) ? d(0) : g(e2);
          }
          function m(e2) {
            if (e2 >= 2147483647)
              throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + 2147483647 .toString(16) + " bytes");
            return 0 | e2;
          }
          function b(e2, t4) {
            if (s.isBuffer(e2))
              return e2.length;
            if (ArrayBuffer.isView(e2) || K(e2, ArrayBuffer))
              return e2.byteLength;
            if (typeof e2 != "string")
              throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e2);
            var n3 = e2.length, r2 = 2 < arguments.length && arguments[2] === true;
            if (!r2 && n3 === 0)
              return 0;
            for (var a = false; ; )
              switch (t4) {
                case "ascii":
                case "latin1":
                case "binary":
                  return n3;
                case "utf8":
                case "utf-8":
                  return H(e2).length;
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return 2 * n3;
                case "hex":
                  return n3 >>> 1;
                case "base64":
                  return z(e2).length;
                default:
                  if (a)
                    return r2 ? -1 : H(e2).length;
                  t4 = ("" + t4).toLowerCase(), a = true;
              }
          }
          function y(e2, t4, n3) {
            var r2 = false;
            if ((t4 === void 0 || 0 > t4) && (t4 = 0), t4 > this.length)
              return "";
            if ((n3 === void 0 || n3 > this.length) && (n3 = this.length), 0 >= n3)
              return "";
            if (n3 >>>= 0, t4 >>>= 0, n3 <= t4)
              return "";
            for (e2 || (e2 = "utf8"); ; )
              switch (e2) {
                case "hex":
                  return P(this, t4, n3);
                case "utf8":
                case "utf-8":
                  return x(this, t4, n3);
                case "ascii":
                  return D(this, t4, n3);
                case "latin1":
                case "binary":
                  return I(this, t4, n3);
                case "base64":
                  return A(this, t4, n3);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return M(this, t4, n3);
                default:
                  if (r2)
                    throw new TypeError("Unknown encoding: " + e2);
                  e2 = (e2 + "").toLowerCase(), r2 = true;
              }
          }
          function C(e2, t4, n3) {
            var r2 = e2[t4];
            e2[t4] = e2[n3], e2[n3] = r2;
          }
          function R(e2, t4, n3, r2, a) {
            if (e2.length === 0)
              return -1;
            if (typeof n3 == "string" ? (r2 = n3, n3 = 0) : 2147483647 < n3 ? n3 = 2147483647 : -2147483648 > n3 && (n3 = -2147483648), n3 = +n3, X(n3) && (n3 = a ? 0 : e2.length - 1), 0 > n3 && (n3 = e2.length + n3), n3 >= e2.length) {
              if (a)
                return -1;
              n3 = e2.length - 1;
            } else if (0 > n3)
              if (a)
                n3 = 0;
              else
                return -1;
            if (typeof t4 == "string" && (t4 = s.from(t4, r2)), s.isBuffer(t4))
              return t4.length === 0 ? -1 : E(e2, t4, n3, r2, a);
            if (typeof t4 == "number")
              return t4 &= 255, typeof Uint8Array.prototype.indexOf == "function" ? a ? Uint8Array.prototype.indexOf.call(e2, t4, n3) : Uint8Array.prototype.lastIndexOf.call(e2, t4, n3) : E(e2, [t4], n3, r2, a);
            throw new TypeError("val must be string, number or Buffer");
          }
          function E(e2, t4, n3, r2, a) {
            function o2(e3, t5) {
              return d2 === 1 ? e3[t5] : e3.readUInt16BE(t5 * d2);
            }
            var d2 = 1, s2 = e2.length, l2 = t4.length;
            if (r2 !== void 0 && (r2 = (r2 + "").toLowerCase(), r2 === "ucs2" || r2 === "ucs-2" || r2 === "utf16le" || r2 === "utf-16le")) {
              if (2 > e2.length || 2 > t4.length)
                return -1;
              d2 = 2, s2 /= 2, l2 /= 2, n3 /= 2;
            }
            var c2;
            if (a) {
              var u2 = -1;
              for (c2 = n3; c2 < s2; c2++)
                if (o2(e2, c2) !== o2(t4, u2 === -1 ? 0 : c2 - u2))
                  u2 !== -1 && (c2 -= c2 - u2), u2 = -1;
                else if (u2 === -1 && (u2 = c2), c2 - u2 + 1 === l2)
                  return u2 * d2;
            } else
              for (n3 + l2 > s2 && (n3 = s2 - l2), c2 = n3; 0 <= c2; c2--) {
                for (var p2 = true, f2 = 0; f2 < l2; f2++)
                  if (o2(e2, c2 + f2) !== o2(t4, f2)) {
                    p2 = false;
                    break;
                  }
                if (p2)
                  return c2;
              }
            return -1;
          }
          function w(e2, t4, n3, r2) {
            n3 = +n3 || 0;
            var a = e2.length - n3;
            r2 ? (r2 = +r2, r2 > a && (r2 = a)) : r2 = a;
            var o2 = t4.length;
            r2 > o2 / 2 && (r2 = o2 / 2);
            for (var d2, s2 = 0; s2 < r2; ++s2) {
              if (d2 = parseInt(t4.substr(2 * s2, 2), 16), X(d2))
                return s2;
              e2[n3 + s2] = d2;
            }
            return s2;
          }
          function S(e2, t4, n3, r2) {
            return G(H(t4, e2.length - n3), e2, n3, r2);
          }
          function T(e2, t4, n3, r2) {
            return G(Y(t4), e2, n3, r2);
          }
          function v(e2, t4, n3, r2) {
            return T(e2, t4, n3, r2);
          }
          function k(e2, t4, n3, r2) {
            return G(z(t4), e2, n3, r2);
          }
          function L(e2, t4, n3, r2) {
            return G(V(t4, e2.length - n3), e2, n3, r2);
          }
          function A(e2, t4, n3) {
            return t4 === 0 && n3 === e2.length ? $.fromByteArray(e2) : $.fromByteArray(e2.slice(t4, n3));
          }
          function x(e2, t4, n3) {
            n3 = o(e2.length, n3);
            for (var r2 = [], a = t4; a < n3; ) {
              var d2 = e2[a], s2 = null, l2 = 239 < d2 ? 4 : 223 < d2 ? 3 : 191 < d2 ? 2 : 1;
              if (a + l2 <= n3) {
                var c2, u2, p2, f2;
                l2 === 1 ? 128 > d2 && (s2 = d2) : l2 === 2 ? (c2 = e2[a + 1], (192 & c2) == 128 && (f2 = (31 & d2) << 6 | 63 & c2, 127 < f2 && (s2 = f2))) : l2 === 3 ? (c2 = e2[a + 1], u2 = e2[a + 2], (192 & c2) == 128 && (192 & u2) == 128 && (f2 = (15 & d2) << 12 | (63 & c2) << 6 | 63 & u2, 2047 < f2 && (55296 > f2 || 57343 < f2) && (s2 = f2))) : l2 === 4 ? (c2 = e2[a + 1], u2 = e2[a + 2], p2 = e2[a + 3], (192 & c2) == 128 && (192 & u2) == 128 && (192 & p2) == 128 && (f2 = (15 & d2) << 18 | (63 & c2) << 12 | (63 & u2) << 6 | 63 & p2, 65535 < f2 && 1114112 > f2 && (s2 = f2))) : void 0;
              }
              s2 === null ? (s2 = 65533, l2 = 1) : 65535 < s2 && (s2 -= 65536, r2.push(55296 | 1023 & s2 >>> 10), s2 = 56320 | 1023 & s2), r2.push(s2), a += l2;
            }
            return N(r2);
          }
          function N(e2) {
            var n3 = e2.length;
            if (n3 <= 4096)
              return t3.apply(String, e2);
            for (var r2 = "", a = 0; a < n3; )
              r2 += t3.apply(String, e2.slice(a, a += 4096));
            return r2;
          }
          function D(e2, n3, r2) {
            var a = "";
            r2 = o(e2.length, r2);
            for (var d2 = n3; d2 < r2; ++d2)
              a += t3(127 & e2[d2]);
            return a;
          }
          function I(e2, n3, r2) {
            var a = "";
            r2 = o(e2.length, r2);
            for (var d2 = n3; d2 < r2; ++d2)
              a += t3(e2[d2]);
            return a;
          }
          function P(e2, t4, n3) {
            var r2 = e2.length;
            (!t4 || 0 > t4) && (t4 = 0), (!n3 || 0 > n3 || n3 > r2) && (n3 = r2);
            for (var a = "", o2 = t4; o2 < n3; ++o2)
              a += W(e2[o2]);
            return a;
          }
          function M(e2, n3, r2) {
            for (var a = e2.slice(n3, r2), o2 = "", d2 = 0; d2 < a.length; d2 += 2)
              o2 += t3(a[d2] + 256 * a[d2 + 1]);
            return o2;
          }
          function O(e2, t4, n3) {
            if (e2 % 1 != 0 || 0 > e2)
              throw new RangeError("offset is not uint");
            if (e2 + t4 > n3)
              throw new RangeError("Trying to access beyond buffer length");
          }
          function F(e2, t4, n3, r2, a, o2) {
            if (!s.isBuffer(e2))
              throw new TypeError('"buffer" argument must be a Buffer instance');
            if (t4 > a || t4 < o2)
              throw new RangeError('"value" argument is out of bounds');
            if (n3 + r2 > e2.length)
              throw new RangeError("Index out of range");
          }
          function B(e2, t4, n3, r2) {
            if (n3 + r2 > e2.length)
              throw new RangeError("Index out of range");
            if (0 > n3)
              throw new RangeError("Index out of range");
          }
          function U(e2, t4, n3, r2, a) {
            return t4 = +t4, n3 >>>= 0, a || B(e2, t4, n3, 4), J.write(e2, t4, n3, r2, 23, 4), n3 + 4;
          }
          function j(e2, t4, n3, r2, a) {
            return t4 = +t4, n3 >>>= 0, a || B(e2, t4, n3, 8), J.write(e2, t4, n3, r2, 52, 8), n3 + 8;
          }
          function q(e2) {
            if (e2 = e2.split("=")[0], e2 = e2.trim().replace(Q, ""), 2 > e2.length)
              return "";
            for (; e2.length % 4 != 0; )
              e2 += "=";
            return e2;
          }
          function W(e2) {
            return 16 > e2 ? "0" + e2.toString(16) : e2.toString(16);
          }
          function H(e2, t4) {
            t4 = t4 || 1 / 0;
            for (var n3, r2 = e2.length, a = null, o2 = [], d2 = 0; d2 < r2; ++d2) {
              if (n3 = e2.charCodeAt(d2), 55295 < n3 && 57344 > n3) {
                if (!a) {
                  if (56319 < n3) {
                    -1 < (t4 -= 3) && o2.push(239, 191, 189);
                    continue;
                  } else if (d2 + 1 === r2) {
                    -1 < (t4 -= 3) && o2.push(239, 191, 189);
                    continue;
                  }
                  a = n3;
                  continue;
                }
                if (56320 > n3) {
                  -1 < (t4 -= 3) && o2.push(239, 191, 189), a = n3;
                  continue;
                }
                n3 = (a - 55296 << 10 | n3 - 56320) + 65536;
              } else
                a && -1 < (t4 -= 3) && o2.push(239, 191, 189);
              if (a = null, 128 > n3) {
                if (0 > (t4 -= 1))
                  break;
                o2.push(n3);
              } else if (2048 > n3) {
                if (0 > (t4 -= 2))
                  break;
                o2.push(192 | n3 >> 6, 128 | 63 & n3);
              } else if (65536 > n3) {
                if (0 > (t4 -= 3))
                  break;
                o2.push(224 | n3 >> 12, 128 | 63 & n3 >> 6, 128 | 63 & n3);
              } else if (1114112 > n3) {
                if (0 > (t4 -= 4))
                  break;
                o2.push(240 | n3 >> 18, 128 | 63 & n3 >> 12, 128 | 63 & n3 >> 6, 128 | 63 & n3);
              } else
                throw new Error("Invalid code point");
            }
            return o2;
          }
          function Y(e2) {
            for (var t4 = [], n3 = 0; n3 < e2.length; ++n3)
              t4.push(255 & e2.charCodeAt(n3));
            return t4;
          }
          function V(e2, t4) {
            for (var n3, r2, a, o2 = [], d2 = 0; d2 < e2.length && !(0 > (t4 -= 2)); ++d2)
              n3 = e2.charCodeAt(d2), r2 = n3 >> 8, a = n3 % 256, o2.push(a), o2.push(r2);
            return o2;
          }
          function z(e2) {
            return $.toByteArray(q(e2));
          }
          function G(e2, t4, n3, r2) {
            for (var a = 0; a < r2 && !(a + n3 >= t4.length || a >= e2.length); ++a)
              t4[a + n3] = e2[a];
            return a;
          }
          function K(e2, t4) {
            return e2 instanceof t4 || e2 != null && e2.constructor != null && e2.constructor.name != null && e2.constructor.name === t4.name;
          }
          function X(e2) {
            return e2 !== e2;
          }
          var $ = e("base64-js"), J = e("ieee754");
          n2.Buffer = s, n2.SlowBuffer = function(e2) {
            return +e2 != e2 && (e2 = 0), s.alloc(+e2);
          }, n2.INSPECT_MAX_BYTES = 50;
          n2.kMaxLength = 2147483647, s.TYPED_ARRAY_SUPPORT = function() {
            try {
              var e2 = new Uint8Array(1);
              return e2.__proto__ = { __proto__: Uint8Array.prototype, foo: function() {
                return 42;
              } }, e2.foo() === 42;
            } catch (t4) {
              return false;
            }
          }(), s.TYPED_ARRAY_SUPPORT || typeof console == "undefined" || typeof console.error != "function" || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(s.prototype, "parent", { enumerable: true, get: function() {
            return s.isBuffer(this) ? this.buffer : void 0;
          } }), Object.defineProperty(s.prototype, "offset", { enumerable: true, get: function() {
            return s.isBuffer(this) ? this.byteOffset : void 0;
          } }), typeof Symbol != "undefined" && Symbol.species != null && s[Symbol.species] === s && Object.defineProperty(s, Symbol.species, { value: null, configurable: true, enumerable: false, writable: false }), s.poolSize = 8192, s.from = function(e2, t4, n3) {
            return l(e2, t4, n3);
          }, s.prototype.__proto__ = Uint8Array.prototype, s.__proto__ = Uint8Array, s.alloc = function(e2, t4, n3) {
            return u(e2, t4, n3);
          }, s.allocUnsafe = function(e2) {
            return p(e2);
          }, s.allocUnsafeSlow = function(e2) {
            return p(e2);
          }, s.isBuffer = function(e2) {
            return e2 != null && e2._isBuffer === true && e2 !== s.prototype;
          }, s.compare = function(e2, t4) {
            if (K(e2, Uint8Array) && (e2 = s.from(e2, e2.offset, e2.byteLength)), K(t4, Uint8Array) && (t4 = s.from(t4, t4.offset, t4.byteLength)), !s.isBuffer(e2) || !s.isBuffer(t4))
              throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
            if (e2 === t4)
              return 0;
            for (var n3 = e2.length, r2 = t4.length, d2 = 0, l2 = o(n3, r2); d2 < l2; ++d2)
              if (e2[d2] !== t4[d2]) {
                n3 = e2[d2], r2 = t4[d2];
                break;
              }
            return n3 < r2 ? -1 : r2 < n3 ? 1 : 0;
          }, s.isEncoding = function(e2) {
            switch ((e2 + "").toLowerCase()) {
              case "hex":
              case "utf8":
              case "utf-8":
              case "ascii":
              case "latin1":
              case "binary":
              case "base64":
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return true;
              default:
                return false;
            }
          }, s.concat = function(e2, t4) {
            if (!Array.isArray(e2))
              throw new TypeError('"list" argument must be an Array of Buffers');
            if (e2.length === 0)
              return s.alloc(0);
            var n3;
            if (t4 === void 0)
              for (t4 = 0, n3 = 0; n3 < e2.length; ++n3)
                t4 += e2[n3].length;
            var r2 = s.allocUnsafe(t4), a = 0;
            for (n3 = 0; n3 < e2.length; ++n3) {
              var o2 = e2[n3];
              if (K(o2, Uint8Array) && (o2 = s.from(o2)), !s.isBuffer(o2))
                throw new TypeError('"list" argument must be an Array of Buffers');
              o2.copy(r2, a), a += o2.length;
            }
            return r2;
          }, s.byteLength = b, s.prototype._isBuffer = true, s.prototype.swap16 = function() {
            var e2 = this.length;
            if (e2 % 2 != 0)
              throw new RangeError("Buffer size must be a multiple of 16-bits");
            for (var t4 = 0; t4 < e2; t4 += 2)
              C(this, t4, t4 + 1);
            return this;
          }, s.prototype.swap32 = function() {
            var e2 = this.length;
            if (e2 % 4 != 0)
              throw new RangeError("Buffer size must be a multiple of 32-bits");
            for (var t4 = 0; t4 < e2; t4 += 4)
              C(this, t4, t4 + 3), C(this, t4 + 1, t4 + 2);
            return this;
          }, s.prototype.swap64 = function() {
            var e2 = this.length;
            if (e2 % 8 != 0)
              throw new RangeError("Buffer size must be a multiple of 64-bits");
            for (var t4 = 0; t4 < e2; t4 += 8)
              C(this, t4, t4 + 7), C(this, t4 + 1, t4 + 6), C(this, t4 + 2, t4 + 5), C(this, t4 + 3, t4 + 4);
            return this;
          }, s.prototype.toString = function() {
            var e2 = this.length;
            return e2 === 0 ? "" : arguments.length === 0 ? x(this, 0, e2) : y.apply(this, arguments);
          }, s.prototype.toLocaleString = s.prototype.toString, s.prototype.equals = function(e2) {
            if (!s.isBuffer(e2))
              throw new TypeError("Argument must be a Buffer");
            return this === e2 || s.compare(this, e2) === 0;
          }, s.prototype.inspect = function() {
            var e2 = "", t4 = n2.INSPECT_MAX_BYTES;
            return e2 = this.toString("hex", 0, t4).replace(/(.{2})/g, "$1 ").trim(), this.length > t4 && (e2 += " ... "), "<Buffer " + e2 + ">";
          }, s.prototype.compare = function(e2, t4, n3, r2, a) {
            if (K(e2, Uint8Array) && (e2 = s.from(e2, e2.offset, e2.byteLength)), !s.isBuffer(e2))
              throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e2);
            if (t4 === void 0 && (t4 = 0), n3 === void 0 && (n3 = e2 ? e2.length : 0), r2 === void 0 && (r2 = 0), a === void 0 && (a = this.length), 0 > t4 || n3 > e2.length || 0 > r2 || a > this.length)
              throw new RangeError("out of range index");
            if (r2 >= a && t4 >= n3)
              return 0;
            if (r2 >= a)
              return -1;
            if (t4 >= n3)
              return 1;
            if (t4 >>>= 0, n3 >>>= 0, r2 >>>= 0, a >>>= 0, this === e2)
              return 0;
            for (var d2 = a - r2, l2 = n3 - t4, c2 = o(d2, l2), u2 = this.slice(r2, a), p2 = e2.slice(t4, n3), f2 = 0; f2 < c2; ++f2)
              if (u2[f2] !== p2[f2]) {
                d2 = u2[f2], l2 = p2[f2];
                break;
              }
            return d2 < l2 ? -1 : l2 < d2 ? 1 : 0;
          }, s.prototype.includes = function(e2, t4, n3) {
            return this.indexOf(e2, t4, n3) !== -1;
          }, s.prototype.indexOf = function(e2, t4, n3) {
            return R(this, e2, t4, n3, true);
          }, s.prototype.lastIndexOf = function(e2, t4, n3) {
            return R(this, e2, t4, n3, false);
          }, s.prototype.write = function(e2, t4, n3, r2) {
            if (t4 === void 0)
              r2 = "utf8", n3 = this.length, t4 = 0;
            else if (n3 === void 0 && typeof t4 == "string")
              r2 = t4, n3 = this.length, t4 = 0;
            else if (isFinite(t4))
              t4 >>>= 0, isFinite(n3) ? (n3 >>>= 0, r2 === void 0 && (r2 = "utf8")) : (r2 = n3, n3 = void 0);
            else
              throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
            var a = this.length - t4;
            if ((n3 === void 0 || n3 > a) && (n3 = a), 0 < e2.length && (0 > n3 || 0 > t4) || t4 > this.length)
              throw new RangeError("Attempt to write outside buffer bounds");
            r2 || (r2 = "utf8");
            for (var o2 = false; ; )
              switch (r2) {
                case "hex":
                  return w(this, e2, t4, n3);
                case "utf8":
                case "utf-8":
                  return S(this, e2, t4, n3);
                case "ascii":
                  return T(this, e2, t4, n3);
                case "latin1":
                case "binary":
                  return v(this, e2, t4, n3);
                case "base64":
                  return k(this, e2, t4, n3);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return L(this, e2, t4, n3);
                default:
                  if (o2)
                    throw new TypeError("Unknown encoding: " + r2);
                  r2 = ("" + r2).toLowerCase(), o2 = true;
              }
          }, s.prototype.toJSON = function() {
            return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
          };
          s.prototype.slice = function(e2, t4) {
            var n3 = this.length;
            e2 = ~~e2, t4 = t4 === void 0 ? n3 : ~~t4, 0 > e2 ? (e2 += n3, 0 > e2 && (e2 = 0)) : e2 > n3 && (e2 = n3), 0 > t4 ? (t4 += n3, 0 > t4 && (t4 = 0)) : t4 > n3 && (t4 = n3), t4 < e2 && (t4 = e2);
            var r2 = this.subarray(e2, t4);
            return r2.__proto__ = s.prototype, r2;
          }, s.prototype.readUIntLE = function(e2, t4, n3) {
            e2 >>>= 0, t4 >>>= 0, n3 || O(e2, t4, this.length);
            for (var r2 = this[e2], a = 1, o2 = 0; ++o2 < t4 && (a *= 256); )
              r2 += this[e2 + o2] * a;
            return r2;
          }, s.prototype.readUIntBE = function(e2, t4, n3) {
            e2 >>>= 0, t4 >>>= 0, n3 || O(e2, t4, this.length);
            for (var r2 = this[e2 + --t4], a = 1; 0 < t4 && (a *= 256); )
              r2 += this[e2 + --t4] * a;
            return r2;
          }, s.prototype.readUInt8 = function(e2, t4) {
            return e2 >>>= 0, t4 || O(e2, 1, this.length), this[e2];
          }, s.prototype.readUInt16LE = function(e2, t4) {
            return e2 >>>= 0, t4 || O(e2, 2, this.length), this[e2] | this[e2 + 1] << 8;
          }, s.prototype.readUInt16BE = function(e2, t4) {
            return e2 >>>= 0, t4 || O(e2, 2, this.length), this[e2] << 8 | this[e2 + 1];
          }, s.prototype.readUInt32LE = function(e2, t4) {
            return e2 >>>= 0, t4 || O(e2, 4, this.length), (this[e2] | this[e2 + 1] << 8 | this[e2 + 2] << 16) + 16777216 * this[e2 + 3];
          }, s.prototype.readUInt32BE = function(e2, t4) {
            return e2 >>>= 0, t4 || O(e2, 4, this.length), 16777216 * this[e2] + (this[e2 + 1] << 16 | this[e2 + 2] << 8 | this[e2 + 3]);
          }, s.prototype.readIntLE = function(e2, t4, n3) {
            e2 >>>= 0, t4 >>>= 0, n3 || O(e2, t4, this.length);
            for (var a = this[e2], o2 = 1, d2 = 0; ++d2 < t4 && (o2 *= 256); )
              a += this[e2 + d2] * o2;
            return o2 *= 128, a >= o2 && (a -= r(2, 8 * t4)), a;
          }, s.prototype.readIntBE = function(e2, t4, n3) {
            e2 >>>= 0, t4 >>>= 0, n3 || O(e2, t4, this.length);
            for (var a = t4, o2 = 1, d2 = this[e2 + --a]; 0 < a && (o2 *= 256); )
              d2 += this[e2 + --a] * o2;
            return o2 *= 128, d2 >= o2 && (d2 -= r(2, 8 * t4)), d2;
          }, s.prototype.readInt8 = function(e2, t4) {
            return e2 >>>= 0, t4 || O(e2, 1, this.length), 128 & this[e2] ? -1 * (255 - this[e2] + 1) : this[e2];
          }, s.prototype.readInt16LE = function(e2, t4) {
            e2 >>>= 0, t4 || O(e2, 2, this.length);
            var n3 = this[e2] | this[e2 + 1] << 8;
            return 32768 & n3 ? 4294901760 | n3 : n3;
          }, s.prototype.readInt16BE = function(e2, t4) {
            e2 >>>= 0, t4 || O(e2, 2, this.length);
            var n3 = this[e2 + 1] | this[e2] << 8;
            return 32768 & n3 ? 4294901760 | n3 : n3;
          }, s.prototype.readInt32LE = function(e2, t4) {
            return e2 >>>= 0, t4 || O(e2, 4, this.length), this[e2] | this[e2 + 1] << 8 | this[e2 + 2] << 16 | this[e2 + 3] << 24;
          }, s.prototype.readInt32BE = function(e2, t4) {
            return e2 >>>= 0, t4 || O(e2, 4, this.length), this[e2] << 24 | this[e2 + 1] << 16 | this[e2 + 2] << 8 | this[e2 + 3];
          }, s.prototype.readFloatLE = function(e2, t4) {
            return e2 >>>= 0, t4 || O(e2, 4, this.length), J.read(this, e2, true, 23, 4);
          }, s.prototype.readFloatBE = function(e2, t4) {
            return e2 >>>= 0, t4 || O(e2, 4, this.length), J.read(this, e2, false, 23, 4);
          }, s.prototype.readDoubleLE = function(e2, t4) {
            return e2 >>>= 0, t4 || O(e2, 8, this.length), J.read(this, e2, true, 52, 8);
          }, s.prototype.readDoubleBE = function(e2, t4) {
            return e2 >>>= 0, t4 || O(e2, 8, this.length), J.read(this, e2, false, 52, 8);
          }, s.prototype.writeUIntLE = function(e2, t4, n3, a) {
            if (e2 = +e2, t4 >>>= 0, n3 >>>= 0, !a) {
              var o2 = r(2, 8 * n3) - 1;
              F(this, e2, t4, n3, o2, 0);
            }
            var d2 = 1, s2 = 0;
            for (this[t4] = 255 & e2; ++s2 < n3 && (d2 *= 256); )
              this[t4 + s2] = 255 & e2 / d2;
            return t4 + n3;
          }, s.prototype.writeUIntBE = function(e2, t4, n3, a) {
            if (e2 = +e2, t4 >>>= 0, n3 >>>= 0, !a) {
              var o2 = r(2, 8 * n3) - 1;
              F(this, e2, t4, n3, o2, 0);
            }
            var d2 = n3 - 1, s2 = 1;
            for (this[t4 + d2] = 255 & e2; 0 <= --d2 && (s2 *= 256); )
              this[t4 + d2] = 255 & e2 / s2;
            return t4 + n3;
          }, s.prototype.writeUInt8 = function(e2, t4, n3) {
            return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 1, 255, 0), this[t4] = 255 & e2, t4 + 1;
          }, s.prototype.writeUInt16LE = function(e2, t4, n3) {
            return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 2, 65535, 0), this[t4] = 255 & e2, this[t4 + 1] = e2 >>> 8, t4 + 2;
          }, s.prototype.writeUInt16BE = function(e2, t4, n3) {
            return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 2, 65535, 0), this[t4] = e2 >>> 8, this[t4 + 1] = 255 & e2, t4 + 2;
          }, s.prototype.writeUInt32LE = function(e2, t4, n3) {
            return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 4, 4294967295, 0), this[t4 + 3] = e2 >>> 24, this[t4 + 2] = e2 >>> 16, this[t4 + 1] = e2 >>> 8, this[t4] = 255 & e2, t4 + 4;
          }, s.prototype.writeUInt32BE = function(e2, t4, n3) {
            return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 4, 4294967295, 0), this[t4] = e2 >>> 24, this[t4 + 1] = e2 >>> 16, this[t4 + 2] = e2 >>> 8, this[t4 + 3] = 255 & e2, t4 + 4;
          }, s.prototype.writeIntLE = function(e2, t4, n3, a) {
            if (e2 = +e2, t4 >>>= 0, !a) {
              var o2 = r(2, 8 * n3 - 1);
              F(this, e2, t4, n3, o2 - 1, -o2);
            }
            var d2 = 0, s2 = 1, l2 = 0;
            for (this[t4] = 255 & e2; ++d2 < n3 && (s2 *= 256); )
              0 > e2 && l2 === 0 && this[t4 + d2 - 1] !== 0 && (l2 = 1), this[t4 + d2] = 255 & (e2 / s2 >> 0) - l2;
            return t4 + n3;
          }, s.prototype.writeIntBE = function(e2, t4, n3, a) {
            if (e2 = +e2, t4 >>>= 0, !a) {
              var o2 = r(2, 8 * n3 - 1);
              F(this, e2, t4, n3, o2 - 1, -o2);
            }
            var d2 = n3 - 1, s2 = 1, l2 = 0;
            for (this[t4 + d2] = 255 & e2; 0 <= --d2 && (s2 *= 256); )
              0 > e2 && l2 === 0 && this[t4 + d2 + 1] !== 0 && (l2 = 1), this[t4 + d2] = 255 & (e2 / s2 >> 0) - l2;
            return t4 + n3;
          }, s.prototype.writeInt8 = function(e2, t4, n3) {
            return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 1, 127, -128), 0 > e2 && (e2 = 255 + e2 + 1), this[t4] = 255 & e2, t4 + 1;
          }, s.prototype.writeInt16LE = function(e2, t4, n3) {
            return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 2, 32767, -32768), this[t4] = 255 & e2, this[t4 + 1] = e2 >>> 8, t4 + 2;
          }, s.prototype.writeInt16BE = function(e2, t4, n3) {
            return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 2, 32767, -32768), this[t4] = e2 >>> 8, this[t4 + 1] = 255 & e2, t4 + 2;
          }, s.prototype.writeInt32LE = function(e2, t4, n3) {
            return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 4, 2147483647, -2147483648), this[t4] = 255 & e2, this[t4 + 1] = e2 >>> 8, this[t4 + 2] = e2 >>> 16, this[t4 + 3] = e2 >>> 24, t4 + 4;
          }, s.prototype.writeInt32BE = function(e2, t4, n3) {
            return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 4, 2147483647, -2147483648), 0 > e2 && (e2 = 4294967295 + e2 + 1), this[t4] = e2 >>> 24, this[t4 + 1] = e2 >>> 16, this[t4 + 2] = e2 >>> 8, this[t4 + 3] = 255 & e2, t4 + 4;
          }, s.prototype.writeFloatLE = function(e2, t4, n3) {
            return U(this, e2, t4, true, n3);
          }, s.prototype.writeFloatBE = function(e2, t4, n3) {
            return U(this, e2, t4, false, n3);
          }, s.prototype.writeDoubleLE = function(e2, t4, n3) {
            return j(this, e2, t4, true, n3);
          }, s.prototype.writeDoubleBE = function(e2, t4, n3) {
            return j(this, e2, t4, false, n3);
          }, s.prototype.copy = function(e2, t4, n3, r2) {
            if (!s.isBuffer(e2))
              throw new TypeError("argument should be a Buffer");
            if (n3 || (n3 = 0), r2 || r2 === 0 || (r2 = this.length), t4 >= e2.length && (t4 = e2.length), t4 || (t4 = 0), 0 < r2 && r2 < n3 && (r2 = n3), r2 === n3)
              return 0;
            if (e2.length === 0 || this.length === 0)
              return 0;
            if (0 > t4)
              throw new RangeError("targetStart out of bounds");
            if (0 > n3 || n3 >= this.length)
              throw new RangeError("Index out of range");
            if (0 > r2)
              throw new RangeError("sourceEnd out of bounds");
            r2 > this.length && (r2 = this.length), e2.length - t4 < r2 - n3 && (r2 = e2.length - t4 + n3);
            var a = r2 - n3;
            if (this === e2 && typeof Uint8Array.prototype.copyWithin == "function")
              this.copyWithin(t4, n3, r2);
            else if (this === e2 && n3 < t4 && t4 < r2)
              for (var o2 = a - 1; 0 <= o2; --o2)
                e2[o2 + t4] = this[o2 + n3];
            else
              Uint8Array.prototype.set.call(e2, this.subarray(n3, r2), t4);
            return a;
          }, s.prototype.fill = function(e2, t4, n3, r2) {
            if (typeof e2 == "string") {
              if (typeof t4 == "string" ? (r2 = t4, t4 = 0, n3 = this.length) : typeof n3 == "string" && (r2 = n3, n3 = this.length), r2 !== void 0 && typeof r2 != "string")
                throw new TypeError("encoding must be a string");
              if (typeof r2 == "string" && !s.isEncoding(r2))
                throw new TypeError("Unknown encoding: " + r2);
              if (e2.length === 1) {
                var a = e2.charCodeAt(0);
                (r2 === "utf8" && 128 > a || r2 === "latin1") && (e2 = a);
              }
            } else
              typeof e2 == "number" && (e2 &= 255);
            if (0 > t4 || this.length < t4 || this.length < n3)
              throw new RangeError("Out of range index");
            if (n3 <= t4)
              return this;
            t4 >>>= 0, n3 = n3 === void 0 ? this.length : n3 >>> 0, e2 || (e2 = 0);
            var o2;
            if (typeof e2 == "number")
              for (o2 = t4; o2 < n3; ++o2)
                this[o2] = e2;
            else {
              var d2 = s.isBuffer(e2) ? e2 : s.from(e2, r2), l2 = d2.length;
              if (l2 === 0)
                throw new TypeError('The value "' + e2 + '" is invalid for argument "value"');
              for (o2 = 0; o2 < n3 - t4; ++o2)
                this[o2 + t4] = d2[o2 % l2];
            }
            return this;
          };
          var Q = /[^+/0-9A-Za-z-_]/g;
        }).call(this);
      }).call(this, e("buffer").Buffer);
    }, { "base64-js": 1, buffer: 3, ieee754: 9 }], 4: [function(e, t2, n2) {
      (function(a) {
        (function() {
          function r2() {
            let e2;
            try {
              e2 = n2.storage.getItem("debug");
            } catch (e3) {
            }
            return !e2 && typeof a != "undefined" && "env" in a && (e2 = a.env.DEBUG), e2;
          }
          n2.formatArgs = function(e2) {
            if (e2[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + e2[0] + (this.useColors ? "%c " : " ") + "+" + t2.exports.humanize(this.diff), !this.useColors)
              return;
            const n3 = "color: " + this.color;
            e2.splice(1, 0, n3, "color: inherit");
            let r3 = 0, a2 = 0;
            e2[0].replace(/%[a-zA-Z%]/g, (e3) => {
              e3 === "%%" || (r3++, e3 === "%c" && (a2 = r3));
            }), e2.splice(a2, 0, n3);
          }, n2.save = function(e2) {
            try {
              e2 ? n2.storage.setItem("debug", e2) : n2.storage.removeItem("debug");
            } catch (e3) {
            }
          }, n2.load = r2, n2.useColors = function() {
            return !!(typeof window != "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) || !(typeof navigator != "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) && (typeof document != "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window != "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator != "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && 31 <= parseInt(RegExp.$1, 10) || typeof navigator != "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
          }, n2.storage = function() {
            try {
              return localStorage;
            } catch (e2) {
            }
          }(), n2.destroy = (() => {
            let e2 = false;
            return () => {
              e2 || (e2 = true, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
            };
          })(), n2.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"], n2.log = console.debug || console.log || (() => {
          }), t2.exports = e("./common")(n2);
          const { formatters: o } = t2.exports;
          o.j = function(e2) {
            try {
              return JSON.stringify(e2);
            } catch (e3) {
              return "[UnexpectedJSONParseError]: " + e3.message;
            }
          };
        }).call(this);
      }).call(this, e("_process"));
    }, { "./common": 5, _process: 12 }], 5: [function(e, t2) {
      t2.exports = function(t3) {
        function r2(e2) {
          function t4(...e3) {
            if (!t4.enabled)
              return;
            const a2 = t4, o3 = +new Date(), i = o3 - (n2 || o3);
            a2.diff = i, a2.prev = n2, a2.curr = o3, n2 = o3, e3[0] = r2.coerce(e3[0]), typeof e3[0] != "string" && e3.unshift("%O");
            let d = 0;
            e3[0] = e3[0].replace(/%([a-zA-Z%])/g, (t5, n3) => {
              if (t5 === "%%")
                return "%";
              d++;
              const o4 = r2.formatters[n3];
              if (typeof o4 == "function") {
                const n4 = e3[d];
                t5 = o4.call(a2, n4), e3.splice(d, 1), d--;
              }
              return t5;
            }), r2.formatArgs.call(a2, e3);
            const s = a2.log || r2.log;
            s.apply(a2, e3);
          }
          let n2, o2 = null;
          return t4.namespace = e2, t4.useColors = r2.useColors(), t4.color = r2.selectColor(e2), t4.extend = a, t4.destroy = r2.destroy, Object.defineProperty(t4, "enabled", { enumerable: true, configurable: false, get: () => o2 === null ? r2.enabled(e2) : o2, set: (e3) => {
            o2 = e3;
          } }), typeof r2.init == "function" && r2.init(t4), t4;
        }
        function a(e2, t4) {
          const n2 = r2(this.namespace + (typeof t4 == "undefined" ? ":" : t4) + e2);
          return n2.log = this.log, n2;
        }
        function o(e2) {
          return e2.toString().substring(2, e2.toString().length - 2).replace(/\.\*\?$/, "*");
        }
        return r2.debug = r2, r2.default = r2, r2.coerce = function(e2) {
          return e2 instanceof Error ? e2.stack || e2.message : e2;
        }, r2.disable = function() {
          const e2 = [...r2.names.map(o), ...r2.skips.map(o).map((e3) => "-" + e3)].join(",");
          return r2.enable(""), e2;
        }, r2.enable = function(e2) {
          r2.save(e2), r2.names = [], r2.skips = [];
          let t4;
          const n2 = (typeof e2 == "string" ? e2 : "").split(/[\s,]+/), a2 = n2.length;
          for (t4 = 0; t4 < a2; t4++)
            n2[t4] && (e2 = n2[t4].replace(/\*/g, ".*?"), e2[0] === "-" ? r2.skips.push(new RegExp("^" + e2.substr(1) + "$")) : r2.names.push(new RegExp("^" + e2 + "$")));
        }, r2.enabled = function(e2) {
          if (e2[e2.length - 1] === "*")
            return true;
          let t4, n2;
          for (t4 = 0, n2 = r2.skips.length; t4 < n2; t4++)
            if (r2.skips[t4].test(e2))
              return false;
          for (t4 = 0, n2 = r2.names.length; t4 < n2; t4++)
            if (r2.names[t4].test(e2))
              return true;
          return false;
        }, r2.humanize = e("ms"), r2.destroy = function() {
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }, Object.keys(t3).forEach((e2) => {
          r2[e2] = t3[e2];
        }), r2.names = [], r2.skips = [], r2.formatters = {}, r2.selectColor = function(e2) {
          let t4 = 0;
          for (let n2 = 0; n2 < e2.length; n2++)
            t4 = (t4 << 5) - t4 + e2.charCodeAt(n2), t4 |= 0;
          return r2.colors[n(t4) % r2.colors.length];
        }, r2.enable(r2.load()), r2;
      };
    }, { ms: 11 }], 6: [function(e, t2) {
      function n2(e2, t3) {
        for (const n3 in t3)
          Object.defineProperty(e2, n3, { value: t3[n3], enumerable: true, configurable: true });
        return e2;
      }
      t2.exports = function(e2, t3, r2) {
        if (!e2 || typeof e2 == "string")
          throw new TypeError("Please pass an Error to err-code");
        r2 || (r2 = {}), typeof t3 == "object" && (r2 = t3, t3 = ""), t3 && (r2.code = t3);
        try {
          return n2(e2, r2);
        } catch (t4) {
          r2.message = e2.message, r2.stack = e2.stack;
          const a = function() {
          };
          a.prototype = Object.create(Object.getPrototypeOf(e2));
          const o = n2(new a(), r2);
          return o;
        }
      };
    }, {}], 7: [function(e, t2) {
      function n2(e2) {
        console && console.warn && console.warn(e2);
      }
      function r2() {
        r2.init.call(this);
      }
      function a(e2) {
        if (typeof e2 != "function")
          throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e2);
      }
      function o(e2) {
        return e2._maxListeners === void 0 ? r2.defaultMaxListeners : e2._maxListeners;
      }
      function i(e2, t3, r3, i2) {
        var d2, s2, l2;
        if (a(r3), s2 = e2._events, s2 === void 0 ? (s2 = e2._events = /* @__PURE__ */ Object.create(null), e2._eventsCount = 0) : (s2.newListener !== void 0 && (e2.emit("newListener", t3, r3.listener ? r3.listener : r3), s2 = e2._events), l2 = s2[t3]), l2 === void 0)
          l2 = s2[t3] = r3, ++e2._eventsCount;
        else if (typeof l2 == "function" ? l2 = s2[t3] = i2 ? [r3, l2] : [l2, r3] : i2 ? l2.unshift(r3) : l2.push(r3), d2 = o(e2), 0 < d2 && l2.length > d2 && !l2.warned) {
          l2.warned = true;
          var c2 = new Error("Possible EventEmitter memory leak detected. " + l2.length + " " + (t3 + " listeners added. Use emitter.setMaxListeners() to increase limit"));
          c2.name = "MaxListenersExceededWarning", c2.emitter = e2, c2.type = t3, c2.count = l2.length, n2(c2);
        }
        return e2;
      }
      function d() {
        if (!this.fired)
          return this.target.removeListener(this.type, this.wrapFn), this.fired = true, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
      }
      function s(e2, t3, n3) {
        var r3 = { fired: false, wrapFn: void 0, target: e2, type: t3, listener: n3 }, a2 = d.bind(r3);
        return a2.listener = n3, r3.wrapFn = a2, a2;
      }
      function l(e2, t3, n3) {
        var r3 = e2._events;
        if (r3 === void 0)
          return [];
        var a2 = r3[t3];
        return a2 === void 0 ? [] : typeof a2 == "function" ? n3 ? [a2.listener || a2] : [a2] : n3 ? f(a2) : u(a2, a2.length);
      }
      function c(e2) {
        var t3 = this._events;
        if (t3 !== void 0) {
          var n3 = t3[e2];
          if (typeof n3 == "function")
            return 1;
          if (n3 !== void 0)
            return n3.length;
        }
        return 0;
      }
      function u(e2, t3) {
        for (var n3 = Array(t3), r3 = 0; r3 < t3; ++r3)
          n3[r3] = e2[r3];
        return n3;
      }
      function p(e2, t3) {
        for (; t3 + 1 < e2.length; t3++)
          e2[t3] = e2[t3 + 1];
        e2.pop();
      }
      function f(e2) {
        for (var t3 = Array(e2.length), n3 = 0; n3 < t3.length; ++n3)
          t3[n3] = e2[n3].listener || e2[n3];
        return t3;
      }
      function g(e2, t3, n3) {
        typeof e2.on == "function" && _(e2, "error", t3, n3);
      }
      function _(e2, t3, n3, r3) {
        if (typeof e2.on == "function")
          r3.once ? e2.once(t3, n3) : e2.on(t3, n3);
        else if (typeof e2.addEventListener == "function")
          e2.addEventListener(t3, function a2(o2) {
            r3.once && e2.removeEventListener(t3, a2), n3(o2);
          });
        else
          throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof e2);
      }
      var h, m = typeof Reflect == "object" ? Reflect : null, b = m && typeof m.apply == "function" ? m.apply : function(e2, t3, n3) {
        return Function.prototype.apply.call(e2, t3, n3);
      };
      h = m && typeof m.ownKeys == "function" ? m.ownKeys : Object.getOwnPropertySymbols ? function(e2) {
        return Object.getOwnPropertyNames(e2).concat(Object.getOwnPropertySymbols(e2));
      } : function(e2) {
        return Object.getOwnPropertyNames(e2);
      };
      var y = Number.isNaN || function(e2) {
        return e2 !== e2;
      };
      t2.exports = r2, t2.exports.once = function(e2, t3) {
        return new Promise(function(n3, r3) {
          function a2(n4) {
            e2.removeListener(t3, o2), r3(n4);
          }
          function o2() {
            typeof e2.removeListener == "function" && e2.removeListener("error", a2), n3([].slice.call(arguments));
          }
          _(e2, t3, o2, { once: true }), t3 !== "error" && g(e2, a2, { once: true });
        });
      }, r2.EventEmitter = r2, r2.prototype._events = void 0, r2.prototype._eventsCount = 0, r2.prototype._maxListeners = void 0;
      var C = 10;
      Object.defineProperty(r2, "defaultMaxListeners", { enumerable: true, get: function() {
        return C;
      }, set: function(e2) {
        if (typeof e2 != "number" || 0 > e2 || y(e2))
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e2 + ".");
        C = e2;
      } }), r2.init = function() {
        (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
      }, r2.prototype.setMaxListeners = function(e2) {
        if (typeof e2 != "number" || 0 > e2 || y(e2))
          throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e2 + ".");
        return this._maxListeners = e2, this;
      }, r2.prototype.getMaxListeners = function() {
        return o(this);
      }, r2.prototype.emit = function(e2) {
        for (var t3 = [], n3 = 1; n3 < arguments.length; n3++)
          t3.push(arguments[n3]);
        var r3 = e2 === "error", a2 = this._events;
        if (a2 !== void 0)
          r3 = r3 && a2.error === void 0;
        else if (!r3)
          return false;
        if (r3) {
          var o2;
          if (0 < t3.length && (o2 = t3[0]), o2 instanceof Error)
            throw o2;
          var d2 = new Error("Unhandled error." + (o2 ? " (" + o2.message + ")" : ""));
          throw d2.context = o2, d2;
        }
        var s2 = a2[e2];
        if (s2 === void 0)
          return false;
        if (typeof s2 == "function")
          b(s2, this, t3);
        else
          for (var l2 = s2.length, c2 = u(s2, l2), n3 = 0; n3 < l2; ++n3)
            b(c2[n3], this, t3);
        return true;
      }, r2.prototype.addListener = function(e2, t3) {
        return i(this, e2, t3, false);
      }, r2.prototype.on = r2.prototype.addListener, r2.prototype.prependListener = function(e2, t3) {
        return i(this, e2, t3, true);
      }, r2.prototype.once = function(e2, t3) {
        return a(t3), this.on(e2, s(this, e2, t3)), this;
      }, r2.prototype.prependOnceListener = function(e2, t3) {
        return a(t3), this.prependListener(e2, s(this, e2, t3)), this;
      }, r2.prototype.removeListener = function(e2, t3) {
        var n3, r3, o2, d2, s2;
        if (a(t3), r3 = this._events, r3 === void 0)
          return this;
        if (n3 = r3[e2], n3 === void 0)
          return this;
        if (n3 === t3 || n3.listener === t3)
          --this._eventsCount == 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete r3[e2], r3.removeListener && this.emit("removeListener", e2, n3.listener || t3));
        else if (typeof n3 != "function") {
          for (o2 = -1, d2 = n3.length - 1; 0 <= d2; d2--)
            if (n3[d2] === t3 || n3[d2].listener === t3) {
              s2 = n3[d2].listener, o2 = d2;
              break;
            }
          if (0 > o2)
            return this;
          o2 === 0 ? n3.shift() : p(n3, o2), n3.length === 1 && (r3[e2] = n3[0]), r3.removeListener !== void 0 && this.emit("removeListener", e2, s2 || t3);
        }
        return this;
      }, r2.prototype.off = r2.prototype.removeListener, r2.prototype.removeAllListeners = function(e2) {
        var t3, n3, r3;
        if (n3 = this._events, n3 === void 0)
          return this;
        if (n3.removeListener === void 0)
          return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : n3[e2] !== void 0 && (--this._eventsCount == 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete n3[e2]), this;
        if (arguments.length === 0) {
          var a2, o2 = Object.keys(n3);
          for (r3 = 0; r3 < o2.length; ++r3)
            a2 = o2[r3], a2 !== "removeListener" && this.removeAllListeners(a2);
          return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
        }
        if (t3 = n3[e2], typeof t3 == "function")
          this.removeListener(e2, t3);
        else if (t3 !== void 0)
          for (r3 = t3.length - 1; 0 <= r3; r3--)
            this.removeListener(e2, t3[r3]);
        return this;
      }, r2.prototype.listeners = function(e2) {
        return l(this, e2, true);
      }, r2.prototype.rawListeners = function(e2) {
        return l(this, e2, false);
      }, r2.listenerCount = function(e2, t3) {
        return typeof e2.listenerCount == "function" ? e2.listenerCount(t3) : c.call(e2, t3);
      }, r2.prototype.listenerCount = c, r2.prototype.eventNames = function() {
        return 0 < this._eventsCount ? h(this._events) : [];
      };
    }, {}], 8: [function(e, t2) {
      t2.exports = function() {
        if (typeof globalThis == "undefined")
          return null;
        var e2 = { RTCPeerConnection: globalThis.RTCPeerConnection || globalThis.mozRTCPeerConnection || globalThis.webkitRTCPeerConnection, RTCSessionDescription: globalThis.RTCSessionDescription || globalThis.mozRTCSessionDescription || globalThis.webkitRTCSessionDescription, RTCIceCandidate: globalThis.RTCIceCandidate || globalThis.mozRTCIceCandidate || globalThis.webkitRTCIceCandidate };
        return e2.RTCPeerConnection ? e2 : null;
      };
    }, {}], 9: [function(e, a, o) {
      /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
      o.read = function(t2, n2, a2, o2, l) {
        var c, u, p = 8 * l - o2 - 1, f = (1 << p) - 1, g = f >> 1, _ = -7, h = a2 ? l - 1 : 0, b = a2 ? -1 : 1, d = t2[n2 + h];
        for (h += b, c = d & (1 << -_) - 1, d >>= -_, _ += p; 0 < _; c = 256 * c + t2[n2 + h], h += b, _ -= 8)
          ;
        for (u = c & (1 << -_) - 1, c >>= -_, _ += o2; 0 < _; u = 256 * u + t2[n2 + h], h += b, _ -= 8)
          ;
        if (c === 0)
          c = 1 - g;
        else {
          if (c === f)
            return u ? NaN : (d ? -1 : 1) * (1 / 0);
          u += r(2, o2), c -= g;
        }
        return (d ? -1 : 1) * u * r(2, c - o2);
      }, o.write = function(a2, o2, l, u, p, f) {
        var h, b, y, g = Math.LN2, _ = Math.log, C = 8 * f - p - 1, R = (1 << C) - 1, E = R >> 1, w = p === 23 ? r(2, -24) - r(2, -77) : 0, S = u ? 0 : f - 1, T = u ? 1 : -1, d = 0 > o2 || o2 === 0 && 0 > 1 / o2 ? 1 : 0;
        for (o2 = n(o2), isNaN(o2) || o2 === 1 / 0 ? (b = isNaN(o2) ? 1 : 0, h = R) : (h = t(_(o2) / g), 1 > o2 * (y = r(2, -h)) && (h--, y *= 2), o2 += 1 <= h + E ? w / y : w * r(2, 1 - E), 2 <= o2 * y && (h++, y /= 2), h + E >= R ? (b = 0, h = R) : 1 <= h + E ? (b = (o2 * y - 1) * r(2, p), h += E) : (b = o2 * r(2, E - 1) * r(2, p), h = 0)); 8 <= p; a2[l + S] = 255 & b, S += T, b /= 256, p -= 8)
          ;
        for (h = h << p | b, C += p; 0 < C; a2[l + S] = 255 & h, S += T, h /= 256, C -= 8)
          ;
        a2[l + S - T] |= 128 * d;
      };
    }, {}], 10: [function(e, t2) {
      t2.exports = typeof Object.create == "function" ? function(e2, t3) {
        t3 && (e2.super_ = t3, e2.prototype = Object.create(t3.prototype, { constructor: { value: e2, enumerable: false, writable: true, configurable: true } }));
      } : function(e2, t3) {
        if (t3) {
          e2.super_ = t3;
          var n2 = function() {
          };
          n2.prototype = t3.prototype, e2.prototype = new n2(), e2.prototype.constructor = e2;
        }
      };
    }, {}], 11: [function(e, t2) {
      var r2 = Math.round;
      function a(e2) {
        if (e2 += "", !(100 < e2.length)) {
          var t3 = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e2);
          if (t3) {
            var r3 = parseFloat(t3[1]), n2 = (t3[2] || "ms").toLowerCase();
            return n2 === "years" || n2 === "year" || n2 === "yrs" || n2 === "yr" || n2 === "y" ? 315576e5 * r3 : n2 === "weeks" || n2 === "week" || n2 === "w" ? 6048e5 * r3 : n2 === "days" || n2 === "day" || n2 === "d" ? 864e5 * r3 : n2 === "hours" || n2 === "hour" || n2 === "hrs" || n2 === "hr" || n2 === "h" ? 36e5 * r3 : n2 === "minutes" || n2 === "minute" || n2 === "mins" || n2 === "min" || n2 === "m" ? 6e4 * r3 : n2 === "seconds" || n2 === "second" || n2 === "secs" || n2 === "sec" || n2 === "s" ? 1e3 * r3 : n2 === "milliseconds" || n2 === "millisecond" || n2 === "msecs" || n2 === "msec" || n2 === "ms" ? r3 : void 0;
          }
        }
      }
      function o(e2) {
        var t3 = n(e2);
        return 864e5 <= t3 ? r2(e2 / 864e5) + "d" : 36e5 <= t3 ? r2(e2 / 36e5) + "h" : 6e4 <= t3 ? r2(e2 / 6e4) + "m" : 1e3 <= t3 ? r2(e2 / 1e3) + "s" : e2 + "ms";
      }
      function i(e2) {
        var t3 = n(e2);
        return 864e5 <= t3 ? s(e2, t3, 864e5, "day") : 36e5 <= t3 ? s(e2, t3, 36e5, "hour") : 6e4 <= t3 ? s(e2, t3, 6e4, "minute") : 1e3 <= t3 ? s(e2, t3, 1e3, "second") : e2 + " ms";
      }
      function s(e2, t3, a2, n2) {
        return r2(e2 / a2) + " " + n2 + (t3 >= 1.5 * a2 ? "s" : "");
      }
      t2.exports = function(e2, t3) {
        t3 = t3 || {};
        var n2 = typeof e2;
        if (n2 == "string" && 0 < e2.length)
          return a(e2);
        if (n2 === "number" && isFinite(e2))
          return t3.long ? i(e2) : o(e2);
        throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e2));
      };
    }, {}], 12: [function(e, t2) {
      function n2() {
        throw new Error("setTimeout has not been defined");
      }
      function r2() {
        throw new Error("clearTimeout has not been defined");
      }
      function a(t3) {
        if (c === setTimeout)
          return setTimeout(t3, 0);
        if ((c === n2 || !c) && setTimeout)
          return c = setTimeout, setTimeout(t3, 0);
        try {
          return c(t3, 0);
        } catch (n3) {
          try {
            return c.call(null, t3, 0);
          } catch (n4) {
            return c.call(this, t3, 0);
          }
        }
      }
      function o(t3) {
        if (u === clearTimeout)
          return clearTimeout(t3);
        if ((u === r2 || !u) && clearTimeout)
          return u = clearTimeout, clearTimeout(t3);
        try {
          return u(t3);
        } catch (n3) {
          try {
            return u.call(null, t3);
          } catch (n4) {
            return u.call(this, t3);
          }
        }
      }
      function i() {
        _ && f && (_ = false, f.length ? g = f.concat(g) : h = -1, g.length && d());
      }
      function d() {
        if (!_) {
          var e2 = a(i);
          _ = true;
          for (var t3 = g.length; t3; ) {
            for (f = g, g = []; ++h < t3; )
              f && f[h].run();
            h = -1, t3 = g.length;
          }
          f = null, _ = false, o(e2);
        }
      }
      function s(e2, t3) {
        this.fun = e2, this.array = t3;
      }
      function l() {
      }
      var c, u, p = t2.exports = {};
      (function() {
        try {
          c = typeof setTimeout == "function" ? setTimeout : n2;
        } catch (t3) {
          c = n2;
        }
        try {
          u = typeof clearTimeout == "function" ? clearTimeout : r2;
        } catch (t3) {
          u = r2;
        }
      })();
      var f, g = [], _ = false, h = -1;
      p.nextTick = function(e2) {
        var t3 = Array(arguments.length - 1);
        if (1 < arguments.length)
          for (var n3 = 1; n3 < arguments.length; n3++)
            t3[n3 - 1] = arguments[n3];
        g.push(new s(e2, t3)), g.length !== 1 || _ || a(d);
      }, s.prototype.run = function() {
        this.fun.apply(null, this.array);
      }, p.title = "browser", p.browser = true, p.env = {}, p.argv = [], p.version = "", p.versions = {}, p.on = l, p.addListener = l, p.once = l, p.off = l, p.removeListener = l, p.removeAllListeners = l, p.emit = l, p.prependListener = l, p.prependOnceListener = l, p.listeners = function() {
        return [];
      }, p.binding = function() {
        throw new Error("process.binding is not supported");
      }, p.cwd = function() {
        return "/";
      }, p.chdir = function() {
        throw new Error("process.chdir is not supported");
      }, p.umask = function() {
        return 0;
      };
    }, {}], 13: [function(e, t2) {
      (function(e2) {
        (function() {
          /*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
          let n2;
          t2.exports = typeof queueMicrotask == "function" ? queueMicrotask.bind(typeof window == "undefined" ? e2 : window) : (e3) => (n2 || (n2 = Promise.resolve())).then(e3).catch((e4) => setTimeout(() => {
            throw e4;
          }, 0));
        }).call(this);
      }).call(this, typeof commonjsGlobal == "undefined" ? typeof self == "undefined" ? typeof window == "undefined" ? {} : window : self : commonjsGlobal);
    }, {}], 14: [function(e, t2) {
      (function(n2, r2) {
        (function() {
          var a = e("safe-buffer").Buffer, o = r2.crypto || r2.msCrypto;
          t2.exports = o && o.getRandomValues ? function(e2, t3) {
            if (e2 > 4294967295)
              throw new RangeError("requested too many random bytes");
            var r3 = a.allocUnsafe(e2);
            if (0 < e2)
              if (65536 < e2)
                for (var i = 0; i < e2; i += 65536)
                  o.getRandomValues(r3.slice(i, i + 65536));
              else
                o.getRandomValues(r3);
            return typeof t3 == "function" ? n2.nextTick(function() {
              t3(null, r3);
            }) : r3;
          } : function() {
            throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11");
          };
        }).call(this);
      }).call(this, e("_process"), typeof commonjsGlobal == "undefined" ? typeof self == "undefined" ? typeof window == "undefined" ? {} : window : self : commonjsGlobal);
    }, { _process: 12, "safe-buffer": 30 }], 15: [function(e, t2) {
      function n2(e2, t3) {
        e2.prototype = Object.create(t3.prototype), e2.prototype.constructor = e2, e2.__proto__ = t3;
      }
      function r2(e2, t3, r3) {
        function a2(e3, n3, r4) {
          return typeof t3 == "string" ? t3 : t3(e3, n3, r4);
        }
        r3 || (r3 = Error);
        var o2 = function(e3) {
          function t4(t5, n3, r4) {
            return e3.call(this, a2(t5, n3, r4)) || this;
          }
          return n2(t4, e3), t4;
        }(r3);
        o2.prototype.name = r3.name, o2.prototype.code = e2, s[e2] = o2;
      }
      function a(e2, t3) {
        if (Array.isArray(e2)) {
          var n3 = e2.length;
          return e2 = e2.map(function(e3) {
            return e3 + "";
          }), 2 < n3 ? "one of ".concat(t3, " ").concat(e2.slice(0, n3 - 1).join(", "), ", or ") + e2[n3 - 1] : n3 === 2 ? "one of ".concat(t3, " ").concat(e2[0], " or ").concat(e2[1]) : "of ".concat(t3, " ").concat(e2[0]);
        }
        return "of ".concat(t3, " ").concat(e2 + "");
      }
      function o(e2, t3, n3) {
        return e2.substr(!n3 || 0 > n3 ? 0 : +n3, t3.length) === t3;
      }
      function i(e2, t3, n3) {
        return (n3 === void 0 || n3 > e2.length) && (n3 = e2.length), e2.substring(n3 - t3.length, n3) === t3;
      }
      function d(e2, t3, n3) {
        return typeof n3 != "number" && (n3 = 0), !(n3 + t3.length > e2.length) && e2.indexOf(t3, n3) !== -1;
      }
      var s = {};
      r2("ERR_INVALID_OPT_VALUE", function(e2, t3) {
        return 'The value "' + t3 + '" is invalid for option "' + e2 + '"';
      }, TypeError), r2("ERR_INVALID_ARG_TYPE", function(e2, t3, n3) {
        var r3;
        typeof t3 == "string" && o(t3, "not ") ? (r3 = "must not be", t3 = t3.replace(/^not /, "")) : r3 = "must be";
        var s2;
        if (i(e2, " argument"))
          s2 = "The ".concat(e2, " ").concat(r3, " ").concat(a(t3, "type"));
        else {
          var l = d(e2, ".") ? "property" : "argument";
          s2 = 'The "'.concat(e2, '" ').concat(l, " ").concat(r3, " ").concat(a(t3, "type"));
        }
        return s2 += ". Received type ".concat(typeof n3), s2;
      }, TypeError), r2("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"), r2("ERR_METHOD_NOT_IMPLEMENTED", function(e2) {
        return "The " + e2 + " method is not implemented";
      }), r2("ERR_STREAM_PREMATURE_CLOSE", "Premature close"), r2("ERR_STREAM_DESTROYED", function(e2) {
        return "Cannot call " + e2 + " after a stream was destroyed";
      }), r2("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"), r2("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"), r2("ERR_STREAM_WRITE_AFTER_END", "write after end"), r2("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), r2("ERR_UNKNOWN_ENCODING", function(e2) {
        return "Unknown encoding: " + e2;
      }, TypeError), r2("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event"), t2.exports.codes = s;
    }, {}], 16: [function(e, t2) {
      (function(n2) {
        (function() {
          function r2(e2) {
            return this instanceof r2 ? void (d.call(this, e2), s.call(this, e2), this.allowHalfOpen = true, e2 && (e2.readable === false && (this.readable = false), e2.writable === false && (this.writable = false), e2.allowHalfOpen === false && (this.allowHalfOpen = false, this.once("end", a)))) : new r2(e2);
          }
          function a() {
            this._writableState.ended || n2.nextTick(o, this);
          }
          function o(e2) {
            e2.end();
          }
          var i = Object.keys || function(e2) {
            var t3 = [];
            for (var n3 in e2)
              t3.push(n3);
            return t3;
          };
          t2.exports = r2;
          var d = e("./_stream_readable"), s = e("./_stream_writable");
          e("inherits")(r2, d);
          for (var l, c = i(s.prototype), u = 0; u < c.length; u++)
            l = c[u], r2.prototype[l] || (r2.prototype[l] = s.prototype[l]);
          Object.defineProperty(r2.prototype, "writableHighWaterMark", { enumerable: false, get: function() {
            return this._writableState.highWaterMark;
          } }), Object.defineProperty(r2.prototype, "writableBuffer", { enumerable: false, get: function() {
            return this._writableState && this._writableState.getBuffer();
          } }), Object.defineProperty(r2.prototype, "writableLength", { enumerable: false, get: function() {
            return this._writableState.length;
          } }), Object.defineProperty(r2.prototype, "destroyed", { enumerable: false, get: function() {
            return this._readableState !== void 0 && this._writableState !== void 0 && this._readableState.destroyed && this._writableState.destroyed;
          }, set: function(e2) {
            this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = e2, this._writableState.destroyed = e2);
          } });
        }).call(this);
      }).call(this, e("_process"));
    }, { "./_stream_readable": 18, "./_stream_writable": 20, _process: 12, inherits: 10 }], 17: [function(e, t2) {
      function n2(e2) {
        return this instanceof n2 ? void r2.call(this, e2) : new n2(e2);
      }
      t2.exports = n2;
      var r2 = e("./_stream_transform");
      e("inherits")(n2, r2), n2.prototype._transform = function(e2, t3, n3) {
        n3(null, e2);
      };
    }, { "./_stream_transform": 19, inherits: 10 }], 18: [function(e, t2) {
      (function(n2, r2) {
        (function() {
          function a(e2) {
            return P.from(e2);
          }
          function o(e2) {
            return P.isBuffer(e2) || e2 instanceof M;
          }
          function i(e2, t3, n3) {
            return typeof e2.prependListener == "function" ? e2.prependListener(t3, n3) : void (e2._events && e2._events[t3] ? Array.isArray(e2._events[t3]) ? e2._events[t3].unshift(n3) : e2._events[t3] = [n3, e2._events[t3]] : e2.on(t3, n3));
          }
          function d(t3, n3, r3) {
            A = A || e("./_stream_duplex"), t3 = t3 || {}, typeof r3 != "boolean" && (r3 = n3 instanceof A), this.objectMode = !!t3.objectMode, r3 && (this.objectMode = this.objectMode || !!t3.readableObjectMode), this.highWaterMark = H(this, t3, "readableHighWaterMark", r3), this.buffer = new j(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = false, this.endEmitted = false, this.reading = false, this.sync = true, this.needReadable = false, this.emittedReadable = false, this.readableListening = false, this.resumeScheduled = false, this.paused = true, this.emitClose = t3.emitClose !== false, this.autoDestroy = !!t3.autoDestroy, this.destroyed = false, this.defaultEncoding = t3.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = false, this.decoder = null, this.encoding = null, t3.encoding && (!F && (F = e("string_decoder/").StringDecoder), this.decoder = new F(t3.encoding), this.encoding = t3.encoding);
          }
          function s(t3) {
            if (A = A || e("./_stream_duplex"), !(this instanceof s))
              return new s(t3);
            var n3 = this instanceof A;
            this._readableState = new d(t3, this, n3), this.readable = true, t3 && (typeof t3.read == "function" && (this._read = t3.read), typeof t3.destroy == "function" && (this._destroy = t3.destroy)), I.call(this);
          }
          function l(e2, t3, n3, r3, o2) {
            x("readableAddChunk", t3);
            var i2 = e2._readableState;
            if (t3 === null)
              i2.reading = false, g(e2, i2);
            else {
              var d2;
              if (o2 || (d2 = u(i2, t3)), d2)
                X(e2, d2);
              else if (!(i2.objectMode || t3 && 0 < t3.length))
                r3 || (i2.reading = false, m(e2, i2));
              else if (typeof t3 == "string" || i2.objectMode || Object.getPrototypeOf(t3) === P.prototype || (t3 = a(t3)), r3)
                i2.endEmitted ? X(e2, new K()) : c(e2, i2, t3, true);
              else if (i2.ended)
                X(e2, new z());
              else {
                if (i2.destroyed)
                  return false;
                i2.reading = false, i2.decoder && !n3 ? (t3 = i2.decoder.write(t3), i2.objectMode || t3.length !== 0 ? c(e2, i2, t3, false) : m(e2, i2)) : c(e2, i2, t3, false);
              }
            }
            return !i2.ended && (i2.length < i2.highWaterMark || i2.length === 0);
          }
          function c(e2, t3, n3, r3) {
            t3.flowing && t3.length === 0 && !t3.sync ? (t3.awaitDrain = 0, e2.emit("data", n3)) : (t3.length += t3.objectMode ? 1 : n3.length, r3 ? t3.buffer.unshift(n3) : t3.buffer.push(n3), t3.needReadable && _(e2)), m(e2, t3);
          }
          function u(e2, t3) {
            var n3;
            return o(t3) || typeof t3 == "string" || t3 === void 0 || e2.objectMode || (n3 = new V("chunk", ["string", "Buffer", "Uint8Array"], t3)), n3;
          }
          function p(e2) {
            return 1073741824 <= e2 ? e2 = 1073741824 : (e2--, e2 |= e2 >>> 1, e2 |= e2 >>> 2, e2 |= e2 >>> 4, e2 |= e2 >>> 8, e2 |= e2 >>> 16, e2++), e2;
          }
          function f(e2, t3) {
            return 0 >= e2 || t3.length === 0 && t3.ended ? 0 : t3.objectMode ? 1 : e2 === e2 ? (e2 > t3.highWaterMark && (t3.highWaterMark = p(e2)), e2 <= t3.length ? e2 : t3.ended ? t3.length : (t3.needReadable = true, 0)) : t3.flowing && t3.length ? t3.buffer.head.data.length : t3.length;
          }
          function g(e2, t3) {
            if (x("onEofChunk"), !t3.ended) {
              if (t3.decoder) {
                var n3 = t3.decoder.end();
                n3 && n3.length && (t3.buffer.push(n3), t3.length += t3.objectMode ? 1 : n3.length);
              }
              t3.ended = true, t3.sync ? _(e2) : (t3.needReadable = false, !t3.emittedReadable && (t3.emittedReadable = true, h(e2)));
            }
          }
          function _(e2) {
            var t3 = e2._readableState;
            x("emitReadable", t3.needReadable, t3.emittedReadable), t3.needReadable = false, t3.emittedReadable || (x("emitReadable", t3.flowing), t3.emittedReadable = true, n2.nextTick(h, e2));
          }
          function h(e2) {
            var t3 = e2._readableState;
            x("emitReadable_", t3.destroyed, t3.length, t3.ended), !t3.destroyed && (t3.length || t3.ended) && (e2.emit("readable"), t3.emittedReadable = false), t3.needReadable = !t3.flowing && !t3.ended && t3.length <= t3.highWaterMark, S(e2);
          }
          function m(e2, t3) {
            t3.readingMore || (t3.readingMore = true, n2.nextTick(b, e2, t3));
          }
          function b(e2, t3) {
            for (; !t3.reading && !t3.ended && (t3.length < t3.highWaterMark || t3.flowing && t3.length === 0); ) {
              var n3 = t3.length;
              if (x("maybeReadMore read 0"), e2.read(0), n3 === t3.length)
                break;
            }
            t3.readingMore = false;
          }
          function y(e2) {
            return function() {
              var t3 = e2._readableState;
              x("pipeOnDrain", t3.awaitDrain), t3.awaitDrain && t3.awaitDrain--, t3.awaitDrain === 0 && D(e2, "data") && (t3.flowing = true, S(e2));
            };
          }
          function C(e2) {
            var t3 = e2._readableState;
            t3.readableListening = 0 < e2.listenerCount("readable"), t3.resumeScheduled && !t3.paused ? t3.flowing = true : 0 < e2.listenerCount("data") && e2.resume();
          }
          function R(e2) {
            x("readable nexttick read 0"), e2.read(0);
          }
          function E(e2, t3) {
            t3.resumeScheduled || (t3.resumeScheduled = true, n2.nextTick(w, e2, t3));
          }
          function w(e2, t3) {
            x("resume", t3.reading), t3.reading || e2.read(0), t3.resumeScheduled = false, e2.emit("resume"), S(e2), t3.flowing && !t3.reading && e2.read(0);
          }
          function S(e2) {
            var t3 = e2._readableState;
            for (x("flow", t3.flowing); t3.flowing && e2.read() !== null; )
              ;
          }
          function T(e2, t3) {
            if (t3.length === 0)
              return null;
            var n3;
            return t3.objectMode ? n3 = t3.buffer.shift() : !e2 || e2 >= t3.length ? (n3 = t3.decoder ? t3.buffer.join("") : t3.buffer.length === 1 ? t3.buffer.first() : t3.buffer.concat(t3.length), t3.buffer.clear()) : n3 = t3.buffer.consume(e2, t3.decoder), n3;
          }
          function v(e2) {
            var t3 = e2._readableState;
            x("endReadable", t3.endEmitted), t3.endEmitted || (t3.ended = true, n2.nextTick(k, t3, e2));
          }
          function k(e2, t3) {
            if (x("endReadableNT", e2.endEmitted, e2.length), !e2.endEmitted && e2.length === 0 && (e2.endEmitted = true, t3.readable = false, t3.emit("end"), e2.autoDestroy)) {
              var n3 = t3._writableState;
              (!n3 || n3.autoDestroy && n3.finished) && t3.destroy();
            }
          }
          function L(e2, t3) {
            for (var n3 = 0, r3 = e2.length; n3 < r3; n3++)
              if (e2[n3] === t3)
                return n3;
            return -1;
          }
          t2.exports = s;
          var A;
          s.ReadableState = d;
          var x;
          e("events").EventEmitter;
          var D = function(e2, t3) {
            return e2.listeners(t3).length;
          }, I = e("./internal/streams/stream"), P = e("buffer").Buffer, M = r2.Uint8Array || function() {
          }, O = e("util");
          x = O && O.debuglog ? O.debuglog("stream") : function() {
          };
          var F, B, U, j = e("./internal/streams/buffer_list"), q = e("./internal/streams/destroy"), W = e("./internal/streams/state"), H = W.getHighWaterMark, Y = e("../errors").codes, V = Y.ERR_INVALID_ARG_TYPE, z = Y.ERR_STREAM_PUSH_AFTER_EOF, G = Y.ERR_METHOD_NOT_IMPLEMENTED, K = Y.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
          e("inherits")(s, I);
          var X = q.errorOrDestroy, $ = ["error", "close", "destroy", "pause", "resume"];
          Object.defineProperty(s.prototype, "destroyed", { enumerable: false, get: function() {
            return this._readableState !== void 0 && this._readableState.destroyed;
          }, set: function(e2) {
            this._readableState && (this._readableState.destroyed = e2);
          } }), s.prototype.destroy = q.destroy, s.prototype._undestroy = q.undestroy, s.prototype._destroy = function(e2, t3) {
            t3(e2);
          }, s.prototype.push = function(e2, t3) {
            var n3, r3 = this._readableState;
            return r3.objectMode ? n3 = true : typeof e2 == "string" && (t3 = t3 || r3.defaultEncoding, t3 !== r3.encoding && (e2 = P.from(e2, t3), t3 = ""), n3 = true), l(this, e2, t3, false, n3);
          }, s.prototype.unshift = function(e2) {
            return l(this, e2, null, true, false);
          }, s.prototype.isPaused = function() {
            return this._readableState.flowing === false;
          }, s.prototype.setEncoding = function(t3) {
            F || (F = e("string_decoder/").StringDecoder);
            var n3 = new F(t3);
            this._readableState.decoder = n3, this._readableState.encoding = this._readableState.decoder.encoding;
            for (var r3 = this._readableState.buffer.head, a2 = ""; r3 !== null; )
              a2 += n3.write(r3.data), r3 = r3.next;
            return this._readableState.buffer.clear(), a2 !== "" && this._readableState.buffer.push(a2), this._readableState.length = a2.length, this;
          };
          s.prototype.read = function(e2) {
            x("read", e2), e2 = parseInt(e2, 10);
            var t3 = this._readableState, r3 = e2;
            if (e2 !== 0 && (t3.emittedReadable = false), e2 === 0 && t3.needReadable && ((t3.highWaterMark === 0 ? 0 < t3.length : t3.length >= t3.highWaterMark) || t3.ended))
              return x("read: emitReadable", t3.length, t3.ended), t3.length === 0 && t3.ended ? v(this) : _(this), null;
            if (e2 = f(e2, t3), e2 === 0 && t3.ended)
              return t3.length === 0 && v(this), null;
            var a2 = t3.needReadable;
            x("need readable", a2), (t3.length === 0 || t3.length - e2 < t3.highWaterMark) && (a2 = true, x("length less than watermark", a2)), t3.ended || t3.reading ? (a2 = false, x("reading or ended", a2)) : a2 && (x("do read"), t3.reading = true, t3.sync = true, t3.length === 0 && (t3.needReadable = true), this._read(t3.highWaterMark), t3.sync = false, !t3.reading && (e2 = f(r3, t3)));
            var o2;
            return o2 = 0 < e2 ? T(e2, t3) : null, o2 === null ? (t3.needReadable = t3.length <= t3.highWaterMark, e2 = 0) : (t3.length -= e2, t3.awaitDrain = 0), t3.length === 0 && (!t3.ended && (t3.needReadable = true), r3 !== e2 && t3.ended && v(this)), o2 !== null && this.emit("data", o2), o2;
          }, s.prototype._read = function() {
            X(this, new G("_read()"));
          }, s.prototype.pipe = function(e2, t3) {
            function r3(e3, t4) {
              x("onunpipe"), e3 === p2 && t4 && t4.hasUnpiped === false && (t4.hasUnpiped = true, o2());
            }
            function a2() {
              x("onend"), e2.end();
            }
            function o2() {
              x("cleanup"), e2.removeListener("close", l2), e2.removeListener("finish", c2), e2.removeListener("drain", h2), e2.removeListener("error", s2), e2.removeListener("unpipe", r3), p2.removeListener("end", a2), p2.removeListener("end", u2), p2.removeListener("data", d2), m2 = true, f2.awaitDrain && (!e2._writableState || e2._writableState.needDrain) && h2();
            }
            function d2(t4) {
              x("ondata");
              var n3 = e2.write(t4);
              x("dest.write", n3), n3 === false && ((f2.pipesCount === 1 && f2.pipes === e2 || 1 < f2.pipesCount && L(f2.pipes, e2) !== -1) && !m2 && (x("false write response, pause", f2.awaitDrain), f2.awaitDrain++), p2.pause());
            }
            function s2(t4) {
              x("onerror", t4), u2(), e2.removeListener("error", s2), D(e2, "error") === 0 && X(e2, t4);
            }
            function l2() {
              e2.removeListener("finish", c2), u2();
            }
            function c2() {
              x("onfinish"), e2.removeListener("close", l2), u2();
            }
            function u2() {
              x("unpipe"), p2.unpipe(e2);
            }
            var p2 = this, f2 = this._readableState;
            switch (f2.pipesCount) {
              case 0:
                f2.pipes = e2;
                break;
              case 1:
                f2.pipes = [f2.pipes, e2];
                break;
              default:
                f2.pipes.push(e2);
            }
            f2.pipesCount += 1, x("pipe count=%d opts=%j", f2.pipesCount, t3);
            var g2 = (!t3 || t3.end !== false) && e2 !== n2.stdout && e2 !== n2.stderr, _2 = g2 ? a2 : u2;
            f2.endEmitted ? n2.nextTick(_2) : p2.once("end", _2), e2.on("unpipe", r3);
            var h2 = y(p2);
            e2.on("drain", h2);
            var m2 = false;
            return p2.on("data", d2), i(e2, "error", s2), e2.once("close", l2), e2.once("finish", c2), e2.emit("pipe", p2), f2.flowing || (x("pipe resume"), p2.resume()), e2;
          }, s.prototype.unpipe = function(e2) {
            var t3 = this._readableState, n3 = { hasUnpiped: false };
            if (t3.pipesCount === 0)
              return this;
            if (t3.pipesCount === 1)
              return e2 && e2 !== t3.pipes ? this : (e2 || (e2 = t3.pipes), t3.pipes = null, t3.pipesCount = 0, t3.flowing = false, e2 && e2.emit("unpipe", this, n3), this);
            if (!e2) {
              var r3 = t3.pipes, a2 = t3.pipesCount;
              t3.pipes = null, t3.pipesCount = 0, t3.flowing = false;
              for (var o2 = 0; o2 < a2; o2++)
                r3[o2].emit("unpipe", this, { hasUnpiped: false });
              return this;
            }
            var d2 = L(t3.pipes, e2);
            return d2 === -1 ? this : (t3.pipes.splice(d2, 1), t3.pipesCount -= 1, t3.pipesCount === 1 && (t3.pipes = t3.pipes[0]), e2.emit("unpipe", this, n3), this);
          }, s.prototype.on = function(e2, t3) {
            var r3 = I.prototype.on.call(this, e2, t3), a2 = this._readableState;
            return e2 === "data" ? (a2.readableListening = 0 < this.listenerCount("readable"), a2.flowing !== false && this.resume()) : e2 == "readable" && !a2.endEmitted && !a2.readableListening && (a2.readableListening = a2.needReadable = true, a2.flowing = false, a2.emittedReadable = false, x("on readable", a2.length, a2.reading), a2.length ? _(this) : !a2.reading && n2.nextTick(R, this)), r3;
          }, s.prototype.addListener = s.prototype.on, s.prototype.removeListener = function(e2, t3) {
            var r3 = I.prototype.removeListener.call(this, e2, t3);
            return e2 === "readable" && n2.nextTick(C, this), r3;
          }, s.prototype.removeAllListeners = function(e2) {
            var t3 = I.prototype.removeAllListeners.apply(this, arguments);
            return (e2 === "readable" || e2 === void 0) && n2.nextTick(C, this), t3;
          }, s.prototype.resume = function() {
            var e2 = this._readableState;
            return e2.flowing || (x("resume"), e2.flowing = !e2.readableListening, E(this, e2)), e2.paused = false, this;
          }, s.prototype.pause = function() {
            return x("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== false && (x("pause"), this._readableState.flowing = false, this.emit("pause")), this._readableState.paused = true, this;
          }, s.prototype.wrap = function(e2) {
            var t3 = this, r3 = this._readableState, a2 = false;
            for (var o2 in e2.on("end", function() {
              if (x("wrapped end"), r3.decoder && !r3.ended) {
                var e3 = r3.decoder.end();
                e3 && e3.length && t3.push(e3);
              }
              t3.push(null);
            }), e2.on("data", function(n3) {
              if ((x("wrapped data"), r3.decoder && (n3 = r3.decoder.write(n3)), !(r3.objectMode && (n3 === null || n3 === void 0))) && (r3.objectMode || n3 && n3.length)) {
                var o3 = t3.push(n3);
                o3 || (a2 = true, e2.pause());
              }
            }), e2)
              this[o2] === void 0 && typeof e2[o2] == "function" && (this[o2] = function(t4) {
                return function() {
                  return e2[t4].apply(e2, arguments);
                };
              }(o2));
            for (var i2 = 0; i2 < $.length; i2++)
              e2.on($[i2], this.emit.bind(this, $[i2]));
            return this._read = function(t4) {
              x("wrapped _read", t4), a2 && (a2 = false, e2.resume());
            }, this;
          }, typeof Symbol == "function" && (s.prototype[Symbol.asyncIterator] = function() {
            return B === void 0 && (B = e("./internal/streams/async_iterator")), B(this);
          }), Object.defineProperty(s.prototype, "readableHighWaterMark", { enumerable: false, get: function() {
            return this._readableState.highWaterMark;
          } }), Object.defineProperty(s.prototype, "readableBuffer", { enumerable: false, get: function() {
            return this._readableState && this._readableState.buffer;
          } }), Object.defineProperty(s.prototype, "readableFlowing", { enumerable: false, get: function() {
            return this._readableState.flowing;
          }, set: function(e2) {
            this._readableState && (this._readableState.flowing = e2);
          } }), s._fromList = T, Object.defineProperty(s.prototype, "readableLength", { enumerable: false, get: function() {
            return this._readableState.length;
          } }), typeof Symbol == "function" && (s.from = function(t3, n3) {
            return U === void 0 && (U = e("./internal/streams/from")), U(s, t3, n3);
          });
        }).call(this);
      }).call(this, e("_process"), typeof commonjsGlobal == "undefined" ? typeof self == "undefined" ? typeof window == "undefined" ? {} : window : self : commonjsGlobal);
    }, { "../errors": 15, "./_stream_duplex": 16, "./internal/streams/async_iterator": 21, "./internal/streams/buffer_list": 22, "./internal/streams/destroy": 23, "./internal/streams/from": 25, "./internal/streams/state": 27, "./internal/streams/stream": 28, _process: 12, buffer: 3, events: 7, inherits: 10, "string_decoder/": 31, util: 2 }], 19: [function(e, t2) {
      function n2(e2, t3) {
        var n3 = this._transformState;
        n3.transforming = false;
        var r3 = n3.writecb;
        if (r3 === null)
          return this.emit("error", new s());
        n3.writechunk = null, n3.writecb = null, t3 != null && this.push(t3), r3(e2);
        var a2 = this._readableState;
        a2.reading = false, (a2.needReadable || a2.length < a2.highWaterMark) && this._read(a2.highWaterMark);
      }
      function r2(e2) {
        return this instanceof r2 ? void (u.call(this, e2), this._transformState = { afterTransform: n2.bind(this), needTransform: false, transforming: false, writecb: null, writechunk: null, writeencoding: null }, this._readableState.needReadable = true, this._readableState.sync = false, e2 && (typeof e2.transform == "function" && (this._transform = e2.transform), typeof e2.flush == "function" && (this._flush = e2.flush)), this.on("prefinish", a)) : new r2(e2);
      }
      function a() {
        var e2 = this;
        typeof this._flush != "function" || this._readableState.destroyed ? o(this, null, null) : this._flush(function(t3, n3) {
          o(e2, t3, n3);
        });
      }
      function o(e2, t3, n3) {
        if (t3)
          return e2.emit("error", t3);
        if (n3 != null && e2.push(n3), e2._writableState.length)
          throw new c();
        if (e2._transformState.transforming)
          throw new l();
        return e2.push(null);
      }
      t2.exports = r2;
      var i = e("../errors").codes, d = i.ERR_METHOD_NOT_IMPLEMENTED, s = i.ERR_MULTIPLE_CALLBACK, l = i.ERR_TRANSFORM_ALREADY_TRANSFORMING, c = i.ERR_TRANSFORM_WITH_LENGTH_0, u = e("./_stream_duplex");
      e("inherits")(r2, u), r2.prototype.push = function(e2, t3) {
        return this._transformState.needTransform = false, u.prototype.push.call(this, e2, t3);
      }, r2.prototype._transform = function(e2, t3, n3) {
        n3(new d("_transform()"));
      }, r2.prototype._write = function(e2, t3, n3) {
        var r3 = this._transformState;
        if (r3.writecb = n3, r3.writechunk = e2, r3.writeencoding = t3, !r3.transforming) {
          var a2 = this._readableState;
          (r3.needTransform || a2.needReadable || a2.length < a2.highWaterMark) && this._read(a2.highWaterMark);
        }
      }, r2.prototype._read = function() {
        var e2 = this._transformState;
        e2.writechunk === null || e2.transforming ? e2.needTransform = true : (e2.transforming = true, this._transform(e2.writechunk, e2.writeencoding, e2.afterTransform));
      }, r2.prototype._destroy = function(e2, t3) {
        u.prototype._destroy.call(this, e2, function(e3) {
          t3(e3);
        });
      };
    }, { "../errors": 15, "./_stream_duplex": 16, inherits: 10 }], 20: [function(e, t2) {
      (function(n2, r2) {
        (function() {
          function a(e2) {
            var t3 = this;
            this.next = null, this.entry = null, this.finish = function() {
              v(t3, e2);
            };
          }
          function o(e2) {
            return x.from(e2);
          }
          function i(e2) {
            return x.isBuffer(e2) || e2 instanceof N;
          }
          function d() {
          }
          function s(t3, n3, r3) {
            k = k || e("./_stream_duplex"), t3 = t3 || {}, typeof r3 != "boolean" && (r3 = n3 instanceof k), this.objectMode = !!t3.objectMode, r3 && (this.objectMode = this.objectMode || !!t3.writableObjectMode), this.highWaterMark = P(this, t3, "writableHighWaterMark", r3), this.finalCalled = false, this.needDrain = false, this.ending = false, this.ended = false, this.finished = false, this.destroyed = false;
            var o2 = t3.decodeStrings === false;
            this.decodeStrings = !o2, this.defaultEncoding = t3.defaultEncoding || "utf8", this.length = 0, this.writing = false, this.corked = 0, this.sync = true, this.bufferProcessing = false, this.onwrite = function(e2) {
              m(n3, e2);
            }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = false, this.errorEmitted = false, this.emitClose = t3.emitClose !== false, this.autoDestroy = !!t3.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new a(this);
          }
          function l(t3) {
            k = k || e("./_stream_duplex");
            var n3 = this instanceof k;
            return n3 || V.call(l, this) ? void (this._writableState = new s(t3, this, n3), this.writable = true, t3 && (typeof t3.write == "function" && (this._write = t3.write), typeof t3.writev == "function" && (this._writev = t3.writev), typeof t3.destroy == "function" && (this._destroy = t3.destroy), typeof t3.final == "function" && (this._final = t3.final)), A.call(this)) : new l(t3);
          }
          function c(e2, t3) {
            var r3 = new W();
            Y(e2, r3), n2.nextTick(t3, r3);
          }
          function u(e2, t3, r3, a2) {
            var o2;
            return r3 === null ? o2 = new q() : typeof r3 != "string" && !t3.objectMode && (o2 = new O("chunk", ["string", "Buffer"], r3)), !o2 || (Y(e2, o2), n2.nextTick(a2, o2), false);
          }
          function p(e2, t3, n3) {
            return e2.objectMode || e2.decodeStrings === false || typeof t3 != "string" || (t3 = x.from(t3, n3)), t3;
          }
          function f(e2, t3, n3, r3, a2, o2) {
            if (!n3) {
              var i2 = p(t3, r3, a2);
              r3 !== i2 && (n3 = true, a2 = "buffer", r3 = i2);
            }
            var d2 = t3.objectMode ? 1 : r3.length;
            t3.length += d2;
            var s2 = t3.length < t3.highWaterMark;
            if (s2 || (t3.needDrain = true), t3.writing || t3.corked) {
              var l2 = t3.lastBufferedRequest;
              t3.lastBufferedRequest = { chunk: r3, encoding: a2, isBuf: n3, callback: o2, next: null }, l2 ? l2.next = t3.lastBufferedRequest : t3.bufferedRequest = t3.lastBufferedRequest, t3.bufferedRequestCount += 1;
            } else
              g(e2, t3, false, d2, r3, a2, o2);
            return s2;
          }
          function g(e2, t3, n3, r3, a2, o2, i2) {
            t3.writelen = r3, t3.writecb = i2, t3.writing = true, t3.sync = true, t3.destroyed ? t3.onwrite(new j("write")) : n3 ? e2._writev(a2, t3.onwrite) : e2._write(a2, o2, t3.onwrite), t3.sync = false;
          }
          function _(e2, t3, r3, a2, o2) {
            --t3.pendingcb, r3 ? (n2.nextTick(o2, a2), n2.nextTick(S, e2, t3), e2._writableState.errorEmitted = true, Y(e2, a2)) : (o2(a2), e2._writableState.errorEmitted = true, Y(e2, a2), S(e2, t3));
          }
          function h(e2) {
            e2.writing = false, e2.writecb = null, e2.length -= e2.writelen, e2.writelen = 0;
          }
          function m(e2, t3) {
            var r3 = e2._writableState, a2 = r3.sync, o2 = r3.writecb;
            if (typeof o2 != "function")
              throw new B();
            if (h(r3), t3)
              _(e2, r3, a2, t3, o2);
            else {
              var i2 = R(r3) || e2.destroyed;
              i2 || r3.corked || r3.bufferProcessing || !r3.bufferedRequest || C(e2, r3), a2 ? n2.nextTick(b, e2, r3, i2, o2) : b(e2, r3, i2, o2);
            }
          }
          function b(e2, t3, n3, r3) {
            n3 || y(e2, t3), t3.pendingcb--, r3(), S(e2, t3);
          }
          function y(e2, t3) {
            t3.length === 0 && t3.needDrain && (t3.needDrain = false, e2.emit("drain"));
          }
          function C(e2, t3) {
            t3.bufferProcessing = true;
            var n3 = t3.bufferedRequest;
            if (e2._writev && n3 && n3.next) {
              var r3 = t3.bufferedRequestCount, o2 = Array(r3), i2 = t3.corkedRequestsFree;
              i2.entry = n3;
              for (var d2 = 0, s2 = true; n3; )
                o2[d2] = n3, n3.isBuf || (s2 = false), n3 = n3.next, d2 += 1;
              o2.allBuffers = s2, g(e2, t3, true, t3.length, o2, "", i2.finish), t3.pendingcb++, t3.lastBufferedRequest = null, i2.next ? (t3.corkedRequestsFree = i2.next, i2.next = null) : t3.corkedRequestsFree = new a(t3), t3.bufferedRequestCount = 0;
            } else {
              for (; n3; ) {
                var l2 = n3.chunk, c2 = n3.encoding, u2 = n3.callback, p2 = t3.objectMode ? 1 : l2.length;
                if (g(e2, t3, false, p2, l2, c2, u2), n3 = n3.next, t3.bufferedRequestCount--, t3.writing)
                  break;
              }
              n3 === null && (t3.lastBufferedRequest = null);
            }
            t3.bufferedRequest = n3, t3.bufferProcessing = false;
          }
          function R(e2) {
            return e2.ending && e2.length === 0 && e2.bufferedRequest === null && !e2.finished && !e2.writing;
          }
          function E(e2, t3) {
            e2._final(function(n3) {
              t3.pendingcb--, n3 && Y(e2, n3), t3.prefinished = true, e2.emit("prefinish"), S(e2, t3);
            });
          }
          function w(e2, t3) {
            t3.prefinished || t3.finalCalled || (typeof e2._final != "function" || t3.destroyed ? (t3.prefinished = true, e2.emit("prefinish")) : (t3.pendingcb++, t3.finalCalled = true, n2.nextTick(E, e2, t3)));
          }
          function S(e2, t3) {
            var n3 = R(t3);
            if (n3 && (w(e2, t3), t3.pendingcb === 0 && (t3.finished = true, e2.emit("finish"), t3.autoDestroy))) {
              var r3 = e2._readableState;
              (!r3 || r3.autoDestroy && r3.endEmitted) && e2.destroy();
            }
            return n3;
          }
          function T(e2, t3, r3) {
            t3.ending = true, S(e2, t3), r3 && (t3.finished ? n2.nextTick(r3) : e2.once("finish", r3)), t3.ended = true, e2.writable = false;
          }
          function v(e2, t3, n3) {
            var r3 = e2.entry;
            for (e2.entry = null; r3; ) {
              var a2 = r3.callback;
              t3.pendingcb--, a2(n3), r3 = r3.next;
            }
            t3.corkedRequestsFree.next = e2;
          }
          t2.exports = l;
          var k;
          l.WritableState = s;
          var L = { deprecate: e("util-deprecate") }, A = e("./internal/streams/stream"), x = e("buffer").Buffer, N = r2.Uint8Array || function() {
          }, D = e("./internal/streams/destroy"), I = e("./internal/streams/state"), P = I.getHighWaterMark, M = e("../errors").codes, O = M.ERR_INVALID_ARG_TYPE, F = M.ERR_METHOD_NOT_IMPLEMENTED, B = M.ERR_MULTIPLE_CALLBACK, U = M.ERR_STREAM_CANNOT_PIPE, j = M.ERR_STREAM_DESTROYED, q = M.ERR_STREAM_NULL_VALUES, W = M.ERR_STREAM_WRITE_AFTER_END, H = M.ERR_UNKNOWN_ENCODING, Y = D.errorOrDestroy;
          e("inherits")(l, A), s.prototype.getBuffer = function() {
            for (var e2 = this.bufferedRequest, t3 = []; e2; )
              t3.push(e2), e2 = e2.next;
            return t3;
          }, function() {
            try {
              Object.defineProperty(s.prototype, "buffer", { get: L.deprecate(function() {
                return this.getBuffer();
              }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003") });
            } catch (e2) {
            }
          }();
          var V;
          typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (V = Function.prototype[Symbol.hasInstance], Object.defineProperty(l, Symbol.hasInstance, { value: function(e2) {
            return !!V.call(this, e2) || !(this !== l) && e2 && e2._writableState instanceof s;
          } })) : V = function(e2) {
            return e2 instanceof this;
          }, l.prototype.pipe = function() {
            Y(this, new U());
          }, l.prototype.write = function(e2, t3, n3) {
            var r3 = this._writableState, a2 = false, s2 = !r3.objectMode && i(e2);
            return s2 && !x.isBuffer(e2) && (e2 = o(e2)), typeof t3 == "function" && (n3 = t3, t3 = null), s2 ? t3 = "buffer" : !t3 && (t3 = r3.defaultEncoding), typeof n3 != "function" && (n3 = d), r3.ending ? c(this, n3) : (s2 || u(this, r3, e2, n3)) && (r3.pendingcb++, a2 = f(this, r3, s2, e2, t3, n3)), a2;
          }, l.prototype.cork = function() {
            this._writableState.corked++;
          }, l.prototype.uncork = function() {
            var e2 = this._writableState;
            e2.corked && (e2.corked--, !e2.writing && !e2.corked && !e2.bufferProcessing && e2.bufferedRequest && C(this, e2));
          }, l.prototype.setDefaultEncoding = function(e2) {
            if (typeof e2 == "string" && (e2 = e2.toLowerCase()), !(-1 < ["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e2 + "").toLowerCase())))
              throw new H(e2);
            return this._writableState.defaultEncoding = e2, this;
          }, Object.defineProperty(l.prototype, "writableBuffer", { enumerable: false, get: function() {
            return this._writableState && this._writableState.getBuffer();
          } }), Object.defineProperty(l.prototype, "writableHighWaterMark", { enumerable: false, get: function() {
            return this._writableState.highWaterMark;
          } }), l.prototype._write = function(e2, t3, n3) {
            n3(new F("_write()"));
          }, l.prototype._writev = null, l.prototype.end = function(e2, t3, n3) {
            var r3 = this._writableState;
            return typeof e2 == "function" ? (n3 = e2, e2 = null, t3 = null) : typeof t3 == "function" && (n3 = t3, t3 = null), e2 !== null && e2 !== void 0 && this.write(e2, t3), r3.corked && (r3.corked = 1, this.uncork()), r3.ending || T(this, r3, n3), this;
          }, Object.defineProperty(l.prototype, "writableLength", { enumerable: false, get: function() {
            return this._writableState.length;
          } }), Object.defineProperty(l.prototype, "destroyed", { enumerable: false, get: function() {
            return this._writableState !== void 0 && this._writableState.destroyed;
          }, set: function(e2) {
            this._writableState && (this._writableState.destroyed = e2);
          } }), l.prototype.destroy = D.destroy, l.prototype._undestroy = D.undestroy, l.prototype._destroy = function(e2, t3) {
            t3(e2);
          };
        }).call(this);
      }).call(this, e("_process"), typeof commonjsGlobal == "undefined" ? typeof self == "undefined" ? typeof window == "undefined" ? {} : window : self : commonjsGlobal);
    }, { "../errors": 15, "./_stream_duplex": 16, "./internal/streams/destroy": 23, "./internal/streams/state": 27, "./internal/streams/stream": 28, _process: 12, buffer: 3, inherits: 10, "util-deprecate": 32 }], 21: [function(e, t2) {
      (function(n2) {
        (function() {
          function r2(e2, t3, n3) {
            return t3 in e2 ? Object.defineProperty(e2, t3, { value: n3, enumerable: true, configurable: true, writable: true }) : e2[t3] = n3, e2;
          }
          function a(e2, t3) {
            return { value: e2, done: t3 };
          }
          function o(e2) {
            var t3 = e2[c];
            if (t3 !== null) {
              var n3 = e2[h].read();
              n3 !== null && (e2[g] = null, e2[c] = null, e2[u] = null, t3(a(n3, false)));
            }
          }
          function i(e2) {
            n2.nextTick(o, e2);
          }
          function d(e2, t3) {
            return function(n3, r3) {
              e2.then(function() {
                return t3[f] ? void n3(a(void 0, true)) : void t3[_](n3, r3);
              }, r3);
            };
          }
          var s, l = e("./end-of-stream"), c = Symbol("lastResolve"), u = Symbol("lastReject"), p = Symbol("error"), f = Symbol("ended"), g = Symbol("lastPromise"), _ = Symbol("handlePromise"), h = Symbol("stream"), m = Object.getPrototypeOf(function() {
          }), b = Object.setPrototypeOf((s = { get stream() {
            return this[h];
          }, next: function() {
            var e2 = this, t3 = this[p];
            if (t3 !== null)
              return Promise.reject(t3);
            if (this[f])
              return Promise.resolve(a(void 0, true));
            if (this[h].destroyed)
              return new Promise(function(t4, r4) {
                n2.nextTick(function() {
                  e2[p] ? r4(e2[p]) : t4(a(void 0, true));
                });
              });
            var r3, o2 = this[g];
            if (o2)
              r3 = new Promise(d(o2, this));
            else {
              var i2 = this[h].read();
              if (i2 !== null)
                return Promise.resolve(a(i2, false));
              r3 = new Promise(this[_]);
            }
            return this[g] = r3, r3;
          } }, r2(s, Symbol.asyncIterator, function() {
            return this;
          }), r2(s, "return", function() {
            var e2 = this;
            return new Promise(function(t3, n3) {
              e2[h].destroy(null, function(e3) {
                return e3 ? void n3(e3) : void t3(a(void 0, true));
              });
            });
          }), s), m);
          t2.exports = function(e2) {
            var t3, n3 = Object.create(b, (t3 = {}, r2(t3, h, { value: e2, writable: true }), r2(t3, c, { value: null, writable: true }), r2(t3, u, { value: null, writable: true }), r2(t3, p, { value: null, writable: true }), r2(t3, f, { value: e2._readableState.endEmitted, writable: true }), r2(t3, _, { value: function(e3, t4) {
              var r3 = n3[h].read();
              r3 ? (n3[g] = null, n3[c] = null, n3[u] = null, e3(a(r3, false))) : (n3[c] = e3, n3[u] = t4);
            }, writable: true }), t3));
            return n3[g] = null, l(e2, function(e3) {
              if (e3 && e3.code !== "ERR_STREAM_PREMATURE_CLOSE") {
                var t4 = n3[u];
                return t4 !== null && (n3[g] = null, n3[c] = null, n3[u] = null, t4(e3)), void (n3[p] = e3);
              }
              var r3 = n3[c];
              r3 !== null && (n3[g] = null, n3[c] = null, n3[u] = null, r3(a(void 0, true))), n3[f] = true;
            }), e2.on("readable", i.bind(null, n3)), n3;
          };
        }).call(this);
      }).call(this, e("_process"));
    }, { "./end-of-stream": 24, _process: 12 }], 22: [function(e, t2) {
      function n2(e2, t3) {
        var n3 = Object.keys(e2);
        if (Object.getOwnPropertySymbols) {
          var r3 = Object.getOwnPropertySymbols(e2);
          t3 && (r3 = r3.filter(function(t4) {
            return Object.getOwnPropertyDescriptor(e2, t4).enumerable;
          })), n3.push.apply(n3, r3);
        }
        return n3;
      }
      function r2(e2) {
        for (var t3, r3 = 1; r3 < arguments.length; r3++)
          t3 = arguments[r3] == null ? {} : arguments[r3], r3 % 2 ? n2(Object(t3), true).forEach(function(n3) {
            a(e2, n3, t3[n3]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t3)) : n2(Object(t3)).forEach(function(n3) {
            Object.defineProperty(e2, n3, Object.getOwnPropertyDescriptor(t3, n3));
          });
        return e2;
      }
      function a(e2, t3, n3) {
        return t3 in e2 ? Object.defineProperty(e2, t3, { value: n3, enumerable: true, configurable: true, writable: true }) : e2[t3] = n3, e2;
      }
      function o(e2, t3) {
        if (!(e2 instanceof t3))
          throw new TypeError("Cannot call a class as a function");
      }
      function i(e2, t3) {
        for (var n3, r3 = 0; r3 < t3.length; r3++)
          n3 = t3[r3], n3.enumerable = n3.enumerable || false, n3.configurable = true, "value" in n3 && (n3.writable = true), Object.defineProperty(e2, n3.key, n3);
      }
      function d(e2, t3, n3) {
        return t3 && i(e2.prototype, t3), n3 && i(e2, n3), e2;
      }
      function s(e2, t3, n3) {
        u.prototype.copy.call(e2, t3, n3);
      }
      var l = e("buffer"), u = l.Buffer, p = e("util"), f = p.inspect, g = f && f.custom || "inspect";
      t2.exports = function() {
        function e2() {
          o(this, e2), this.head = null, this.tail = null, this.length = 0;
        }
        return d(e2, [{ key: "push", value: function(e3) {
          var t3 = { data: e3, next: null };
          0 < this.length ? this.tail.next = t3 : this.head = t3, this.tail = t3, ++this.length;
        } }, { key: "unshift", value: function(e3) {
          var t3 = { data: e3, next: this.head };
          this.length === 0 && (this.tail = t3), this.head = t3, ++this.length;
        } }, { key: "shift", value: function() {
          if (this.length !== 0) {
            var e3 = this.head.data;
            return this.head = this.length === 1 ? this.tail = null : this.head.next, --this.length, e3;
          }
        } }, { key: "clear", value: function() {
          this.head = this.tail = null, this.length = 0;
        } }, { key: "join", value: function(e3) {
          if (this.length === 0)
            return "";
          for (var t3 = this.head, n3 = "" + t3.data; t3 = t3.next; )
            n3 += e3 + t3.data;
          return n3;
        } }, { key: "concat", value: function(e3) {
          if (this.length === 0)
            return u.alloc(0);
          for (var t3 = u.allocUnsafe(e3 >>> 0), n3 = this.head, r3 = 0; n3; )
            s(n3.data, t3, r3), r3 += n3.data.length, n3 = n3.next;
          return t3;
        } }, { key: "consume", value: function(e3, t3) {
          var n3;
          return e3 < this.head.data.length ? (n3 = this.head.data.slice(0, e3), this.head.data = this.head.data.slice(e3)) : e3 === this.head.data.length ? n3 = this.shift() : n3 = t3 ? this._getString(e3) : this._getBuffer(e3), n3;
        } }, { key: "first", value: function() {
          return this.head.data;
        } }, { key: "_getString", value: function(e3) {
          var t3 = this.head, r3 = 1, a2 = t3.data;
          for (e3 -= a2.length; t3 = t3.next; ) {
            var o2 = t3.data, i2 = e3 > o2.length ? o2.length : e3;
            if (a2 += i2 === o2.length ? o2 : o2.slice(0, e3), e3 -= i2, e3 === 0) {
              i2 === o2.length ? (++r3, this.head = t3.next ? t3.next : this.tail = null) : (this.head = t3, t3.data = o2.slice(i2));
              break;
            }
            ++r3;
          }
          return this.length -= r3, a2;
        } }, { key: "_getBuffer", value: function(e3) {
          var t3 = u.allocUnsafe(e3), r3 = this.head, a2 = 1;
          for (r3.data.copy(t3), e3 -= r3.data.length; r3 = r3.next; ) {
            var o2 = r3.data, i2 = e3 > o2.length ? o2.length : e3;
            if (o2.copy(t3, t3.length - e3, 0, i2), e3 -= i2, e3 === 0) {
              i2 === o2.length ? (++a2, this.head = r3.next ? r3.next : this.tail = null) : (this.head = r3, r3.data = o2.slice(i2));
              break;
            }
            ++a2;
          }
          return this.length -= a2, t3;
        } }, { key: g, value: function(e3, t3) {
          return f(this, r2({}, t3, { depth: 0, customInspect: false }));
        } }]), e2;
      }();
    }, { buffer: 3, util: 2 }], 23: [function(e, t2) {
      (function(e2) {
        (function() {
          function n2(e3, t3) {
            a(e3, t3), r2(e3);
          }
          function r2(e3) {
            e3._writableState && !e3._writableState.emitClose || e3._readableState && !e3._readableState.emitClose || e3.emit("close");
          }
          function a(e3, t3) {
            e3.emit("error", t3);
          }
          t2.exports = { destroy: function(t3, o) {
            var i = this, d = this._readableState && this._readableState.destroyed, s = this._writableState && this._writableState.destroyed;
            return d || s ? (o ? o(t3) : t3 && (this._writableState ? !this._writableState.errorEmitted && (this._writableState.errorEmitted = true, e2.nextTick(a, this, t3)) : e2.nextTick(a, this, t3)), this) : (this._readableState && (this._readableState.destroyed = true), this._writableState && (this._writableState.destroyed = true), this._destroy(t3 || null, function(t4) {
              !o && t4 ? i._writableState ? i._writableState.errorEmitted ? e2.nextTick(r2, i) : (i._writableState.errorEmitted = true, e2.nextTick(n2, i, t4)) : e2.nextTick(n2, i, t4) : o ? (e2.nextTick(r2, i), o(t4)) : e2.nextTick(r2, i);
            }), this);
          }, undestroy: function() {
            this._readableState && (this._readableState.destroyed = false, this._readableState.reading = false, this._readableState.ended = false, this._readableState.endEmitted = false), this._writableState && (this._writableState.destroyed = false, this._writableState.ended = false, this._writableState.ending = false, this._writableState.finalCalled = false, this._writableState.prefinished = false, this._writableState.finished = false, this._writableState.errorEmitted = false);
          }, errorOrDestroy: function(e3, t3) {
            var n3 = e3._readableState, r3 = e3._writableState;
            n3 && n3.autoDestroy || r3 && r3.autoDestroy ? e3.destroy(t3) : e3.emit("error", t3);
          } };
        }).call(this);
      }).call(this, e("_process"));
    }, { _process: 12 }], 24: [function(e, t2) {
      function n2(e2) {
        var t3 = false;
        return function() {
          if (!t3) {
            t3 = true;
            for (var n3 = arguments.length, r3 = Array(n3), a2 = 0; a2 < n3; a2++)
              r3[a2] = arguments[a2];
            e2.apply(this, r3);
          }
        };
      }
      function r2() {
      }
      function a(e2) {
        return e2.setHeader && typeof e2.abort == "function";
      }
      function o(e2, t3, d) {
        if (typeof t3 == "function")
          return o(e2, null, t3);
        t3 || (t3 = {}), d = n2(d || r2);
        var s = t3.readable || t3.readable !== false && e2.readable, l = t3.writable || t3.writable !== false && e2.writable, c = function() {
          e2.writable || p();
        }, u = e2._writableState && e2._writableState.finished, p = function() {
          l = false, u = true, s || d.call(e2);
        }, f = e2._readableState && e2._readableState.endEmitted, g = function() {
          s = false, f = true, l || d.call(e2);
        }, _ = function(t4) {
          d.call(e2, t4);
        }, h = function() {
          var t4;
          return s && !f ? (e2._readableState && e2._readableState.ended || (t4 = new i()), d.call(e2, t4)) : l && !u ? (e2._writableState && e2._writableState.ended || (t4 = new i()), d.call(e2, t4)) : void 0;
        }, m = function() {
          e2.req.on("finish", p);
        };
        return a(e2) ? (e2.on("complete", p), e2.on("abort", h), e2.req ? m() : e2.on("request", m)) : l && !e2._writableState && (e2.on("end", c), e2.on("close", c)), e2.on("end", g), e2.on("finish", p), t3.error !== false && e2.on("error", _), e2.on("close", h), function() {
          e2.removeListener("complete", p), e2.removeListener("abort", h), e2.removeListener("request", m), e2.req && e2.req.removeListener("finish", p), e2.removeListener("end", c), e2.removeListener("close", c), e2.removeListener("finish", p), e2.removeListener("end", g), e2.removeListener("error", _), e2.removeListener("close", h);
        };
      }
      var i = e("../../../errors").codes.ERR_STREAM_PREMATURE_CLOSE;
      t2.exports = o;
    }, { "../../../errors": 15 }], 25: [function(e, t2) {
      t2.exports = function() {
        throw new Error("Readable.from is not available in the browser");
      };
    }, {}], 26: [function(e, t2) {
      function n2(e2) {
        var t3 = false;
        return function() {
          t3 || (t3 = true, e2.apply(void 0, arguments));
        };
      }
      function r2(e2) {
        if (e2)
          throw e2;
      }
      function a(e2) {
        return e2.setHeader && typeof e2.abort == "function";
      }
      function o(t3, r3, o2, i2) {
        i2 = n2(i2);
        var d2 = false;
        t3.on("close", function() {
          d2 = true;
        }), l === void 0 && (l = e("./end-of-stream")), l(t3, { readable: r3, writable: o2 }, function(e2) {
          return e2 ? i2(e2) : void (d2 = true, i2());
        });
        var s2 = false;
        return function(e2) {
          if (!d2)
            return s2 ? void 0 : (s2 = true, a(t3) ? t3.abort() : typeof t3.destroy == "function" ? t3.destroy() : void i2(e2 || new p("pipe")));
        };
      }
      function i(e2) {
        e2();
      }
      function d(e2, t3) {
        return e2.pipe(t3);
      }
      function s(e2) {
        return e2.length ? typeof e2[e2.length - 1] == "function" ? e2.pop() : r2 : r2;
      }
      var l, c = e("../../../errors").codes, u = c.ERR_MISSING_ARGS, p = c.ERR_STREAM_DESTROYED;
      t2.exports = function() {
        for (var e2 = arguments.length, t3 = Array(e2), n3 = 0; n3 < e2; n3++)
          t3[n3] = arguments[n3];
        var r3 = s(t3);
        if (Array.isArray(t3[0]) && (t3 = t3[0]), 2 > t3.length)
          throw new u("streams");
        var a2, l2 = t3.map(function(e3, n4) {
          var d2 = n4 < t3.length - 1;
          return o(e3, d2, 0 < n4, function(e4) {
            a2 || (a2 = e4), e4 && l2.forEach(i), d2 || (l2.forEach(i), r3(a2));
          });
        });
        return t3.reduce(d);
      };
    }, { "../../../errors": 15, "./end-of-stream": 24 }], 27: [function(e, n2) {
      function r2(e2, t2, n3) {
        return e2.highWaterMark == null ? t2 ? e2[n3] : null : e2.highWaterMark;
      }
      var a = e("../../../errors").codes.ERR_INVALID_OPT_VALUE;
      n2.exports = { getHighWaterMark: function(e2, n3, o, i) {
        var d = r2(n3, i, o);
        if (d != null) {
          if (!(isFinite(d) && t(d) === d) || 0 > d) {
            var s = i ? o : "highWaterMark";
            throw new a(s, d);
          }
          return t(d);
        }
        return e2.objectMode ? 16 : 16384;
      } };
    }, { "../../../errors": 15 }], 28: [function(e, t2) {
      t2.exports = e("events").EventEmitter;
    }, { events: 7 }], 29: [function(e, t2, n2) {
      n2 = t2.exports = e("./lib/_stream_readable.js"), n2.Stream = n2, n2.Readable = n2, n2.Writable = e("./lib/_stream_writable.js"), n2.Duplex = e("./lib/_stream_duplex.js"), n2.Transform = e("./lib/_stream_transform.js"), n2.PassThrough = e("./lib/_stream_passthrough.js"), n2.finished = e("./lib/internal/streams/end-of-stream.js"), n2.pipeline = e("./lib/internal/streams/pipeline.js");
    }, { "./lib/_stream_duplex.js": 16, "./lib/_stream_passthrough.js": 17, "./lib/_stream_readable.js": 18, "./lib/_stream_transform.js": 19, "./lib/_stream_writable.js": 20, "./lib/internal/streams/end-of-stream.js": 24, "./lib/internal/streams/pipeline.js": 26 }], 30: [function(e, t2, n2) {
      function r2(e2, t3) {
        for (var n3 in e2)
          t3[n3] = e2[n3];
      }
      function a(e2, t3, n3) {
        return i(e2, t3, n3);
      }
      /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
      var o = e("buffer"), i = o.Buffer;
      i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? t2.exports = o : (r2(o, n2), n2.Buffer = a), a.prototype = Object.create(i.prototype), r2(i, a), a.from = function(e2, t3, n3) {
        if (typeof e2 == "number")
          throw new TypeError("Argument must not be a number");
        return i(e2, t3, n3);
      }, a.alloc = function(e2, t3, n3) {
        if (typeof e2 != "number")
          throw new TypeError("Argument must be a number");
        var r3 = i(e2);
        return t3 === void 0 ? r3.fill(0) : typeof n3 == "string" ? r3.fill(t3, n3) : r3.fill(t3), r3;
      }, a.allocUnsafe = function(e2) {
        if (typeof e2 != "number")
          throw new TypeError("Argument must be a number");
        return i(e2);
      }, a.allocUnsafeSlow = function(e2) {
        if (typeof e2 != "number")
          throw new TypeError("Argument must be a number");
        return o.SlowBuffer(e2);
      };
    }, { buffer: 3 }], 31: [function(e, t2, n2) {
      function r2(e2) {
        if (!e2)
          return "utf8";
        for (var t3; ; )
          switch (e2) {
            case "utf8":
            case "utf-8":
              return "utf8";
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return "utf16le";
            case "latin1":
            case "binary":
              return "latin1";
            case "base64":
            case "ascii":
            case "hex":
              return e2;
            default:
              if (t3)
                return;
              e2 = ("" + e2).toLowerCase(), t3 = true;
          }
      }
      function a(e2) {
        var t3 = r2(e2);
        if (typeof t3 != "string" && (m.isEncoding === b || !b(e2)))
          throw new Error("Unknown encoding: " + e2);
        return t3 || e2;
      }
      function o(e2) {
        this.encoding = a(e2);
        var t3;
        switch (this.encoding) {
          case "utf16le":
            this.text = u, this.end = p, t3 = 4;
            break;
          case "utf8":
            this.fillLast = c, t3 = 4;
            break;
          case "base64":
            this.text = f, this.end = g, t3 = 3;
            break;
          default:
            return this.write = _, void (this.end = h);
        }
        this.lastNeed = 0, this.lastTotal = 0, this.lastChar = m.allocUnsafe(t3);
      }
      function d(e2) {
        if (127 >= e2)
          return 0;
        return e2 >> 5 == 6 ? 2 : e2 >> 4 == 14 ? 3 : e2 >> 3 == 30 ? 4 : e2 >> 6 == 2 ? -1 : -2;
      }
      function s(e2, t3, n3) {
        var r3 = t3.length - 1;
        if (r3 < n3)
          return 0;
        var a2 = d(t3[r3]);
        return 0 <= a2 ? (0 < a2 && (e2.lastNeed = a2 - 1), a2) : --r3 < n3 || a2 === -2 ? 0 : (a2 = d(t3[r3]), 0 <= a2) ? (0 < a2 && (e2.lastNeed = a2 - 2), a2) : --r3 < n3 || a2 === -2 ? 0 : (a2 = d(t3[r3]), 0 <= a2 ? (0 < a2 && (a2 === 2 ? a2 = 0 : e2.lastNeed = a2 - 3), a2) : 0);
      }
      function l(e2, t3) {
        if ((192 & t3[0]) != 128)
          return e2.lastNeed = 0, "\uFFFD";
        if (1 < e2.lastNeed && 1 < t3.length) {
          if ((192 & t3[1]) != 128)
            return e2.lastNeed = 1, "\uFFFD";
          if (2 < e2.lastNeed && 2 < t3.length && (192 & t3[2]) != 128)
            return e2.lastNeed = 2, "\uFFFD";
        }
      }
      function c(e2) {
        var t3 = this.lastTotal - this.lastNeed, n3 = l(this, e2);
        return n3 === void 0 ? this.lastNeed <= e2.length ? (e2.copy(this.lastChar, t3, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : void (e2.copy(this.lastChar, t3, 0, e2.length), this.lastNeed -= e2.length) : n3;
      }
      function u(e2, t3) {
        if ((e2.length - t3) % 2 == 0) {
          var n3 = e2.toString("utf16le", t3);
          if (n3) {
            var r3 = n3.charCodeAt(n3.length - 1);
            if (55296 <= r3 && 56319 >= r3)
              return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e2[e2.length - 2], this.lastChar[1] = e2[e2.length - 1], n3.slice(0, -1);
          }
          return n3;
        }
        return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e2[e2.length - 1], e2.toString("utf16le", t3, e2.length - 1);
      }
      function p(e2) {
        var t3 = e2 && e2.length ? this.write(e2) : "";
        if (this.lastNeed) {
          var n3 = this.lastTotal - this.lastNeed;
          return t3 + this.lastChar.toString("utf16le", 0, n3);
        }
        return t3;
      }
      function f(e2, t3) {
        var r3 = (e2.length - t3) % 3;
        return r3 == 0 ? e2.toString("base64", t3) : (this.lastNeed = 3 - r3, this.lastTotal = 3, r3 == 1 ? this.lastChar[0] = e2[e2.length - 1] : (this.lastChar[0] = e2[e2.length - 2], this.lastChar[1] = e2[e2.length - 1]), e2.toString("base64", t3, e2.length - r3));
      }
      function g(e2) {
        var t3 = e2 && e2.length ? this.write(e2) : "";
        return this.lastNeed ? t3 + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t3;
      }
      function _(e2) {
        return e2.toString(this.encoding);
      }
      function h(e2) {
        return e2 && e2.length ? this.write(e2) : "";
      }
      var m = e("safe-buffer").Buffer, b = m.isEncoding || function(e2) {
        switch (e2 = "" + e2, e2 && e2.toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
          case "raw":
            return true;
          default:
            return false;
        }
      };
      n2.StringDecoder = o, o.prototype.write = function(e2) {
        if (e2.length === 0)
          return "";
        var t3, n3;
        if (this.lastNeed) {
          if (t3 = this.fillLast(e2), t3 === void 0)
            return "";
          n3 = this.lastNeed, this.lastNeed = 0;
        } else
          n3 = 0;
        return n3 < e2.length ? t3 ? t3 + this.text(e2, n3) : this.text(e2, n3) : t3 || "";
      }, o.prototype.end = function(e2) {
        var t3 = e2 && e2.length ? this.write(e2) : "";
        return this.lastNeed ? t3 + "\uFFFD" : t3;
      }, o.prototype.text = function(e2, t3) {
        var n3 = s(this, e2, t3);
        if (!this.lastNeed)
          return e2.toString("utf8", t3);
        this.lastTotal = n3;
        var r3 = e2.length - (n3 - this.lastNeed);
        return e2.copy(this.lastChar, 0, r3), e2.toString("utf8", t3, r3);
      }, o.prototype.fillLast = function(e2) {
        return this.lastNeed <= e2.length ? (e2.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : void (e2.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e2.length), this.lastNeed -= e2.length);
      };
    }, { "safe-buffer": 30 }], 32: [function(e, t2) {
      (function(e2) {
        (function() {
          function n2(t3) {
            try {
              if (!e2.localStorage)
                return false;
            } catch (e3) {
              return false;
            }
            var n3 = e2.localStorage[t3];
            return n3 != null && (n3 + "").toLowerCase() === "true";
          }
          t2.exports = function(e3, t3) {
            function r2() {
              if (!a) {
                if (n2("throwDeprecation"))
                  throw new Error(t3);
                else
                  n2("traceDeprecation") ? console.trace(t3) : console.warn(t3);
                a = true;
              }
              return e3.apply(this, arguments);
            }
            if (n2("noDeprecation"))
              return e3;
            var a = false;
            return r2;
          };
        }).call(this);
      }).call(this, typeof commonjsGlobal == "undefined" ? typeof self == "undefined" ? typeof window == "undefined" ? {} : window : self : commonjsGlobal);
    }, {}], "/": [function(e, t2) {
      function n2(e2) {
        return e2.replace(/a=ice-options:trickle\s\n/g, "");
      }
      function r2(e2) {
        console.warn(e2);
      }
      /*! simple-peer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
      const a = e("debug")("simple-peer"), o = e("get-browser-rtc"), i = e("randombytes"), d = e("readable-stream"), s = e("queue-microtask"), l = e("err-code"), { Buffer: c } = e("buffer"), u = 65536;
      class p extends d.Duplex {
        constructor(e2) {
          if (e2 = Object.assign({ allowHalfOpen: false }, e2), super(e2), this._id = i(4).toString("hex").slice(0, 7), this._debug("new peer %o", e2), this.channelName = e2.initiator ? e2.channelName || i(20).toString("hex") : null, this.initiator = e2.initiator || false, this.channelConfig = e2.channelConfig || p.channelConfig, this.channelNegotiated = this.channelConfig.negotiated, this.config = Object.assign({}, p.config, e2.config), this.offerOptions = e2.offerOptions || {}, this.answerOptions = e2.answerOptions || {}, this.sdpTransform = e2.sdpTransform || ((e3) => e3), this.streams = e2.streams || (e2.stream ? [e2.stream] : []), this.trickle = e2.trickle === void 0 || e2.trickle, this.allowHalfTrickle = e2.allowHalfTrickle !== void 0 && e2.allowHalfTrickle, this.iceCompleteTimeout = e2.iceCompleteTimeout || 5e3, this.destroyed = false, this.destroying = false, this._connected = false, this.remoteAddress = void 0, this.remoteFamily = void 0, this.remotePort = void 0, this.localAddress = void 0, this.localFamily = void 0, this.localPort = void 0, this._wrtc = e2.wrtc && typeof e2.wrtc == "object" ? e2.wrtc : o(), !this._wrtc)
            if (typeof window == "undefined")
              throw l(new Error("No WebRTC support: Specify `opts.wrtc` option in this environment"), "ERR_WEBRTC_SUPPORT");
            else
              throw l(new Error("No WebRTC support: Not a supported browser"), "ERR_WEBRTC_SUPPORT");
          this._pcReady = false, this._channelReady = false, this._iceComplete = false, this._iceCompleteTimer = null, this._channel = null, this._pendingCandidates = [], this._isNegotiating = false, this._firstNegotiation = true, this._batchedNegotiation = false, this._queuedNegotiation = false, this._sendersAwaitingStable = [], this._senderMap = /* @__PURE__ */ new Map(), this._closingInterval = null, this._remoteTracks = [], this._remoteStreams = [], this._chunk = null, this._cb = null, this._interval = null;
          try {
            this._pc = new this._wrtc.RTCPeerConnection(this.config);
          } catch (e3) {
            return void this.destroy(l(e3, "ERR_PC_CONSTRUCTOR"));
          }
          this._isReactNativeWebrtc = typeof this._pc._peerConnectionId == "number", this._pc.oniceconnectionstatechange = () => {
            this._onIceStateChange();
          }, this._pc.onicegatheringstatechange = () => {
            this._onIceStateChange();
          }, this._pc.onconnectionstatechange = () => {
            this._onConnectionStateChange();
          }, this._pc.onsignalingstatechange = () => {
            this._onSignalingStateChange();
          }, this._pc.onicecandidate = (e3) => {
            this._onIceCandidate(e3);
          }, typeof this._pc.peerIdentity == "object" && this._pc.peerIdentity.catch((e3) => {
            this.destroy(l(e3, "ERR_PC_PEER_IDENTITY"));
          }), this.initiator || this.channelNegotiated ? this._setupData({ channel: this._pc.createDataChannel(this.channelName, this.channelConfig) }) : this._pc.ondatachannel = (e3) => {
            this._setupData(e3);
          }, this.streams && this.streams.forEach((e3) => {
            this.addStream(e3);
          }), this._pc.ontrack = (e3) => {
            this._onTrack(e3);
          }, this._debug("initial negotiation"), this._needsNegotiation(), this._onFinishBound = () => {
            this._onFinish();
          }, this.once("finish", this._onFinishBound);
        }
        get bufferSize() {
          return this._channel && this._channel.bufferedAmount || 0;
        }
        get connected() {
          return this._connected && this._channel.readyState === "open";
        }
        address() {
          return { port: this.localPort, family: this.localFamily, address: this.localAddress };
        }
        signal(e2) {
          if (!this.destroying) {
            if (this.destroyed)
              throw l(new Error("cannot signal after peer is destroyed"), "ERR_DESTROYED");
            if (typeof e2 == "string")
              try {
                e2 = JSON.parse(e2);
              } catch (t3) {
                e2 = {};
              }
            this._debug("signal()"), e2.renegotiate && this.initiator && (this._debug("got request to renegotiate"), this._needsNegotiation()), e2.transceiverRequest && this.initiator && (this._debug("got request for transceiver"), this.addTransceiver(e2.transceiverRequest.kind, e2.transceiverRequest.init)), e2.candidate && (this._pc.remoteDescription && this._pc.remoteDescription.type ? this._addIceCandidate(e2.candidate) : this._pendingCandidates.push(e2.candidate)), e2.sdp && this._pc.setRemoteDescription(new this._wrtc.RTCSessionDescription(e2)).then(() => {
              this.destroyed || (this._pendingCandidates.forEach((e3) => {
                this._addIceCandidate(e3);
              }), this._pendingCandidates = [], this._pc.remoteDescription.type === "offer" && this._createAnswer());
            }).catch((e3) => {
              this.destroy(l(e3, "ERR_SET_REMOTE_DESCRIPTION"));
            }), e2.sdp || e2.candidate || e2.renegotiate || e2.transceiverRequest || this.destroy(l(new Error("signal() called with invalid signal data"), "ERR_SIGNALING"));
          }
        }
        _addIceCandidate(e2) {
          const t3 = new this._wrtc.RTCIceCandidate(e2);
          this._pc.addIceCandidate(t3).catch((e3) => {
            !t3.address || t3.address.endsWith(".local") ? r2("Ignoring unsupported ICE candidate.") : this.destroy(l(e3, "ERR_ADD_ICE_CANDIDATE"));
          });
        }
        send(e2) {
          if (!this.destroying) {
            if (this.destroyed)
              throw l(new Error("cannot send after peer is destroyed"), "ERR_DESTROYED");
            this._channel.send(e2);
          }
        }
        addTransceiver(e2, t3) {
          if (!this.destroying) {
            if (this.destroyed)
              throw l(new Error("cannot addTransceiver after peer is destroyed"), "ERR_DESTROYED");
            if (this._debug("addTransceiver()"), this.initiator)
              try {
                this._pc.addTransceiver(e2, t3), this._needsNegotiation();
              } catch (e3) {
                this.destroy(l(e3, "ERR_ADD_TRANSCEIVER"));
              }
            else
              this.emit("signal", { type: "transceiverRequest", transceiverRequest: { kind: e2, init: t3 } });
          }
        }
        addStream(e2) {
          if (!this.destroying) {
            if (this.destroyed)
              throw l(new Error("cannot addStream after peer is destroyed"), "ERR_DESTROYED");
            this._debug("addStream()"), e2.getTracks().forEach((t3) => {
              this.addTrack(t3, e2);
            });
          }
        }
        addTrack(e2, t3) {
          if (this.destroying)
            return;
          if (this.destroyed)
            throw l(new Error("cannot addTrack after peer is destroyed"), "ERR_DESTROYED");
          this._debug("addTrack()");
          const n3 = this._senderMap.get(e2) || /* @__PURE__ */ new Map();
          let r3 = n3.get(t3);
          if (!r3)
            r3 = this._pc.addTrack(e2, t3), n3.set(t3, r3), this._senderMap.set(e2, n3), this._needsNegotiation();
          else if (r3.removed)
            throw l(new Error("Track has been removed. You should enable/disable tracks that you want to re-add."), "ERR_SENDER_REMOVED");
          else
            throw l(new Error("Track has already been added to that stream."), "ERR_SENDER_ALREADY_ADDED");
        }
        replaceTrack(e2, t3, n3) {
          if (this.destroying)
            return;
          if (this.destroyed)
            throw l(new Error("cannot replaceTrack after peer is destroyed"), "ERR_DESTROYED");
          this._debug("replaceTrack()");
          const r3 = this._senderMap.get(e2), a2 = r3 ? r3.get(n3) : null;
          if (!a2)
            throw l(new Error("Cannot replace track that was never added."), "ERR_TRACK_NOT_ADDED");
          t3 && this._senderMap.set(t3, r3), a2.replaceTrack == null ? this.destroy(l(new Error("replaceTrack is not supported in this browser"), "ERR_UNSUPPORTED_REPLACETRACK")) : a2.replaceTrack(t3);
        }
        removeTrack(e2, t3) {
          if (this.destroying)
            return;
          if (this.destroyed)
            throw l(new Error("cannot removeTrack after peer is destroyed"), "ERR_DESTROYED");
          this._debug("removeSender()");
          const n3 = this._senderMap.get(e2), r3 = n3 ? n3.get(t3) : null;
          if (!r3)
            throw l(new Error("Cannot remove track that was never added."), "ERR_TRACK_NOT_ADDED");
          try {
            r3.removed = true, this._pc.removeTrack(r3);
          } catch (e3) {
            e3.name === "NS_ERROR_UNEXPECTED" ? this._sendersAwaitingStable.push(r3) : this.destroy(l(e3, "ERR_REMOVE_TRACK"));
          }
          this._needsNegotiation();
        }
        removeStream(e2) {
          if (!this.destroying) {
            if (this.destroyed)
              throw l(new Error("cannot removeStream after peer is destroyed"), "ERR_DESTROYED");
            this._debug("removeSenders()"), e2.getTracks().forEach((t3) => {
              this.removeTrack(t3, e2);
            });
          }
        }
        _needsNegotiation() {
          this._debug("_needsNegotiation"), this._batchedNegotiation || (this._batchedNegotiation = true, s(() => {
            this._batchedNegotiation = false, this.initiator || !this._firstNegotiation ? (this._debug("starting batched negotiation"), this.negotiate()) : this._debug("non-initiator initial negotiation request discarded"), this._firstNegotiation = false;
          }));
        }
        negotiate() {
          if (!this.destroying) {
            if (this.destroyed)
              throw l(new Error("cannot negotiate after peer is destroyed"), "ERR_DESTROYED");
            this.initiator ? this._isNegotiating ? (this._queuedNegotiation = true, this._debug("already negotiating, queueing")) : (this._debug("start negotiation"), setTimeout(() => {
              this._createOffer();
            }, 0)) : this._isNegotiating ? (this._queuedNegotiation = true, this._debug("already negotiating, queueing")) : (this._debug("requesting negotiation from initiator"), this.emit("signal", { type: "renegotiate", renegotiate: true })), this._isNegotiating = true;
          }
        }
        destroy(e2) {
          this._destroy(e2, () => {
          });
        }
        _destroy(e2, t3) {
          this.destroyed || this.destroying || (this.destroying = true, this._debug("destroying (error: %s)", e2 && (e2.message || e2)), s(() => {
            if (this.destroyed = true, this.destroying = false, this._debug("destroy (error: %s)", e2 && (e2.message || e2)), this.readable = this.writable = false, this._readableState.ended || this.push(null), this._writableState.finished || this.end(), this._connected = false, this._pcReady = false, this._channelReady = false, this._remoteTracks = null, this._remoteStreams = null, this._senderMap = null, clearInterval(this._closingInterval), this._closingInterval = null, clearInterval(this._interval), this._interval = null, this._chunk = null, this._cb = null, this._onFinishBound && this.removeListener("finish", this._onFinishBound), this._onFinishBound = null, this._channel) {
              try {
                this._channel.close();
              } catch (e3) {
              }
              this._channel.onmessage = null, this._channel.onopen = null, this._channel.onclose = null, this._channel.onerror = null;
            }
            if (this._pc) {
              try {
                this._pc.close();
              } catch (e3) {
              }
              this._pc.oniceconnectionstatechange = null, this._pc.onicegatheringstatechange = null, this._pc.onsignalingstatechange = null, this._pc.onicecandidate = null, this._pc.ontrack = null, this._pc.ondatachannel = null;
            }
            this._pc = null, this._channel = null, e2 && this.emit("error", e2), this.emit("close"), t3();
          }));
        }
        _setupData(e2) {
          if (!e2.channel)
            return this.destroy(l(new Error("Data channel event is missing `channel` property"), "ERR_DATA_CHANNEL"));
          this._channel = e2.channel, this._channel.binaryType = "arraybuffer", typeof this._channel.bufferedAmountLowThreshold == "number" && (this._channel.bufferedAmountLowThreshold = u), this.channelName = this._channel.label, this._channel.onmessage = (e3) => {
            this._onChannelMessage(e3);
          }, this._channel.onbufferedamountlow = () => {
            this._onChannelBufferedAmountLow();
          }, this._channel.onopen = () => {
            this._onChannelOpen();
          }, this._channel.onclose = () => {
            this._onChannelClose();
          }, this._channel.onerror = (e3) => {
            const t4 = e3.error instanceof Error ? e3.error : new Error(`Datachannel error: ${e3.message} ${e3.filename}:${e3.lineno}:${e3.colno}`);
            this.destroy(l(t4, "ERR_DATA_CHANNEL"));
          };
          let t3 = false;
          this._closingInterval = setInterval(() => {
            this._channel && this._channel.readyState === "closing" ? (t3 && this._onChannelClose(), t3 = true) : t3 = false;
          }, 5e3);
        }
        _read() {
        }
        _write(e2, t3, n3) {
          if (this.destroyed)
            return n3(l(new Error("cannot write after peer is destroyed"), "ERR_DATA_CHANNEL"));
          if (this._connected) {
            try {
              this.send(e2);
            } catch (e3) {
              return this.destroy(l(e3, "ERR_DATA_CHANNEL"));
            }
            this._channel.bufferedAmount > u ? (this._debug("start backpressure: bufferedAmount %d", this._channel.bufferedAmount), this._cb = n3) : n3(null);
          } else
            this._debug("write before connect"), this._chunk = e2, this._cb = n3;
        }
        _onFinish() {
          if (!this.destroyed) {
            const e2 = () => {
              setTimeout(() => this.destroy(), 1e3);
            };
            this._connected ? e2() : this.once("connect", e2);
          }
        }
        _startIceCompleteTimeout() {
          this.destroyed || this._iceCompleteTimer || (this._debug("started iceComplete timeout"), this._iceCompleteTimer = setTimeout(() => {
            this._iceComplete || (this._iceComplete = true, this._debug("iceComplete timeout completed"), this.emit("iceTimeout"), this.emit("_iceComplete"));
          }, this.iceCompleteTimeout));
        }
        _createOffer() {
          this.destroyed || this._pc.createOffer(this.offerOptions).then((e2) => {
            if (this.destroyed)
              return;
            this.trickle || this.allowHalfTrickle || (e2.sdp = n2(e2.sdp)), e2.sdp = this.sdpTransform(e2.sdp);
            const t3 = () => {
              if (!this.destroyed) {
                const t4 = this._pc.localDescription || e2;
                this._debug("signal"), this.emit("signal", { type: t4.type, sdp: t4.sdp });
              }
            };
            this._pc.setLocalDescription(e2).then(() => {
              this._debug("createOffer success"), this.destroyed || (this.trickle || this._iceComplete ? t3() : this.once("_iceComplete", t3));
            }).catch((e3) => {
              this.destroy(l(e3, "ERR_SET_LOCAL_DESCRIPTION"));
            });
          }).catch((e2) => {
            this.destroy(l(e2, "ERR_CREATE_OFFER"));
          });
        }
        _requestMissingTransceivers() {
          this._pc.getTransceivers && this._pc.getTransceivers().forEach((e2) => {
            e2.mid || !e2.sender.track || e2.requested || (e2.requested = true, this.addTransceiver(e2.sender.track.kind));
          });
        }
        _createAnswer() {
          this.destroyed || this._pc.createAnswer(this.answerOptions).then((e2) => {
            if (this.destroyed)
              return;
            this.trickle || this.allowHalfTrickle || (e2.sdp = n2(e2.sdp)), e2.sdp = this.sdpTransform(e2.sdp);
            const t3 = () => {
              if (!this.destroyed) {
                const t4 = this._pc.localDescription || e2;
                this._debug("signal"), this.emit("signal", { type: t4.type, sdp: t4.sdp }), this.initiator || this._requestMissingTransceivers();
              }
            };
            this._pc.setLocalDescription(e2).then(() => {
              this.destroyed || (this.trickle || this._iceComplete ? t3() : this.once("_iceComplete", t3));
            }).catch((e3) => {
              this.destroy(l(e3, "ERR_SET_LOCAL_DESCRIPTION"));
            });
          }).catch((e2) => {
            this.destroy(l(e2, "ERR_CREATE_ANSWER"));
          });
        }
        _onConnectionStateChange() {
          this.destroyed || this._pc.connectionState === "failed" && this.destroy(l(new Error("Connection failed."), "ERR_CONNECTION_FAILURE"));
        }
        _onIceStateChange() {
          if (this.destroyed)
            return;
          const e2 = this._pc.iceConnectionState, t3 = this._pc.iceGatheringState;
          this._debug("iceStateChange (connection: %s) (gathering: %s)", e2, t3), this.emit("iceStateChange", e2, t3), (e2 === "connected" || e2 === "completed") && (this._pcReady = true, this._maybeReady()), e2 === "failed" && this.destroy(l(new Error("Ice connection failed."), "ERR_ICE_CONNECTION_FAILURE")), e2 === "closed" && this.destroy(l(new Error("Ice connection closed."), "ERR_ICE_CONNECTION_CLOSED"));
        }
        getStats(e2) {
          const t3 = (e3) => (Object.prototype.toString.call(e3.values) === "[object Array]" && e3.values.forEach((t4) => {
            Object.assign(e3, t4);
          }), e3);
          this._pc.getStats.length === 0 || this._isReactNativeWebrtc ? this._pc.getStats().then((n3) => {
            const r3 = [];
            n3.forEach((e3) => {
              r3.push(t3(e3));
            }), e2(null, r3);
          }, (t4) => e2(t4)) : 0 < this._pc.getStats.length ? this._pc.getStats((n3) => {
            if (this.destroyed)
              return;
            const r3 = [];
            n3.result().forEach((e3) => {
              const n4 = {};
              e3.names().forEach((t4) => {
                n4[t4] = e3.stat(t4);
              }), n4.id = e3.id, n4.type = e3.type, n4.timestamp = e3.timestamp, r3.push(t3(n4));
            }), e2(null, r3);
          }, (t4) => e2(t4)) : e2(null, []);
        }
        _maybeReady() {
          if (this._debug("maybeReady pc %s channel %s", this._pcReady, this._channelReady), this._connected || this._connecting || !this._pcReady || !this._channelReady)
            return;
          this._connecting = true;
          const e2 = () => {
            this.destroyed || this.getStats((t3, n3) => {
              if (this.destroyed)
                return;
              t3 && (n3 = []);
              const r3 = {}, a2 = {}, o2 = {};
              let i2 = false;
              n3.forEach((e3) => {
                (e3.type === "remotecandidate" || e3.type === "remote-candidate") && (r3[e3.id] = e3), (e3.type === "localcandidate" || e3.type === "local-candidate") && (a2[e3.id] = e3), (e3.type === "candidatepair" || e3.type === "candidate-pair") && (o2[e3.id] = e3);
              });
              const d2 = (e3) => {
                i2 = true;
                let t4 = a2[e3.localCandidateId];
                t4 && (t4.ip || t4.address) ? (this.localAddress = t4.ip || t4.address, this.localPort = +t4.port) : t4 && t4.ipAddress ? (this.localAddress = t4.ipAddress, this.localPort = +t4.portNumber) : typeof e3.googLocalAddress == "string" && (t4 = e3.googLocalAddress.split(":"), this.localAddress = t4[0], this.localPort = +t4[1]), this.localAddress && (this.localFamily = this.localAddress.includes(":") ? "IPv6" : "IPv4");
                let n4 = r3[e3.remoteCandidateId];
                n4 && (n4.ip || n4.address) ? (this.remoteAddress = n4.ip || n4.address, this.remotePort = +n4.port) : n4 && n4.ipAddress ? (this.remoteAddress = n4.ipAddress, this.remotePort = +n4.portNumber) : typeof e3.googRemoteAddress == "string" && (n4 = e3.googRemoteAddress.split(":"), this.remoteAddress = n4[0], this.remotePort = +n4[1]), this.remoteAddress && (this.remoteFamily = this.remoteAddress.includes(":") ? "IPv6" : "IPv4"), this._debug("connect local: %s:%s remote: %s:%s", this.localAddress, this.localPort, this.remoteAddress, this.remotePort);
              };
              if (n3.forEach((e3) => {
                e3.type === "transport" && e3.selectedCandidatePairId && d2(o2[e3.selectedCandidatePairId]), (e3.type === "googCandidatePair" && e3.googActiveConnection === "true" || (e3.type === "candidatepair" || e3.type === "candidate-pair") && e3.selected) && d2(e3);
              }), !i2 && (!Object.keys(o2).length || Object.keys(a2).length))
                return void setTimeout(e2, 100);
              if (this._connecting = false, this._connected = true, this._chunk) {
                try {
                  this.send(this._chunk);
                } catch (e4) {
                  return this.destroy(l(e4, "ERR_DATA_CHANNEL"));
                }
                this._chunk = null, this._debug('sent chunk from "write before connect"');
                const e3 = this._cb;
                this._cb = null, e3(null);
              }
              typeof this._channel.bufferedAmountLowThreshold != "number" && (this._interval = setInterval(() => this._onInterval(), 150), this._interval.unref && this._interval.unref()), this._debug("connect"), this.emit("connect");
            });
          };
          e2();
        }
        _onInterval() {
          this._cb && this._channel && !(this._channel.bufferedAmount > u) && this._onChannelBufferedAmountLow();
        }
        _onSignalingStateChange() {
          this.destroyed || (this._pc.signalingState === "stable" && (this._isNegotiating = false, this._debug("flushing sender queue", this._sendersAwaitingStable), this._sendersAwaitingStable.forEach((e2) => {
            this._pc.removeTrack(e2), this._queuedNegotiation = true;
          }), this._sendersAwaitingStable = [], this._queuedNegotiation ? (this._debug("flushing negotiation queue"), this._queuedNegotiation = false, this._needsNegotiation()) : (this._debug("negotiated"), this.emit("negotiated"))), this._debug("signalingStateChange %s", this._pc.signalingState), this.emit("signalingStateChange", this._pc.signalingState));
        }
        _onIceCandidate(e2) {
          this.destroyed || (e2.candidate && this.trickle ? this.emit("signal", { type: "candidate", candidate: { candidate: e2.candidate.candidate, sdpMLineIndex: e2.candidate.sdpMLineIndex, sdpMid: e2.candidate.sdpMid } }) : !e2.candidate && !this._iceComplete && (this._iceComplete = true, this.emit("_iceComplete")), e2.candidate && this._startIceCompleteTimeout());
        }
        _onChannelMessage(e2) {
          if (this.destroyed)
            return;
          let t3 = e2.data;
          t3 instanceof ArrayBuffer && (t3 = c.from(t3)), this.push(t3);
        }
        _onChannelBufferedAmountLow() {
          if (!this.destroyed && this._cb) {
            this._debug("ending backpressure: bufferedAmount %d", this._channel.bufferedAmount);
            const e2 = this._cb;
            this._cb = null, e2(null);
          }
        }
        _onChannelOpen() {
          this._connected || this.destroyed || (this._debug("on channel open"), this._channelReady = true, this._maybeReady());
        }
        _onChannelClose() {
          this.destroyed || (this._debug("on channel close"), this.destroy());
        }
        _onTrack(e2) {
          this.destroyed || e2.streams.forEach((t3) => {
            this._debug("on track"), this.emit("track", e2.track, t3), this._remoteTracks.push({ track: e2.track, stream: t3 }), this._remoteStreams.some((e3) => e3.id === t3.id) || (this._remoteStreams.push(t3), s(() => {
              this._debug("on stream"), this.emit("stream", t3);
            }));
          });
        }
        _debug() {
          const e2 = [].slice.call(arguments);
          e2[0] = "[" + this._id + "] " + e2[0], a.apply(null, e2);
        }
      }
      p.WEBRTC_SUPPORT = !!o(), p.config = { iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:global.stun.twilio.com:3478"] }], sdpSemantics: "unified-plan" }, p.channelConfig = {}, t2.exports = p;
    }, { buffer: 3, debug: 4, "err-code": 6, "get-browser-rtc": 8, "queue-microtask": 13, randombytes: 14, "readable-stream": 29 }] }, {}, [])("/");
  });
})(simplepeer_min);
var Peer = simplepeer_min.exports;
const messageYjsSyncStep1 = 0;
const messageYjsSyncStep2 = 1;
const messageYjsUpdate = 2;
const writeSyncStep1 = (encoder, doc2) => {
  writeVarUint(encoder, messageYjsSyncStep1);
  const sv = encodeStateVector(doc2);
  writeVarUint8Array(encoder, sv);
};
const writeSyncStep2 = (encoder, doc2, encodedStateVector) => {
  writeVarUint(encoder, messageYjsSyncStep2);
  writeVarUint8Array(encoder, encodeStateAsUpdate(doc2, encodedStateVector));
};
const readSyncStep1 = (decoder, encoder, doc2) => writeSyncStep2(encoder, doc2, readVarUint8Array(decoder));
const readSyncStep2 = (decoder, doc2, transactionOrigin) => {
  try {
    applyUpdate(doc2, readVarUint8Array(decoder), transactionOrigin);
  } catch (error) {
    console.error("Caught error while handling a Yjs update", error);
  }
};
const writeUpdate = (encoder, update) => {
  writeVarUint(encoder, messageYjsUpdate);
  writeVarUint8Array(encoder, update);
};
const readUpdate = readSyncStep2;
const readSyncMessage = (decoder, encoder, doc2, transactionOrigin) => {
  const messageType = readVarUint(decoder);
  switch (messageType) {
    case messageYjsSyncStep1:
      readSyncStep1(decoder, encoder, doc2);
      break;
    case messageYjsSyncStep2:
      readSyncStep2(decoder, doc2, transactionOrigin);
      break;
    case messageYjsUpdate:
      readUpdate(decoder, doc2, transactionOrigin);
      break;
    default:
      throw new Error("Unknown message type");
  }
  return messageType;
};
const outdatedTimeout = 3e4;
class Awareness extends Observable {
  constructor(doc2) {
    super();
    this.doc = doc2;
    this.clientID = doc2.clientID;
    this.states = /* @__PURE__ */ new Map();
    this.meta = /* @__PURE__ */ new Map();
    this._checkInterval = setInterval(() => {
      const now = getUnixTime();
      if (this.getLocalState() !== null && outdatedTimeout / 2 <= now - this.meta.get(this.clientID).lastUpdated) {
        this.setLocalState(this.getLocalState());
      }
      const remove = [];
      this.meta.forEach((meta, clientid) => {
        if (clientid !== this.clientID && outdatedTimeout <= now - meta.lastUpdated && this.states.has(clientid)) {
          remove.push(clientid);
        }
      });
      if (remove.length > 0) {
        removeAwarenessStates(this, remove, "timeout");
      }
    }, floor(outdatedTimeout / 10));
    doc2.on("destroy", () => {
      this.destroy();
    });
    this.setLocalState({});
  }
  destroy() {
    this.emit("destroy", [this]);
    this.setLocalState(null);
    super.destroy();
    clearInterval(this._checkInterval);
  }
  getLocalState() {
    return this.states.get(this.clientID) || null;
  }
  setLocalState(state) {
    const clientID = this.clientID;
    const currLocalMeta = this.meta.get(clientID);
    const clock = currLocalMeta === void 0 ? 0 : currLocalMeta.clock + 1;
    const prevState = this.states.get(clientID);
    if (state === null) {
      this.states.delete(clientID);
    } else {
      this.states.set(clientID, state);
    }
    this.meta.set(clientID, {
      clock,
      lastUpdated: getUnixTime()
    });
    const added = [];
    const updated = [];
    const filteredUpdated = [];
    const removed = [];
    if (state === null) {
      removed.push(clientID);
    } else if (prevState == null) {
      if (state != null) {
        added.push(clientID);
      }
    } else {
      updated.push(clientID);
      if (!equalityDeep(prevState, state)) {
        filteredUpdated.push(clientID);
      }
    }
    if (added.length > 0 || filteredUpdated.length > 0 || removed.length > 0) {
      this.emit("change", [{ added, updated: filteredUpdated, removed }, "local"]);
    }
    this.emit("update", [{ added, updated, removed }, "local"]);
  }
  setLocalStateField(field, value) {
    const state = this.getLocalState();
    if (state !== null) {
      this.setLocalState(__spreadProps(__spreadValues({}, state), {
        [field]: value
      }));
    }
  }
  getStates() {
    return this.states;
  }
}
const removeAwarenessStates = (awareness, clients, origin) => {
  const removed = [];
  for (let i = 0; i < clients.length; i++) {
    const clientID = clients[i];
    if (awareness.states.has(clientID)) {
      awareness.states.delete(clientID);
      if (clientID === awareness.clientID) {
        const curMeta = awareness.meta.get(clientID);
        awareness.meta.set(clientID, {
          clock: curMeta.clock + 1,
          lastUpdated: getUnixTime()
        });
      }
      removed.push(clientID);
    }
  }
  if (removed.length > 0) {
    awareness.emit("change", [{ added: [], updated: [], removed }, origin]);
    awareness.emit("update", [{ added: [], updated: [], removed }, origin]);
  }
};
const encodeAwarenessUpdate = (awareness, clients, states = awareness.states) => {
  const len = clients.length;
  const encoder = createEncoder();
  writeVarUint(encoder, len);
  for (let i = 0; i < len; i++) {
    const clientID = clients[i];
    const state = states.get(clientID) || null;
    const clock = awareness.meta.get(clientID).clock;
    writeVarUint(encoder, clientID);
    writeVarUint(encoder, clock);
    writeVarString(encoder, JSON.stringify(state));
  }
  return toUint8Array(encoder);
};
const applyAwarenessUpdate = (awareness, update, origin) => {
  const decoder = createDecoder(update);
  const timestamp = getUnixTime();
  const added = [];
  const updated = [];
  const filteredUpdated = [];
  const removed = [];
  const len = readVarUint(decoder);
  for (let i = 0; i < len; i++) {
    const clientID = readVarUint(decoder);
    let clock = readVarUint(decoder);
    const state = JSON.parse(readVarString(decoder));
    const clientMeta = awareness.meta.get(clientID);
    const prevState = awareness.states.get(clientID);
    const currClock = clientMeta === void 0 ? 0 : clientMeta.clock;
    if (currClock < clock || currClock === clock && state === null && awareness.states.has(clientID)) {
      if (state === null) {
        if (clientID === awareness.clientID && awareness.getLocalState() != null) {
          clock++;
        } else {
          awareness.states.delete(clientID);
        }
      } else {
        awareness.states.set(clientID, state);
      }
      awareness.meta.set(clientID, {
        clock,
        lastUpdated: timestamp
      });
      if (clientMeta === void 0 && state !== null) {
        added.push(clientID);
      } else if (clientMeta !== void 0 && state === null) {
        removed.push(clientID);
      } else if (state !== null) {
        if (!equalityDeep(state, prevState)) {
          filteredUpdated.push(clientID);
        }
        updated.push(clientID);
      }
    }
  }
  if (added.length > 0 || filteredUpdated.length > 0 || removed.length > 0) {
    awareness.emit("change", [{
      added,
      updated: filteredUpdated,
      removed
    }, origin]);
  }
  if (added.length > 0 || updated.length > 0 || removed.length > 0) {
    awareness.emit("update", [{
      added,
      updated,
      removed
    }, origin]);
  }
};
const deriveKey = (secret, roomName) => {
  const secretBuffer = encodeUtf8(secret).buffer;
  const salt = encodeUtf8(roomName).buffer;
  return crypto.subtle.importKey("raw", secretBuffer, "PBKDF2", false, ["deriveKey"]).then((keyMaterial) => crypto.subtle.deriveKey({
    name: "PBKDF2",
    salt,
    iterations: 1e5,
    hash: "SHA-256"
  }, keyMaterial, {
    name: "AES-GCM",
    length: 256
  }, true, ["encrypt", "decrypt"]));
};
const encrypt = (data, key) => {
  if (!key) {
    return resolve(data);
  }
  const iv = crypto.getRandomValues(new Uint8Array(12));
  return crypto.subtle.encrypt({
    name: "AES-GCM",
    iv
  }, key, data).then((cipher) => {
    const encryptedDataEncoder = createEncoder();
    writeVarString(encryptedDataEncoder, "AES-GCM");
    writeVarUint8Array(encryptedDataEncoder, iv);
    writeVarUint8Array(encryptedDataEncoder, new Uint8Array(cipher));
    return toUint8Array(encryptedDataEncoder);
  });
};
const encryptJson = (data, key) => {
  const dataEncoder = createEncoder();
  writeAny(dataEncoder, data);
  return encrypt(toUint8Array(dataEncoder), key);
};
const decrypt = (data, key) => {
  if (!key) {
    return resolve(data);
  }
  const dataDecoder = createDecoder(data);
  const algorithm = readVarString(dataDecoder);
  if (algorithm !== "AES-GCM") {
    reject(create$3("Unknown encryption algorithm"));
  }
  const iv = readVarUint8Array(dataDecoder);
  const cipher = readVarUint8Array(dataDecoder);
  return crypto.subtle.decrypt({
    name: "AES-GCM",
    iv
  }, key, cipher).then((data2) => new Uint8Array(data2));
};
const decryptJson = (data, key) => decrypt(data, key).then((decryptedValue) => readAny(createDecoder(new Uint8Array(decryptedValue))));
const log = createModuleLogger("y-webrtc");
const messageSync = 0;
const messageQueryAwareness = 3;
const messageAwareness = 1;
const messageBcPeerId = 4;
const signalingConns = /* @__PURE__ */ new Map();
const rooms = /* @__PURE__ */ new Map();
const checkIsSynced = (room) => {
  let synced = true;
  room.webrtcConns.forEach((peer) => {
    if (!peer.synced) {
      synced = false;
    }
  });
  if (!synced && room.synced || synced && !room.synced) {
    room.synced = synced;
    room.provider.emit("synced", [{ synced }]);
    log("synced ", BOLD, room.name, UNBOLD, " with all peers");
  }
};
const readMessage = (room, buf, syncedCallback) => {
  const decoder = createDecoder(buf);
  const encoder = createEncoder();
  const messageType = readVarUint(decoder);
  if (room === void 0) {
    return null;
  }
  const awareness = room.awareness;
  const doc2 = room.doc;
  let sendReply = false;
  switch (messageType) {
    case messageSync: {
      writeVarUint(encoder, messageSync);
      const syncMessageType = readSyncMessage(decoder, encoder, doc2, room);
      if (syncMessageType === messageYjsSyncStep2 && !room.synced) {
        syncedCallback();
      }
      if (syncMessageType === messageYjsSyncStep1) {
        sendReply = true;
      }
      break;
    }
    case messageQueryAwareness:
      writeVarUint(encoder, messageAwareness);
      writeVarUint8Array(encoder, encodeAwarenessUpdate(awareness, Array.from(awareness.getStates().keys())));
      sendReply = true;
      break;
    case messageAwareness:
      applyAwarenessUpdate(awareness, readVarUint8Array(decoder), room);
      break;
    case messageBcPeerId: {
      const add = readUint8(decoder) === 1;
      const peerName = readVarString(decoder);
      if (peerName !== room.peerId && (room.bcConns.has(peerName) && !add || !room.bcConns.has(peerName) && add)) {
        const removed = [];
        const added = [];
        if (add) {
          room.bcConns.add(peerName);
          added.push(peerName);
        } else {
          room.bcConns.delete(peerName);
          removed.push(peerName);
        }
        room.provider.emit("peers", [{
          added,
          removed,
          webrtcPeers: Array.from(room.webrtcConns.keys()),
          bcPeers: Array.from(room.bcConns)
        }]);
        broadcastBcPeerId(room);
      }
      break;
    }
    default:
      console.error("Unable to compute message");
      return encoder;
  }
  if (!sendReply) {
    return null;
  }
  return encoder;
};
const readPeerMessage = (peerConn, buf) => {
  const room = peerConn.room;
  log("received message from ", BOLD, peerConn.remotePeerId, GREY, " (", room.name, ")", UNBOLD, UNCOLOR);
  return readMessage(room, buf, () => {
    peerConn.synced = true;
    log("synced ", BOLD, room.name, UNBOLD, " with ", BOLD, peerConn.remotePeerId);
    checkIsSynced(room);
  });
};
const sendWebrtcConn = (webrtcConn, encoder) => {
  log("send message to ", BOLD, webrtcConn.remotePeerId, UNBOLD, GREY, " (", webrtcConn.room.name, ")", UNCOLOR);
  try {
    webrtcConn.peer.send(toUint8Array(encoder));
  } catch (e) {
  }
};
const broadcastWebrtcConn = (room, m) => {
  log("broadcast message in ", BOLD, room.name, UNBOLD);
  room.webrtcConns.forEach((conn) => {
    try {
      conn.peer.send(m);
    } catch (e) {
    }
  });
};
class WebrtcConn {
  constructor(signalingConn, initiator, remotePeerId, room) {
    log("establishing connection to ", BOLD, remotePeerId);
    this.room = room;
    this.remotePeerId = remotePeerId;
    this.closed = false;
    this.connected = false;
    this.synced = false;
    this.peer = new Peer(__spreadValues({ initiator }, room.provider.peerOpts));
    this.peer.on("signal", (signal) => {
      publishSignalingMessage(signalingConn, room, { to: remotePeerId, from: room.peerId, type: "signal", signal });
    });
    this.peer.on("connect", () => {
      log("connected to ", BOLD, remotePeerId);
      this.connected = true;
      const provider = room.provider;
      const doc2 = provider.doc;
      const awareness = room.awareness;
      const encoder = createEncoder();
      writeVarUint(encoder, messageSync);
      writeSyncStep1(encoder, doc2);
      sendWebrtcConn(this, encoder);
      const awarenessStates = awareness.getStates();
      if (awarenessStates.size > 0) {
        const encoder2 = createEncoder();
        writeVarUint(encoder2, messageAwareness);
        writeVarUint8Array(encoder2, encodeAwarenessUpdate(awareness, Array.from(awarenessStates.keys())));
        sendWebrtcConn(this, encoder2);
      }
    });
    this.peer.on("close", () => {
      this.connected = false;
      this.closed = true;
      if (room.webrtcConns.has(this.remotePeerId)) {
        room.webrtcConns.delete(this.remotePeerId);
        room.provider.emit("peers", [{
          removed: [this.remotePeerId],
          added: [],
          webrtcPeers: Array.from(room.webrtcConns.keys()),
          bcPeers: Array.from(room.bcConns)
        }]);
      }
      checkIsSynced(room);
      this.peer.destroy();
      log("closed connection to ", BOLD, remotePeerId);
      announceSignalingInfo(room);
    });
    this.peer.on("error", (err) => {
      log("Error in connection to ", BOLD, remotePeerId, ": ", err);
      announceSignalingInfo(room);
    });
    this.peer.on("data", (data) => {
      const answer = readPeerMessage(this, data);
      if (answer !== null) {
        sendWebrtcConn(this, answer);
      }
    });
  }
  destroy() {
    this.peer.destroy();
  }
}
const broadcastBcMessage = (room, m) => encrypt(m, room.key).then((data) => room.mux(() => publish(room.name, data)));
const broadcastRoomMessage = (room, m) => {
  if (room.bcconnected) {
    broadcastBcMessage(room, m);
  }
  broadcastWebrtcConn(room, m);
};
const announceSignalingInfo = (room) => {
  signalingConns.forEach((conn) => {
    if (conn.connected) {
      conn.send({ type: "subscribe", topics: [room.name] });
      if (room.webrtcConns.size < room.provider.maxConns) {
        publishSignalingMessage(conn, room, { type: "announce", from: room.peerId });
      }
    }
  });
};
const broadcastBcPeerId = (room) => {
  if (room.provider.filterBcConns) {
    const encoderPeerIdBc = createEncoder();
    writeVarUint(encoderPeerIdBc, messageBcPeerId);
    writeUint8(encoderPeerIdBc, 1);
    writeVarString(encoderPeerIdBc, room.peerId);
    broadcastBcMessage(room, toUint8Array(encoderPeerIdBc));
  }
};
class Room {
  constructor(doc2, provider, name, key) {
    this.peerId = uuidv4();
    this.doc = doc2;
    this.awareness = provider.awareness;
    this.provider = provider;
    this.synced = false;
    this.name = name;
    this.key = key;
    this.webrtcConns = /* @__PURE__ */ new Map();
    this.bcConns = /* @__PURE__ */ new Set();
    this.mux = createMutex();
    this.bcconnected = false;
    this._bcSubscriber = (data) => decrypt(new Uint8Array(data), key).then((m) => this.mux(() => {
      const reply = readMessage(this, m, () => {
      });
      if (reply) {
        broadcastBcMessage(this, toUint8Array(reply));
      }
    }));
    this._docUpdateHandler = (update, origin) => {
      const encoder = createEncoder();
      writeVarUint(encoder, messageSync);
      writeUpdate(encoder, update);
      broadcastRoomMessage(this, toUint8Array(encoder));
    };
    this._awarenessUpdateHandler = ({ added, updated, removed }, origin) => {
      const changedClients = added.concat(updated).concat(removed);
      const encoderAwareness = createEncoder();
      writeVarUint(encoderAwareness, messageAwareness);
      writeVarUint8Array(encoderAwareness, encodeAwarenessUpdate(this.awareness, changedClients));
      broadcastRoomMessage(this, toUint8Array(encoderAwareness));
    };
    this._beforeUnloadHandler = () => {
      removeAwarenessStates(this.awareness, [doc2.clientID], "window unload");
      rooms.forEach((room) => {
        room.disconnect();
      });
    };
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", this._beforeUnloadHandler);
    } else if (typeof process !== "undefined") {
      process.on("exit", this._beforeUnloadHandler);
    }
  }
  connect() {
    this.doc.on("update", this._docUpdateHandler);
    this.awareness.on("update", this._awarenessUpdateHandler);
    announceSignalingInfo(this);
    const roomName = this.name;
    subscribe(roomName, this._bcSubscriber);
    this.bcconnected = true;
    broadcastBcPeerId(this);
    const encoderSync = createEncoder();
    writeVarUint(encoderSync, messageSync);
    writeSyncStep1(encoderSync, this.doc);
    broadcastBcMessage(this, toUint8Array(encoderSync));
    const encoderState = createEncoder();
    writeVarUint(encoderState, messageSync);
    writeSyncStep2(encoderState, this.doc);
    broadcastBcMessage(this, toUint8Array(encoderState));
    const encoderAwarenessQuery = createEncoder();
    writeVarUint(encoderAwarenessQuery, messageQueryAwareness);
    broadcastBcMessage(this, toUint8Array(encoderAwarenessQuery));
    const encoderAwarenessState = createEncoder();
    writeVarUint(encoderAwarenessState, messageAwareness);
    writeVarUint8Array(encoderAwarenessState, encodeAwarenessUpdate(this.awareness, [this.doc.clientID]));
    broadcastBcMessage(this, toUint8Array(encoderAwarenessState));
  }
  disconnect() {
    signalingConns.forEach((conn) => {
      if (conn.connected) {
        conn.send({ type: "unsubscribe", topics: [this.name] });
      }
    });
    removeAwarenessStates(this.awareness, [this.doc.clientID], "disconnect");
    const encoderPeerIdBc = createEncoder();
    writeVarUint(encoderPeerIdBc, messageBcPeerId);
    writeUint8(encoderPeerIdBc, 0);
    writeVarString(encoderPeerIdBc, this.peerId);
    broadcastBcMessage(this, toUint8Array(encoderPeerIdBc));
    unsubscribe(this.name, this._bcSubscriber);
    this.bcconnected = false;
    this.doc.off("update", this._docUpdateHandler);
    this.awareness.off("update", this._awarenessUpdateHandler);
    this.webrtcConns.forEach((conn) => conn.destroy());
  }
  destroy() {
    this.disconnect();
    if (typeof window !== "undefined") {
      window.removeEventListener("beforeunload", this._beforeUnloadHandler);
    } else if (typeof process !== "undefined") {
      process.off("exit", this._beforeUnloadHandler);
    }
  }
}
const openRoom = (doc2, provider, name, key) => {
  if (rooms.has(name)) {
    throw create$3(`A Yjs Doc connected to room "${name}" already exists!`);
  }
  const room = new Room(doc2, provider, name, key);
  rooms.set(name, room);
  return room;
};
const publishSignalingMessage = (conn, room, data) => {
  if (room.key) {
    encryptJson(data, room.key).then((data2) => {
      conn.send({ type: "publish", topic: room.name, data: toBase64(data2) });
    });
  } else {
    conn.send({ type: "publish", topic: room.name, data });
  }
};
class SignalingConn extends WebsocketClient {
  constructor(url) {
    super(url);
    this.providers = /* @__PURE__ */ new Set();
    this.on("connect", () => {
      log(`connected (${url})`);
      const topics = Array.from(rooms.keys());
      this.send({ type: "subscribe", topics });
      rooms.forEach((room) => publishSignalingMessage(this, room, { type: "announce", from: room.peerId }));
    });
    this.on("message", (m) => {
      switch (m.type) {
        case "publish": {
          const roomName = m.topic;
          const room = rooms.get(roomName);
          if (room == null || typeof roomName !== "string") {
            return;
          }
          const execMessage = (data) => {
            const webrtcConns = room.webrtcConns;
            const peerId = room.peerId;
            if (data == null || data.from === peerId || data.to !== void 0 && data.to !== peerId || room.bcConns.has(data.from)) {
              return;
            }
            const emitPeerChange = webrtcConns.has(data.from) ? () => {
            } : () => room.provider.emit("peers", [{
              removed: [],
              added: [data.from],
              webrtcPeers: Array.from(room.webrtcConns.keys()),
              bcPeers: Array.from(room.bcConns)
            }]);
            switch (data.type) {
              case "announce":
                if (webrtcConns.size < room.provider.maxConns) {
                  setIfUndefined(webrtcConns, data.from, () => new WebrtcConn(this, true, data.from, room));
                  emitPeerChange();
                }
                break;
              case "signal":
                if (data.to === peerId) {
                  setIfUndefined(webrtcConns, data.from, () => new WebrtcConn(this, false, data.from, room)).peer.signal(data.signal);
                  emitPeerChange();
                }
                break;
            }
          };
          if (room.key) {
            if (typeof m.data === "string") {
              decryptJson(fromBase64(m.data), room.key).then(execMessage);
            }
          } else {
            execMessage(m.data);
          }
        }
      }
    });
    this.on("disconnect", () => log(`disconnect (${url})`));
  }
}
class WebrtcProvider extends Observable {
  constructor(roomName, doc2, {
    signaling = ["wss://signaling.yjs.dev", "wss://y-webrtc-signaling-eu.herokuapp.com", "wss://y-webrtc-signaling-us.herokuapp.com"],
    password = null,
    awareness = new Awareness(doc2),
    maxConns = 20 + floor(rand() * 15),
    filterBcConns = true,
    peerOpts = {}
  } = {}) {
    super();
    this.roomName = roomName;
    this.doc = doc2;
    this.filterBcConns = filterBcConns;
    this.awareness = awareness;
    this.shouldConnect = false;
    this.signalingUrls = signaling;
    this.signalingConns = [];
    this.maxConns = maxConns;
    this.peerOpts = peerOpts;
    this.key = password ? deriveKey(password, roomName) : resolve(null);
    this.room = null;
    this.key.then((key) => {
      this.room = openRoom(doc2, this, roomName, key);
      if (this.shouldConnect) {
        this.room.connect();
      } else {
        this.room.disconnect();
      }
    });
    this.connect();
    this.destroy = this.destroy.bind(this);
    doc2.on("destroy", this.destroy);
  }
  get connected() {
    return this.room !== null && this.shouldConnect;
  }
  connect() {
    this.shouldConnect = true;
    this.signalingUrls.forEach((url) => {
      const signalingConn = setIfUndefined(signalingConns, url, () => new SignalingConn(url));
      this.signalingConns.push(signalingConn);
      signalingConn.providers.add(this);
    });
    if (this.room) {
      this.room.connect();
    }
  }
  disconnect() {
    this.shouldConnect = false;
    this.signalingConns.forEach((conn) => {
      conn.providers.delete(this);
      if (conn.providers.size === 0) {
        conn.destroy();
        signalingConns.delete(conn.url);
      }
    });
    if (this.room) {
      this.room.disconnect();
    }
  }
  destroy() {
    this.doc.off("destroy", this.destroy);
    this.key.then(() => {
      this.room.destroy();
      rooms.delete(this.roomName);
    });
    super.destroy();
  }
}
var _Vec = class {
  static clamp(n, min2, max2) {
    return Math.max(min2, typeof max2 !== "undefined" ? Math.min(n, max2) : n);
  }
  static clampV(A, min2, max2) {
    return A.map((n) => max2 ? _Vec.clamp(n, min2, max2) : _Vec.clamp(n, min2));
  }
  static cross(x, y, z) {
    return (y[0] - x[0]) * (z[1] - x[1]) - (z[0] - x[0]) * (y[1] - x[1]);
  }
  static snap(a, step = 1) {
    return [Math.round(a[0] / step) * step, Math.round(a[1] / step) * step];
  }
};
var Vec = _Vec;
Vec.neg = (A) => {
  return [-A[0], -A[1]];
};
Vec.add = (A, B) => {
  return [A[0] + B[0], A[1] + B[1]];
};
Vec.addScalar = (A, n) => {
  return [A[0] + n, A[1] + n];
};
Vec.sub = (A, B) => {
  return [A[0] - B[0], A[1] - B[1]];
};
Vec.subScalar = (A, n) => {
  return [A[0] - n, A[1] - n];
};
Vec.vec = (A, B) => {
  return [B[0] - A[0], B[1] - A[1]];
};
Vec.mul = (A, n) => {
  return [A[0] * n, A[1] * n];
};
Vec.mulV = (A, B) => {
  return [A[0] * B[0], A[1] * B[1]];
};
Vec.div = (A, n) => {
  return [A[0] / n, A[1] / n];
};
Vec.divV = (A, B) => {
  return [A[0] / B[0], A[1] / B[1]];
};
Vec.per = (A) => {
  return [A[1], -A[0]];
};
Vec.dpr = (A, B) => {
  return A[0] * B[0] + A[1] * B[1];
};
Vec.cpr = (A, B) => {
  return A[0] * B[1] - B[0] * A[1];
};
Vec.len2 = (A) => {
  return A[0] * A[0] + A[1] * A[1];
};
Vec.len = (A) => {
  return Math.hypot(A[0], A[1]);
};
Vec.pry = (A, B) => {
  return _Vec.dpr(A, B) / _Vec.len(B);
};
Vec.uni = (A) => {
  return _Vec.div(A, _Vec.len(A));
};
Vec.normalize = (A) => {
  return _Vec.uni(A);
};
Vec.tangent = (A, B) => {
  return _Vec.uni(_Vec.sub(A, B));
};
Vec.dist2 = (A, B) => {
  return _Vec.len2(_Vec.sub(A, B));
};
Vec.dist = (A, B) => {
  return Math.hypot(A[1] - B[1], A[0] - B[0]);
};
Vec.fastDist = (A, B) => {
  const V = [B[0] - A[0], B[1] - A[1]];
  const aV = [Math.abs(V[0]), Math.abs(V[1])];
  let r = 1 / Math.max(aV[0], aV[1]);
  r = r * (1.29289 - (aV[0] + aV[1]) * r * 0.29289);
  return [V[0] * r, V[1] * r];
};
Vec.ang = (A, B) => {
  return Math.atan2(_Vec.cpr(A, B), _Vec.dpr(A, B));
};
Vec.angle = (A, B) => {
  return Math.atan2(B[1] - A[1], B[0] - A[0]);
};
Vec.med = (A, B) => {
  return _Vec.mul(_Vec.add(A, B), 0.5);
};
Vec.rot = (A, r = 0) => {
  return [A[0] * Math.cos(r) - A[1] * Math.sin(r), A[0] * Math.sin(r) + A[1] * Math.cos(r)];
};
Vec.rotWith = (A, C, r = 0) => {
  if (r === 0)
    return A;
  const s = Math.sin(r);
  const c = Math.cos(r);
  const px = A[0] - C[0];
  const py = A[1] - C[1];
  const nx = px * c - py * s;
  const ny = px * s + py * c;
  return [nx + C[0], ny + C[1]];
};
Vec.isEqual = (A, B) => {
  return A[0] === B[0] && A[1] === B[1];
};
Vec.lrp = (A, B, t) => {
  return _Vec.add(A, _Vec.mul(_Vec.sub(B, A), t));
};
Vec.int = (A, B, from2, to, s = 1) => {
  const t = (_Vec.clamp(from2, to) - from2) / (to - from2);
  return _Vec.add(_Vec.mul(A, 1 - t), _Vec.mul(B, s));
};
Vec.ang3 = (p1, pc, p2) => {
  const v1 = _Vec.vec(pc, p1);
  const v2 = _Vec.vec(pc, p2);
  return _Vec.ang(v1, v2);
};
Vec.abs = (A) => {
  return [Math.abs(A[0]), Math.abs(A[1])];
};
Vec.rescale = (a, n) => {
  const l = _Vec.len(a);
  return [n * a[0] / l, n * a[1] / l];
};
Vec.isLeft = (p1, pc, p2) => {
  return (pc[0] - p1[0]) * (p2[1] - p1[1]) - (p2[0] - p1[0]) * (pc[1] - p1[1]);
};
Vec.clockwise = (p1, pc, p2) => {
  return _Vec.isLeft(p1, pc, p2) > 0;
};
Vec.toFixed = (a, d = 2) => {
  return a.map((v) => +v.toFixed(d));
};
Vec.nearestPointOnLineThroughPoint = (A, u, P) => {
  return _Vec.add(A, _Vec.mul(u, _Vec.pry(_Vec.sub(P, A), u)));
};
Vec.distanceToLineThroughPoint = (A, u, P) => {
  return _Vec.dist(P, _Vec.nearestPointOnLineThroughPoint(A, u, P));
};
Vec.nearestPointOnLineSegment = (A, B, P, clamp = true) => {
  const u = _Vec.uni(_Vec.sub(B, A));
  const C = _Vec.add(A, _Vec.mul(u, _Vec.pry(_Vec.sub(P, A), u)));
  if (clamp) {
    if (C[0] < Math.min(A[0], B[0]))
      return A[0] < B[0] ? A : B;
    if (C[0] > Math.max(A[0], B[0]))
      return A[0] > B[0] ? A : B;
    if (C[1] < Math.min(A[1], B[1]))
      return A[1] < B[1] ? A : B;
    if (C[1] > Math.max(A[1], B[1]))
      return A[1] > B[1] ? A : B;
  }
  return C;
};
Vec.distanceToLineSegment = (A, B, P, clamp = true) => {
  return _Vec.dist(P, _Vec.nearestPointOnLineSegment(A, B, P, clamp));
};
Vec.nudge = (A, B, d) => {
  if (_Vec.isEqual(A, B))
    return A;
  return _Vec.add(A, _Vec.mul(_Vec.uni(_Vec.sub(B, A)), d));
};
Vec.nudgeAtAngle = (A, a, d) => {
  return [Math.cos(a) * d + A[0], Math.sin(a) * d + A[1]];
};
Vec.toPrecision = (a, n = 4) => {
  return [+a[0].toPrecision(n), +a[1].toPrecision(n)];
};
Vec.pointsBetween = (A, B, steps = 6) => {
  return Array.from(Array(steps)).map((_, i) => {
    const t = i / (steps - 1);
    const k = Math.min(1, 0.5 + Math.abs(0.5 - t));
    return [..._Vec.lrp(A, B, t), k];
  });
};
Vec.slope = (A, B) => {
  if (A[0] === B[0])
    return NaN;
  return (A[1] - B[1]) / (A[0] - B[0]);
};
Vec.max = (...v) => {
  return [Math.max(...v.map((a) => a[0])), Math.max(...v.map((a) => a[1]))];
};
Vec.min = (...v) => {
  return [Math.max(...v.map((a) => a[0])), Math.max(...v.map((a) => a[1]))];
};
var Spline = class {
  constructor(points = []) {
    this.points = [];
    this.lengths = [];
    this.totalLength = 0;
    this.addPoint = (point) => {
      if (this.prev) {
        const length2 = Vec.dist(this.prev, point);
        this.lengths.push(length2);
        this.totalLength += length2;
        this.points.push(point);
      }
      this.prev = point;
    };
    this.clear = () => {
      this.points = this.prev ? [this.prev] : [];
      this.totalLength = 0;
    };
    this.getSplinePoint = (rt) => {
      const { points: points2 } = this;
      const l = points2.length - 1, d = Math.trunc(rt), p1 = Math.min(d + 1, l), p2 = Math.min(p1 + 1, l), p3 = Math.min(p2 + 1, l), p0 = p1 - 1, t = rt - d;
      const tt = t * t, ttt = tt * t, q1 = -ttt + 2 * tt - t, q2 = 3 * ttt - 5 * tt + 2, q3 = -3 * ttt + 4 * tt + t, q4 = ttt - tt;
      return [
        (points2[p0][0] * q1 + points2[p1][0] * q2 + points2[p2][0] * q3 + points2[p3][0] * q4) / 2,
        (points2[p0][1] * q1 + points2[p1][1] * q2 + points2[p2][1] * q3 + points2[p3][1] * q4) / 2
      ];
    };
    this.points = points;
    this.lengths = points.map((point, i, arr) => i === 0 ? 0 : Vec.dist(point, arr[i - 1]));
    this.totalLength = this.lengths.reduce((acc, cur) => acc + cur, 0);
  }
};
var _PerfectCursor = class {
  constructor(cb) {
    this.state = "idle";
    this.queue = [];
    this.timestamp = performance.now();
    this.lastRequestId = 0;
    this.timeoutId = 0;
    this.spline = new Spline();
    this.addPoint = (point) => {
      clearTimeout(this.timeoutId);
      const now = performance.now();
      const duration = Math.min(now - this.timestamp, _PerfectCursor.MAX_INTERVAL);
      if (!this.prevPoint) {
        this.spline.clear();
        this.prevPoint = point;
        this.spline.addPoint(point);
        this.cb(point);
        this.state = "stopped";
        return;
      }
      if (this.state === "stopped") {
        if (Vec.dist(this.prevPoint, point) < 4) {
          this.cb(point);
          return;
        }
        this.spline.clear();
        this.spline.addPoint(this.prevPoint);
        this.spline.addPoint(this.prevPoint);
        this.spline.addPoint(point);
        this.state = "idle";
      } else {
        this.spline.addPoint(point);
      }
      if (duration < 16) {
        this.prevPoint = point;
        this.timestamp = now;
        this.cb(point);
        return;
      }
      const animation = {
        start: this.spline.points.length - 3,
        from: this.prevPoint,
        to: point,
        duration
      };
      this.prevPoint = point;
      this.timestamp = now;
      switch (this.state) {
        case "idle": {
          this.state = "animating";
          this.animateNext(animation);
          break;
        }
        case "animating": {
          this.queue.push(animation);
          break;
        }
      }
    };
    this.animateNext = (animation) => {
      const start = performance.now();
      const loop = () => {
        const t = (performance.now() - start) / animation.duration;
        if (t <= 1 && this.spline.points.length > 0) {
          try {
            this.cb(this.spline.getSplinePoint(t + animation.start));
          } catch (e) {
            console.warn(e);
          }
          this.lastRequestId = requestAnimationFrame(loop);
          return;
        }
        const next = this.queue.shift();
        if (next) {
          this.state = "animating";
          this.animateNext(next);
        } else {
          this.state = "idle";
          this.timeoutId = setTimeout(() => {
            this.state = "stopped";
          }, _PerfectCursor.MAX_INTERVAL);
        }
      };
      loop();
    };
    this.dispose = () => {
      clearTimeout(this.timeoutId);
    };
    this.cb = cb;
  }
};
var PerfectCursor = _PerfectCursor;
PerfectCursor.MAX_INTERVAL = 300;
let nanoid = (size = 21) => crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
  byte &= 63;
  if (byte < 36) {
    id += byte.toString(36);
  } else if (byte < 62) {
    id += (byte - 26).toString(36).toUpperCase();
  } else if (byte > 62) {
    id += "-";
  } else {
    id += "_";
  }
  return id;
}, "");
var randomColor = { exports: {} };
(function(module, exports) {
  (function(root, factory) {
    {
      var randomColor2 = factory();
      if (module && module.exports) {
        exports = module.exports = randomColor2;
      }
      exports.randomColor = randomColor2;
    }
  })(commonjsGlobal, function() {
    var seed = null;
    var colorDictionary = {};
    loadColorBounds();
    var colorRanges = [];
    var randomColor2 = function(options) {
      options = options || {};
      if (options.seed !== void 0 && options.seed !== null && options.seed === parseInt(options.seed, 10)) {
        seed = options.seed;
      } else if (typeof options.seed === "string") {
        seed = stringToInteger(options.seed);
      } else if (options.seed !== void 0 && options.seed !== null) {
        throw new TypeError("The seed value must be an integer or string");
      } else {
        seed = null;
      }
      var H, S, B;
      if (options.count !== null && options.count !== void 0) {
        var totalColors = options.count, colors = [];
        for (var i = 0; i < options.count; i++) {
          colorRanges.push(false);
        }
        options.count = null;
        while (totalColors > colors.length) {
          var color = randomColor2(options);
          if (seed !== null) {
            options.seed = seed;
          }
          colors.push(color);
        }
        options.count = totalColors;
        return colors;
      }
      H = pickHue(options);
      S = pickSaturation(H, options);
      B = pickBrightness(H, S, options);
      return setFormat([H, S, B], options);
    };
    function pickHue(options) {
      if (colorRanges.length > 0) {
        var hueRange = getRealHueRange(options.hue);
        var hue = randomWithin(hueRange);
        var step = (hueRange[1] - hueRange[0]) / colorRanges.length;
        var j = parseInt((hue - hueRange[0]) / step);
        if (colorRanges[j] === true) {
          j = (j + 2) % colorRanges.length;
        } else {
          colorRanges[j] = true;
        }
        var min2 = (hueRange[0] + j * step) % 359, max2 = (hueRange[0] + (j + 1) * step) % 359;
        hueRange = [min2, max2];
        hue = randomWithin(hueRange);
        if (hue < 0) {
          hue = 360 + hue;
        }
        return hue;
      } else {
        var hueRange = getHueRange(options.hue);
        hue = randomWithin(hueRange);
        if (hue < 0) {
          hue = 360 + hue;
        }
        return hue;
      }
    }
    function pickSaturation(hue, options) {
      if (options.hue === "monochrome") {
        return 0;
      }
      if (options.luminosity === "random") {
        return randomWithin([0, 100]);
      }
      var saturationRange = getSaturationRange(hue);
      var sMin = saturationRange[0], sMax = saturationRange[1];
      switch (options.luminosity) {
        case "bright":
          sMin = 55;
          break;
        case "dark":
          sMin = sMax - 10;
          break;
        case "light":
          sMax = 55;
          break;
      }
      return randomWithin([sMin, sMax]);
    }
    function pickBrightness(H, S, options) {
      var bMin = getMinimumBrightness(H, S), bMax = 100;
      switch (options.luminosity) {
        case "dark":
          bMax = bMin + 20;
          break;
        case "light":
          bMin = (bMax + bMin) / 2;
          break;
        case "random":
          bMin = 0;
          bMax = 100;
          break;
      }
      return randomWithin([bMin, bMax]);
    }
    function setFormat(hsv, options) {
      switch (options.format) {
        case "hsvArray":
          return hsv;
        case "hslArray":
          return HSVtoHSL(hsv);
        case "hsl":
          var hsl = HSVtoHSL(hsv);
          return "hsl(" + hsl[0] + ", " + hsl[1] + "%, " + hsl[2] + "%)";
        case "hsla":
          var hslColor = HSVtoHSL(hsv);
          var alpha = options.alpha || Math.random();
          return "hsla(" + hslColor[0] + ", " + hslColor[1] + "%, " + hslColor[2] + "%, " + alpha + ")";
        case "rgbArray":
          return HSVtoRGB(hsv);
        case "rgb":
          var rgb = HSVtoRGB(hsv);
          return "rgb(" + rgb.join(", ") + ")";
        case "rgba":
          var rgbColor = HSVtoRGB(hsv);
          var alpha = options.alpha || Math.random();
          return "rgba(" + rgbColor.join(", ") + ", " + alpha + ")";
        default:
          return HSVtoHex(hsv);
      }
    }
    function getMinimumBrightness(H, S) {
      var lowerBounds = getColorInfo(H).lowerBounds;
      for (var i = 0; i < lowerBounds.length - 1; i++) {
        var s1 = lowerBounds[i][0], v1 = lowerBounds[i][1];
        var s2 = lowerBounds[i + 1][0], v2 = lowerBounds[i + 1][1];
        if (S >= s1 && S <= s2) {
          var m = (v2 - v1) / (s2 - s1), b = v1 - m * s1;
          return m * S + b;
        }
      }
      return 0;
    }
    function getHueRange(colorInput) {
      if (typeof parseInt(colorInput) === "number") {
        var number = parseInt(colorInput);
        if (number < 360 && number > 0) {
          return [number, number];
        }
      }
      if (typeof colorInput === "string") {
        if (colorDictionary[colorInput]) {
          var color = colorDictionary[colorInput];
          if (color.hueRange) {
            return color.hueRange;
          }
        } else if (colorInput.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)) {
          var hue = HexToHSB(colorInput)[0];
          return [hue, hue];
        }
      }
      return [0, 360];
    }
    function getSaturationRange(hue) {
      return getColorInfo(hue).saturationRange;
    }
    function getColorInfo(hue) {
      if (hue >= 334 && hue <= 360) {
        hue -= 360;
      }
      for (var colorName in colorDictionary) {
        var color = colorDictionary[colorName];
        if (color.hueRange && hue >= color.hueRange[0] && hue <= color.hueRange[1]) {
          return colorDictionary[colorName];
        }
      }
      return "Color not found";
    }
    function randomWithin(range) {
      if (seed === null) {
        var golden_ratio = 0.618033988749895;
        var r = Math.random();
        r += golden_ratio;
        r %= 1;
        return Math.floor(range[0] + r * (range[1] + 1 - range[0]));
      } else {
        var max2 = range[1] || 1;
        var min2 = range[0] || 0;
        seed = (seed * 9301 + 49297) % 233280;
        var rnd = seed / 233280;
        return Math.floor(min2 + rnd * (max2 - min2));
      }
    }
    function HSVtoHex(hsv) {
      var rgb = HSVtoRGB(hsv);
      function componentToHex(c) {
        var hex2 = c.toString(16);
        return hex2.length == 1 ? "0" + hex2 : hex2;
      }
      var hex = "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
      return hex;
    }
    function defineColor(name, hueRange, lowerBounds) {
      var sMin = lowerBounds[0][0], sMax = lowerBounds[lowerBounds.length - 1][0], bMin = lowerBounds[lowerBounds.length - 1][1], bMax = lowerBounds[0][1];
      colorDictionary[name] = {
        hueRange,
        lowerBounds,
        saturationRange: [sMin, sMax],
        brightnessRange: [bMin, bMax]
      };
    }
    function loadColorBounds() {
      defineColor("monochrome", null, [[0, 0], [100, 0]]);
      defineColor("red", [-26, 18], [[20, 100], [30, 92], [40, 89], [50, 85], [60, 78], [70, 70], [80, 60], [90, 55], [100, 50]]);
      defineColor("orange", [18, 46], [[20, 100], [30, 93], [40, 88], [50, 86], [60, 85], [70, 70], [100, 70]]);
      defineColor("yellow", [46, 62], [[25, 100], [40, 94], [50, 89], [60, 86], [70, 84], [80, 82], [90, 80], [100, 75]]);
      defineColor("green", [62, 178], [[30, 100], [40, 90], [50, 85], [60, 81], [70, 74], [80, 64], [90, 50], [100, 40]]);
      defineColor("blue", [178, 257], [[20, 100], [30, 86], [40, 80], [50, 74], [60, 60], [70, 52], [80, 44], [90, 39], [100, 35]]);
      defineColor("purple", [257, 282], [[20, 100], [30, 87], [40, 79], [50, 70], [60, 65], [70, 59], [80, 52], [90, 45], [100, 42]]);
      defineColor("pink", [282, 334], [[20, 100], [30, 90], [40, 86], [60, 84], [80, 80], [90, 75], [100, 73]]);
    }
    function HSVtoRGB(hsv) {
      var h = hsv[0];
      if (h === 0) {
        h = 1;
      }
      if (h === 360) {
        h = 359;
      }
      h = h / 360;
      var s = hsv[1] / 100, v = hsv[2] / 100;
      var h_i = Math.floor(h * 6), f = h * 6 - h_i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s), r = 256, g = 256, b = 256;
      switch (h_i) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        case 5:
          r = v;
          g = p;
          b = q;
          break;
      }
      var result = [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
      return result;
    }
    function HexToHSB(hex) {
      hex = hex.replace(/^#/, "");
      hex = hex.length === 3 ? hex.replace(/(.)/g, "$1$1") : hex;
      var red = parseInt(hex.substr(0, 2), 16) / 255, green = parseInt(hex.substr(2, 2), 16) / 255, blue = parseInt(hex.substr(4, 2), 16) / 255;
      var cMax = Math.max(red, green, blue), delta = cMax - Math.min(red, green, blue), saturation = cMax ? delta / cMax : 0;
      switch (cMax) {
        case red:
          return [60 * ((green - blue) / delta % 6) || 0, saturation, cMax];
        case green:
          return [60 * ((blue - red) / delta + 2) || 0, saturation, cMax];
        case blue:
          return [60 * ((red - green) / delta + 4) || 0, saturation, cMax];
      }
    }
    function HSVtoHSL(hsv) {
      var h = hsv[0], s = hsv[1] / 100, v = hsv[2] / 100, k = (2 - s) * v;
      return [
        h,
        Math.round(s * v / (k < 1 ? k : 2 - k) * 1e4) / 100,
        k / 2 * 100
      ];
    }
    function stringToInteger(string) {
      var total = 0;
      for (var i = 0; i !== string.length; i++) {
        if (total >= Number.MAX_SAFE_INTEGER)
          break;
        total += string.charCodeAt(i);
      }
      return total;
    }
    function getRealHueRange(colorHue) {
      if (!isNaN(colorHue)) {
        var number = parseInt(colorHue);
        if (number < 360 && number > 0) {
          return getColorInfo(colorHue).hueRange;
        }
      } else if (typeof colorHue === "string") {
        if (colorDictionary[colorHue]) {
          var color = colorDictionary[colorHue];
          if (color.hueRange) {
            return color.hueRange;
          }
        } else if (colorHue.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)) {
          var hue = HexToHSB(colorHue)[0];
          return getColorInfo(hue).hueRange;
        }
      }
      return [0, 360];
    }
    return randomColor2;
  });
})(randomColor, randomColor.exports);
var randomcolor = randomColor.exports;
function getSvgForCursor(color) {
  return `<svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="13 9 35 35"
      width="36"
      height="36"
      fill="none"
      fillRule="evenodd"
    >
      <g fill="rgba(0,0,0,.2)" transform="translate(1,1)">
        <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
        <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
      </g>
      <g fill="white">
        <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
        <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
      </g>
      <g fill="${color}">
        <path d="m19.751 24.4155-1.844.774-3.1-7.374 1.841-.775z" />
        <path d="m13 10.814v11.188l2.969-2.866.428-.139h4.768z" />
      </g>
    </svg>`;
}
function defaultCursorRenderer(cursor) {
  const htmlFragment = `<div id="cursor_${cursor.id}" class="cursor">
    ${getSvgForCursor(cursor.color)}
    <p id="chat_${cursor.id}" class="chat" style="background-color: ${cursor.color}">${cursor.chat}</p>
  </div>`;
  const template = document.createElement("template");
  template.innerHTML = htmlFragment;
  const cursorEl = template.content.firstChild;
  return cursorEl;
}
const DefaultConfig = {
  triggerKey: "/",
  cursorDivId: "cursor-chat-layer",
  chatDivId: "cursor-chat-box",
  userMetaData: {},
  renderCursor: defaultCursorRenderer,
  yDoc: void 0,
  color: void 0,
  shouldChangeUserCursor: void 0
};
const symbols = /[\r\n%#()<>?[\\\]^`{|}]/g;
function encodeSVG(svgData) {
  svgData = svgData.replace(/"/g, `'`);
  svgData = svgData.replace(/>\s{1,}</g, `><`);
  svgData = svgData.replace(/\s{2,}/g, ` `);
  return svgData.replace(symbols, encodeURIComponent);
}
const initCursorChat = (room_id = `cursor-chat-room-${window.location.host + window.location.pathname}`, config = {}) => {
  const {
    triggerKey,
    cursorDivId,
    chatDivId,
    userMetaData,
    renderCursor,
    color,
    yDoc,
    shouldChangeUserCursor
  } = __spreadValues(__spreadValues({}, DefaultConfig), config);
  const cursorDiv = document.getElementById(cursorDivId);
  const chatDiv = document.getElementById(chatDivId);
  if (!cursorDiv || !chatDiv) {
    throw `Couldn't find cursor-chat-related divs! Make sure DOM content is fully loaded before initializing`;
  }
  const me = {
    id: nanoid(),
    x: 0,
    y: 0,
    chat: "",
    color: color != null ? color : randomcolor(),
    userMetaData
  };
  let doc2;
  let provider;
  if (yDoc !== void 0) {
    doc2 = yDoc;
  } else {
    doc2 = new Doc();
    provider = new WebrtcProvider(room_id, doc2, {
      signaling: [
        "wss://signalling.communities.digital",
        "wss://signaling.yjs.dev",
        "wss://y-webrtc-signaling-eu.herokuapp.com"
      ]
    });
  }
  const others = doc2.getMap("state");
  let sendUpdate = false;
  if (shouldChangeUserCursor) {
    const userCursorSvgEncoded = encodeSVG(getSvgForCursor(me.color));
    document.documentElement.style.cursor = `url("data:image/svg+xml,${userCursorSvgEncoded}"), auto`;
  }
  const cleanup = () => {
    others.delete(me.id);
    provider == null ? void 0 : provider.destroy();
  };
  addEventListener("beforeunload", cleanup);
  setInterval(() => {
    if (sendUpdate) {
      others.set(me.id, me);
      sendUpdate = false;
    }
  }, 80);
  document.onmousemove = (evt) => {
    if (me.x !== evt.pageX && me.y !== evt.pageY) {
      sendUpdate = true;
      me.x = evt.pageX;
      me.y = evt.pageY;
      chatDiv.style.setProperty("transform", `translate(${me.x}px, ${me.y}px)`);
    }
  };
  document.addEventListener("keydown", (event) => {
    if (event.key === triggerKey) {
      if (chatDiv.style.getPropertyValue("display") === "block" && chatDiv.value === "") {
        event.preventDefault();
        chatDiv.style.setProperty("display", "none");
      } else {
        event.preventDefault();
        chatDiv.style.setProperty("display", "block");
        chatDiv.focus();
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      chatDiv.value = "";
      chatDiv.style.setProperty("display", "none");
    } else if (event.key === "Enter") {
      event.preventDefault();
    }
  });
  document.addEventListener("keyup", () => {
    me.chat = chatDiv.value;
    sendUpdate = true;
  });
  const cursor_interp = /* @__PURE__ */ new Map();
  others.observe((evt) => {
    const updated_cursors = evt.changes.keys;
    updated_cursors.forEach((change, cursor_id) => {
      if (cursor_id !== me.id) {
        switch (change.action) {
          case "add":
            const new_cursor = others.get(cursor_id);
            const new_cursor_div = renderCursor(new_cursor);
            new_cursor_div.classList.add("new");
            cursorDiv.appendChild(new_cursor_div);
            const add_point_closure = ([x, y]) => new_cursor_div.style.setProperty("transform", `translate(${x}px, ${y}px)`);
            const perfect_cursor = new PerfectCursor(add_point_closure);
            perfect_cursor.addPoint([new_cursor.x, new_cursor.y]);
            cursor_interp.set(cursor_id, perfect_cursor);
            break;
          case "update":
            const updated_cursor = others.get(cursor_id);
            const updated_cursor_div = document.getElementById(`cursor_${cursor_id}`);
            const updated_chat_div = document.getElementById(`chat_${cursor_id}`);
            if (updated_cursor.chat === "") {
              updated_chat_div.classList.remove("show");
            } else {
              updated_chat_div.classList.add("show");
            }
            updated_chat_div.innerText = updated_cursor.chat;
            updated_cursor_div.classList.remove("new");
            cursor_interp.get(cursor_id).addPoint([updated_cursor.x, updated_cursor.y]);
            break;
          case "delete":
            const old_cursor_div = document.getElementById(`cursor_${cursor_id}`);
            old_cursor_div.classList.add("expiring");
            setTimeout(() => {
              old_cursor_div.remove();
              cursor_interp.delete(cursor_id);
            }, 1e3);
            break;
        }
      }
    });
  });
  return cleanup;
};
export { DefaultConfig, defaultCursorRenderer, initCursorChat };
