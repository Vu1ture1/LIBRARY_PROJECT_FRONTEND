import { axiosPrivateFile } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { Cookies } from 'react-cookie';
import getTokenFromCookie from '../CookieWork/DecryptCookieAndRetToken';
import saveTokenToCookie from '../CookieWork/EncryptTokenAndSave';
import { useNavigate } from "react-router-dom";


const useAxiosPrivateFile = () => {
    const refresh = useRefreshToken();
    const navigate = useNavigate();
    
    useEffect(() => {

        const requestIntercept = axiosPrivateFile.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${getTokenFromCookie()}`;
                }
                //console.log("Request config:", config);
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivateFile.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const cookies = new Cookies();
                    
                    try {
                        const newAccessToken = await refresh();
                        //console.log(newAccessToken);
                        
                        if (!newAccessToken) throw new Error("Refresh failed");
                    
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        cookies.remove('access_token', { path: '/' });
                        saveTokenToCookie(newAccessToken);
                        return axiosPrivateFile(prevRequest);
                    } catch (error) {
                        console.error("Refresh token expired or invalid:", error);
                        cookies.remove('access_token', { path: '/' });
                        navigate("login");
                    }
                }
                
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivateFile.interceptors.request.eject(requestIntercept);
            axiosPrivateFile.interceptors.response.eject(responseIntercept);
        }
    }, [refresh])

    return axiosPrivateFile;
}

export default useAxiosPrivateFile;