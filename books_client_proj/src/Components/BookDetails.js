import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import axios from '../api/axios';
import Pagination from "react-bootstrap/Pagination";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Alert } from "react-bootstrap";
import "./ComponentsStyles/button_style.css"
import { getUserRole } from '../CookieWork/DecryptCookieAndRetToken';

class Author {
    constructor(id, name, surname, bornDate, country) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.bornDate = new Date(bornDate);
        this.country = country;
    }
}

class Book {
    constructor(id, isbn, name, genre, description, author, borrowedAt, returnBy, userThatGetBook, image) {
        this.id = id;
        this.isbn = isbn;
        this.name = name;
        this.genre = genre;
        this.description = description;
        this.book_author = new Author(
            author.id, author.name, author.surname, author.bornDate, author.counry
        );
        this.borrowedAt = new Date(borrowedAt);
        this.returnBy = new Date(returnBy);
        this.userThatGetBook = userThatGetBook;
        this.image = image;
    }
}

const GET_B_URL = "books/";
const IMAGE_URL = "https://localhost:7002/Resources/";

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [role, setRole] = useState(null);
    const [bookUpdated, setBookUpdated] = useState(false);

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const giveBook = async (book_id) => {
        const controller = new AbortController();

        try {
            const response = await axiosPrivate.get(`books/onhand/${book_id}`, {
                signal: controller.signal
            });

            setBookUpdated(prev => !prev);
        } catch (err) {
            console.error(err);
            navigate('/login');
        }
    }

    const changeBook = async (book) => {
        navigate('/change',  { state: { book } });
    }

    useEffect(() => {
            setRole(getUserRole());
            
            const getBook = async () => {
                
                let response = null;
                
                try {
                    response = await axios.get(`${GET_B_URL}${id}`);
                    
                    const book = new Book(
                        response.data.id,
                        response.data.isbn,
                        response.data.name,
                        response.data.genre,
                        response.data.description,
                        response.data.book_author,
                        response.data.borrowedAt,
                        response.data.returnBy,
                        response.data.userThatGetBook,
                        response.data.image
                    );
                    
                    setBook(book);
                    console.log(book);
                } catch (err) {
                    
                    if (err.response?.status === 404) {
                        setBook(null);
                    }
                }
            };
    
            getBook();
    
        }, [id, bookUpdated, navigate, location]);

    return (
        book != null ? (<div style={{ marginTop: "20px", marginLeft: '10px', marginRight: '10px', marginBottom: "10px", display: 'grid',  gap: '20px' }}>
            <div style={{marginTop: "10px"}} className="d-flex justify-content-center">
                <h4>Подробности книги:</h4>
            </div>

            <div style={{marginTop: "10px", marginBottom: "10px"}} className="d-flex justify-content-center">
                 <Card style={{ width: '50%', height: 'auto' }}>
                     <Card.Img 
                         variant="top" 
                         src={`${IMAGE_URL}${book.image}`}
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                     />
                     <Card.Body>
                         <Card.Title>{book.name}<br/><br/></Card.Title>
                         <Card.Text>
                            <span>Автор: {book.book_author.name} {book.book_author.surname}</span><br/>
                            <span>Страна автора: {book.book_author.country}</span><br/>
                            <span>Дата рождения автора: {book.book_author.bornDate.toISOString().split('T')[0]}</span><br/><br/>
                            <span>Жанр: {book.genre}</span><br/><br/>
                            <span>Международный книжный номер: {book.isbn}</span><br/><br/>
                            <span>Описание: {book.description}</span><br/><br/>
 
                            {(book.userThatGetBook !== 0) && (
                               <><span>Дата возврата книги: {book.returnBy.toISOString().split('T')[0]}</span><br/></>
                            )}

                            {(role !== null) && (book.userThatGetBook === 0) && (
                                <Button style={{marginTop: "20px"}} variant="warning" size="sm" onClick={() => giveBook(book.id)}>Взять книгу</Button>
                            )}

                            {(role === "Admin") && (
                                <Button style={{marginTop: "20px", marginLeft: "10px"}} variant="primary" size="sm" onClick={() => changeBook(book)}>Изменить</Button>
                            )}
                         </Card.Text>
                     </Card.Body>
                 </Card>
             </div>
         </div>
        ) : (
            <div style={{marginTop: "20px"}} className="d-flex justify-content-center">
                <h4>Книги с таким id не существует.</h4>
            </div>
        ) 
    );
}

export default BookDetails;