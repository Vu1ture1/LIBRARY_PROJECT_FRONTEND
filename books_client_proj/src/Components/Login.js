import { useRef, useState, useEffect } from 'react';
import axios from '../api/axios';
import {Link, useNavigate} from 'react-router-dom';
import { Alert } from "react-bootstrap";

import "./ComponentsStyles/Register.css"
import "./ComponentsStyles/input_style.css"
import "./ComponentsStyles/button_style.css"

import saveTokenToCookie from '../CookieWork/EncryptTokenAndSave'

const LOGIN_URL = 'user/login';

const Login = () => {

    const navigate = useNavigate();

    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    
    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    

    useEffect(() => {
        setErrMsg(''); 
    }, [email, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            const accessToken = response?.data?.accessToken;
            
            console.log({ accessToken });

            saveTokenToCookie(accessToken);

            setEmail('');
            setPwd('');

            navigate("/books");
        } catch (err) {
            
            if (err.response?.status === 401) {
                setErrMsg(err.response.data.error);
            }
            else if (err.response?.status === 408) {
                setErrMsg('Сервер не slrnlsir.');
            } 
            else if (!err?.response) {
                setErrMsg('Сервер не отвечает.');
            } 
            else {
                setErrMsg('Ошибка входа.');
            }
            errRef.current?.focus();
        }
    }

    return (
        


        <div className="container">
        <h2 style={{marginBottom: "25px"}}>Вход в аккаунт</h2>

        <form style={{ width: "65%"}} onSubmit={handleSubmit}>
        
            
            <div className="input-wrapper" style={{marginBottom: "15px"}}>
                <Alert 
                    ref={errRef} 
                    variant="danger" 
                    className={errMsg ? "errmsg" : "offscreen"} 
                    style={{ width: "inherit", whiteSpace: "normal", display: errMsg ? "block" : "none" }}
                >
                    {errMsg}
                </Alert>
                
                <input
                    type="email"
                    id="Email"
                    placeholder="Введите email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />
            </div>
            
            <div className="input-wrapper" style={{marginBottom: "15px"}}>
                <input
                    type="password"
                    id="Password"
                    placeholder="Введите пароль"
                    onChange={(e) => setPwd(e.target.value)} 
                    value={pwd}    
                    required
                />
            </div>

            <div className="button-wrapper">
                <button className="button_style" type="submit">
                    Войти
                </button>
            </div>   
        </form>

        <p style={{marginTop: "10px"}}>
            Нет аккаунта?&nbsp;
            <a onClick={() => navigate("/register")} href="" style={{textDecoration: "none"}}>Зарегестрироваться</a>
        </p>
        </div>
    );
}

export default Login;