import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { getDecodedToken } from '../CookieWork/DecryptCookieAndRetToken';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

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

const USER_BOOKS = "books/onhand/user";
const IMAGE_URL = "https://localhost:7002/Resources/";

const UserProfile = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const updateToken = async () => {
            const token = getDecodedToken();
            setAccessToken(token);

            const controller = new AbortController();

            try {
                const response = await axiosPrivate.get(USER_BOOKS, {
                    signal: controller.signal
                });
                
                console.log(response);

                const books = response.data.map(item => new Book(
                    item.id,
                    item.isbn,
                    item.name,
                    item.genre,
                    item.description,
                    item.book_author,
                    item.borrowedAt,
                    item.returnBy,
                    item.userThatGetBook,
                    item.image
                ));

                setData(books);
            } catch (err) {
                console.error(err);
                navigate('/login');
            }
        };

        updateToken();
    }, [axiosPrivate, navigate]);

    return (
        <div>
            {accessToken ? (
                <>
                    <div style={{ marginTop: "20px", marginBottom: "20px"}}>
                        <Alert 
                            variant="info" 
                            style={{ width: "50%", margin: "0 auto", whiteSpace: "normal", display: "block"}}
                        >
                            <h4>Личная информация пользователя, {accessToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]}</h4>
                            <h4>Роль пользователя: {accessToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]}</h4>
                        </Alert>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <h3>Все книги полученные пользователем:</h3>
                    </div>

                    
                    {data.length > 0 ? (
                        <div style={{ marginTop: "20px", marginLeft: '10px', marginRight: '10px', marginBottom: "10px", display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                            {data.map((book) => (
                                <div key={book.id}>
                                    <Card style={{ width: '100%', height: '100%' }}>
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

                                            <span>Дата получения книги: {book.borrowedAt.toISOString().split('T')[0]}</span><br/><br/>

                                            <span>Дата сдачи книги: {book.returnBy.toISOString().split('T')[0]}</span><br/>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </div>
                                
                            ))}
                        </div>
                    ) : (
                        <div style={{marginTop: "20px"}} className="d-flex justify-content-center">
                            <h4>Нет книг для отображения</h4>
                        </div>
                        
                    )}
                    
                </>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default UserProfile;
