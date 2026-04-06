/**
 * Utilitaires de chiffrement pour MUNYA.
 * Basé sur Web Crypto API pour le chiffrement local.
 */

export async function generateKeys() {
  const keys = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
  return keys;
}

export async function encryptData(data: string, publicKey: CryptoKey) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    encodedData
  );
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

export async function decryptData(encryptedBase64: string, privateKey: CryptoKey) {
  const encrypted = new Uint8Array(atob(encryptedBase64).split("").map(c => c.charCodeAt(0)));
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    encrypted
  );
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}
