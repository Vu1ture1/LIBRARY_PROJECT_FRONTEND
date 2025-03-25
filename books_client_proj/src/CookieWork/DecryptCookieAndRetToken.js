import CryptoJS from 'crypto-js';
import { Cookies } from 'react-cookie';
import secretKey from "./CryptKey"
import { jwtDecode } from 'jwt-decode';

const decryptToken = (encryptedToken) => {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
};

  
const getTokenFromCookie = () => {
    try {
        const cookies = new Cookies();
        const encryptedToken = cookies.get('access_token');

        if (!encryptedToken) {
            console.warn("Кука access_token отсутствует.");
            return null;
        }

        //console.log("Encrypted Token from Cookie:", encryptedToken);
        const decryptedToken = decryptToken(encryptedToken);
        //console.log("Decrypted Token:", decryptedToken);

        return decryptedToken;
    } catch (error) {
        console.error("Ошибка при чтении токена из куки:", error);
        return null;
    }
};
    
export default getTokenFromCookie;

export const getUserRole = () => {
    const token = getTokenFromCookie();
    if(token == null){return null;}

    const decoded_token = jwtDecode(token);
    return decoded_token["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
};
    
export const getDecodedToken = () => {
    const token = getTokenFromCookie();
    if(token == null){return null;}

    const decoded_token = jwtDecode(token);
    return decoded_token;
};
    