import crypto from 'crypto-js'; 
import dotenv from 'dotenv';
dotenv.config();

const secretKey  = process.env.REACT_APP_SECRETKEY;

const encrypt = (number) => {
    return crypto.AES.encrypt(number, secretKey);
}

const decrypt = (encryptNumber) => {
    return crypto.AES.decrypt(encryptNumber, secretKey);
}

export {
    encrypt,
    decrypt
};