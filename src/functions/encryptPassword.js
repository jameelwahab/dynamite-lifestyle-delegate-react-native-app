import { AES } from "react-native-crypto-js";
import { passwordEncryptionKey } from "../utilities/constants";


export const encryptPassword = (password) => {
  try {

    let enc = AES.encrypt(password, passwordEncryptionKey).toString();
    console.log(enc, "encrypted password");
    return enc;
  } catch (error) {
    console.error("Error in encryptPassword:", error);
    // return null;
  }
};
