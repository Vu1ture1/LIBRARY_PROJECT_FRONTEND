import CryptoJS from 'crypto-js';
import { Cookies } from 'react-cookie';

import secretKey from "./CryptKey"

const encryptToken = (accessToken) => {
    return CryptoJS.AES.encrypt(JSON.stringify(accessToken), secretKey).toString();
};


const saveTokenToCookie = (accessToken) => {
    try {
        //console.log("Original Token:", accessToken);

        const encrypted = encryptToken(accessToken);
        //console.log("Encrypted Token:", encrypted);

        const cookies = new Cookies();

        const tenYearsFromNow = new Date();
        tenYearsFromNow.setFullYear(tenYearsFromNow.getFullYear() + 10);
        
        cookies.set('access_token', encrypted, {
            path: '/',
            secure: false,
            sameSite: 'Strict',
            expires: tenYearsFromNow
        });

        //console.log("Token saved successfully!");

    } catch (error) {
        console.error("Ошибка при сохранении токена в куки:", error);
    }
};

export default saveTokenToCookie;