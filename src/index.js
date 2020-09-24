//import _ from 'lodash';
import { box, randomBytes } from 'tweetnacl';
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64
} from 'tweetnacl-util';

const newNonce = () => randomBytes(box.nonceLength);
export const generateKeyPair = () => box.keyPair();

export const encrypt = (
    secretOrSharedKey,
    json,
    key
) => {
  const nonce = newNonce();
  const messageUint8 = decodeUTF8(JSON.stringify(json));
  const encrypted = key
      ? box(messageUint8, nonce, key, secretOrSharedKey)
      : box.after(messageUint8, nonce, secretOrSharedKey);

  const fullMessage = new Uint8Array(nonce.length + encrypted.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);

  const base64FullMessage = encodeBase64(fullMessage);
  return base64FullMessage;
};

export const decrypt = (
    secretOrSharedKey,
    messageWithNonce,
    key
) => {
  const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
  const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(
      box.nonceLength,
      messageWithNonce.length
  );

  const decrypted = key
      ? box.open(message, nonce, key, secretOrSharedKey)
      : box.open.after(message, nonce, secretOrSharedKey);

  if (!decrypted) {
    throw new Error('Could not decrypt message');
  }

  const base64DecryptedMessage = encodeUTF8(decrypted);
  return JSON.parse(base64DecryptedMessage);
};

function addDebugOutput (text) {
  const newDiv = document.createElement("div")
  const newContent = document.createTextNode(text);
  newDiv.appendChild(newContent);
  const currentDiv = document.getElementById("debugOutput");
  document.body.insertBefore(newDiv, currentDiv);
}

console.log("Starting.");
const obj = { hello: 'world' };
const keyPair = generateKeyPair();
console.log("Key generated.");
addDebugOutput(encodeBase64(keyPair.publicKey));

const precomputedKeys = box.before(keyPair.publicKey, keyPair.secretKey);
const encrypted = encrypt(precomputedKeys, obj);
const decrypted = decrypt(precomputedKeys, encrypted);
console.log("Crypto done.");

/*
console.log(encodeBase64(precomputedKeys.publicKey));
console.log(encodeBase64(keyPair.secretKey));
console.log(obj);
console.log(encrypted);
console.log(decrypted);
*/

// ------------------------------------------------------------------------

/*
function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());
*/