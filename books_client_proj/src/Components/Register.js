import { useRef, useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from "react-bootstrap";

import saveTokenToCookie from '../CookieWork/EncryptTokenAndSave'

import "./ComponentsStyles/Register.css"
import "./ComponentsStyles/input_style.css"
import "./ComponentsStyles/button_style.css"

import axios from '../api/axios';

const EMAIL_REGEX = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const REGISTER_URL = "user/register";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const navigate = useNavigate();

    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setValidEmail(EMAIL_REGEX.test(e.target.value));
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setValidPassword(PWD_REGEX.test(e.target.value));
        setPasswordsMatch(e.target.value === repeatPassword);
    };

    const handleRepeatPasswordChange = (e) => {
        setRepeatPassword(e.target.value);
        setPasswordsMatch(e.target.value === password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validEmail || !validPassword || !passwordsMatch) {
            alert("Пожалуйста, исправьте ошибки в форме!");
            return;
        }
        
        try{
            const response = await axios.post(REGISTER_URL, 
                JSON.stringify({email, password}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // console.log(response.data);
            // console.log(response.accessToken);
            // console.log(response.refreshToken);

            const accessToken = response?.data?.accessToken;
            
            console.log({ accessToken });

            saveTokenToCookie(accessToken);

            setEmail('');
            setValidPassword('');
            setPasswordsMatch('');

            navigate("/books");
        }catch (err) {
            if (err.response?.status === 400) {
                setErrMsg("Ошибка регистрации: " + err.response.data.error);
            }
            else if (!err?.response) {
                setErrMsg('Ошибка регистрации: Сервер не отвечает.');
            }
            else {
                setErrMsg('Ошибка регистрации.');
            }
            errRef.current.focus();
        }
    };

    return (
        <div className="container">
            <h2 style={{marginBottom: "25px"}}>Регистрация</h2>

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
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                    {(!validEmail && email) && (
                        <Alert key="danger" variant="danger" className="mt-2" style={{width: "inherit", whiteSpace: "normal" }}>
                            Некорректный ввод почты.
                        </Alert>
                    )}
                </div>
                
                <div className="input-wrapper" style={{marginBottom: "15px"}}>
                    <input
                        type="password"
                        id="Password"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />

                    {(!validPassword && password) && (
                        <Alert key="danger" variant="danger" className="mt-2" style={{width: "inherit", whiteSpace: "normal" }}>
                            Некорректный пароль. Пароль должен содержать 8-24 символа, 1 заглавную букву, 1 цифру и 1 спец. символ (!@#$%).
                        </Alert>
                    )}
                </div>
                
                <div className="input-wrapper" style={{marginBottom: "20px"}}>
                    <input
                        type="password"
                        placeholder="Повторите пароль"
                        value={repeatPassword}
                        onChange={handleRepeatPasswordChange}
                        required
                    />
                    {(!passwordsMatch && repeatPassword) && (
                        <Alert key="danger" variant="danger" className="mt-2" style={{width: "inherit", whiteSpace: "normal" }}>
                            Пароли в обоих полях не совпадают.
                        </Alert>
                    )}
                </div>

                <div className="button-wrapper">
                    <button className="button_style" type="submit" disabled={!validEmail || !validPassword || !passwordsMatch}>
                        Зарегестрироваться
                    </button>
                </div>   
            </form>

            <p style={{marginTop: "10px"}}>
                Уже зарегестрирован?&nbsp;
                <a onClick={() => navigate("/login")} href="" style={{textDecoration: "none"}}>Войти</a>
            </p>
        </div>
    );
};

export default Register;
