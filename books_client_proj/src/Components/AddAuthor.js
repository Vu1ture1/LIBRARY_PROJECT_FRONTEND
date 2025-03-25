import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import axios from '../api/axios';
import {Button} from "react-bootstrap";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const AUTHORS_ADD_URL = "authors/add";

const AddAuthorPage = () => {

  const [validName, setValidName] = useState(false);
  const [validSurname, setValidSurname] = useState(false);
  const [validCountry, setValidCountry] = useState(false);
  const [validBornDate, setValidBornDate] = useState(false);
  
  const [formData, setFormData] = useState({
    Name: '',
    Surname: '',
    Country: '',
    BornDate: null,
  });

  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();

  const sendChange = async () => {
    const sendData = new FormData();

    sendData.append('name', formData.Name);
    sendData.append('surname', formData.Surname);
    sendData.append('counry', formData.Country);

    sendData.append('bornDate', new Date(formData.BornDate).toISOString());
    
    const controller = new AbortController();

    try {
        const response = await axiosPrivate.post(AUTHORS_ADD_URL, sendData, {
            signal: controller.signal
        });

        navigate(`/books`);
    } catch (err) {
        console.error(err);
        navigate('/login');
    }
  }

    const handleNameChange = (e) => {
        const value = e.target.value;
        const isValid = value.length >= 2 && value.length <= 100; 
        setValidName(isValid);
        setFormData({ ...formData, Name: value });
    };

    const handleSurnameChange = (e) => {
        const value = e.target.value;
        const isValid = value.length >= 2 && value.length <= 100;
        setValidSurname(isValid);
        setFormData({ ...formData, Surname: value });
    };

    const handleCountryChange = (e) => {
        const value = e.target.value;
        const isValid = value.length >= 3 && value.length <= 100;
        setValidCountry(isValid);
        setFormData({ ...formData, Country: value });
    };

    const handleBornDateChange = (e) => {
        const value = e.target.value;
        const isValid = /\d{4}\-\d{2}\-\d{2}$/.test(value);
        console.log(value);
        console.log(formData.BornDate);
        setValidBornDate(isValid);
        setFormData({ ...formData, BornDate: value });
    };

  return (
    <div style={{margin: "20px"}}>
      <Form>
            <Form.Group className="mb-3" controlId="Name">
            <Form.Label>Имя автора:</Form.Label>
            <Form.Control
                type="text"
                placeholder="Например Аркадий"
                value={formData.Name}
                onChange={handleNameChange}
                isInvalid={!validName}
            />
            <Form.Control.Feedback type="invalid">
                Имя дожно содержать от 2 до 100 символов.
            </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="Surname">
            <Form.Label>Фамилия автора:</Form.Label>
            <Form.Control
                type="text"
                placeholder="Например Стругацкий"
                value={formData.Surname}
                onChange={handleSurnameChange}
                isInvalid={!validSurname}
            />
            <Form.Control.Feedback type="invalid">
                Фамилия должна содержать от 2 до 100 символов.
            </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="Country">
            <Form.Label>Страна автора:</Form.Label>
            <Form.Control
                type="text"
                placeholder="Например Беларусь"
                value={formData.Country}
                onChange={handleCountryChange}
                isInvalid={!validCountry}
            />
            <Form.Control.Feedback type="invalid">
                Страна должна содержать от 3 до 100 символов.
            </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="Country">
            <Form.Label>Год рождения автора:</Form.Label>
            <Form.Control
                type="date"
                placeholder="Выбор даты"
                value={formData.BornDate}
                onChange={handleBornDateChange}
                isInvalid={!validBornDate}
            />
            <Form.Control.Feedback type="invalid">
                Неверный формат даты.
            </Form.Control.Feedback>
            </Form.Group>

            {(validSurname === validCountry === validName === validBornDate === true) ? (
                <Button variant="success" onClick={() => sendChange()}>Добавить</Button>
            ) : (
                <Button variant="success" disabled>Добавить</Button>
            )}
        </Form>
    </div>
  );
};

export default AddAuthorPage;