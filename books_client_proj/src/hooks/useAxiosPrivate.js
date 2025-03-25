import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { Cookies } from 'react-cookie';
import getTokenFromCookie from '../CookieWork/DecryptCookieAndRetToken';
import saveTokenToCookie from '../CookieWork/EncryptTokenAndSave';
import { useNavigate } from "react-router-dom";


const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const navigate = useNavigate();
    
    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${getTokenFromCookie()}`;
                }
                //console.log("Request config:", config);
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
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
                        return axiosPrivate(prevRequest);
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
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [refresh])

    return axiosPrivate;
}

export default useAxiosPrivate;