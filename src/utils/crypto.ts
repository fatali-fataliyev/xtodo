import "react-native-get-random-values";

import CryptoJS from "crypto-js";

export const generateAESKey = () => {
  return CryptoJS.lib.WordArray.random(32).toString();
};

export const encryptAES256 = (data: string, secretKey: string) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

export const decryptAES256 = (ciphertext: string, secretKey: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
