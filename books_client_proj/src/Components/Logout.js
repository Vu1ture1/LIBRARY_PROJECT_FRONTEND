import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import { getDecodedToken } from '../CookieWork/DecryptCookieAndRetToken';
import axios from '../api/axios';

const LOGOUT_URL = "user/logout"

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (getDecodedToken() !== null) {
            const cookies = new Cookies();
            
            const getBook = async () => {
                
                let response = null;

                try{
                    response = await axios.post(`${LOGOUT_URL}`, {}, { withCredentials: true });

                    console.log(response.data.message);

                    cookies.remove('access_token', { path: '/' });
                }
                catch(err)
                {
                    if(!err?.response)
                    {
                        cookies.remove('access_token', { path: '/' });
                    }
                }
            };

            getBook();
            
            navigate('/books'); 
        }
    }, [navigate]);

    return (
        <></>
    );
};

export default Logout;