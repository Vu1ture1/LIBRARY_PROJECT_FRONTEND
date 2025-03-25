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
import DeleteBookModal from "./DeleteModal";

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
            author.id, author.name, author.surname, author.bornDate, author.country
        );
        this.borrowedAt = new Date(borrowedAt);
        this.returnBy = new Date(returnBy);
        this.userThatGetBook = userThatGetBook;
        this.image = image;
    }
}

const SEARCH_PB_LIST_URL = "books/find";
const IMAGE_URL = "https://localhost:7002/Resources/";

const SearchedBooks = () => {
    const [data, setData] = useState([]);
    const [bookUpdated, setBookUpdated] = useState(false);

    const [bookName, setBookName] = useState("");
    //const [selectedAuthor, setSelectedAuthor] = useState(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selected_book, setSelected_book] = useState(null);

    const [role, setRole] = useState(getUserRole());

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

    const deleteBook = async (book_id) => {
        const controller = new AbortController();

        try {
            const response = await axiosPrivate.delete(`books/delete/${book_id}`, {
                signal: controller.signal
            });

            setBookUpdated(prev => !prev);
        } catch (err) {
            console.error(err);
            navigate('/login');
        }
    }

    function isOnlySpaces(str) {
        return str.trim().length === 0;
    }

    const axiosPrivate = useAxiosPrivate();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setRole(getUserRole());
        
        const getPB_List = async () => {
            
            let response = null;

            try {
                console.log(bookName);
                
                if(bookName === null || bookName === "" || isOnlySpaces(bookName)){
                    setData([]);
                }       
                else{
                    response = await axios.get(`${SEARCH_PB_LIST_URL}/${bookName}`);

                    const books = response.data.map(item => {
                        return new Book(
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
                        );
                    });
                    
                    setData(books);
                    console.log(books);
                }
                
            } catch (err) {
                
                if (err.response?.status === 404) {
                    setData([]);
                }
            }
        };

        getPB_List();

    }, [bookUpdated, bookName, navigate, location]);

    function truncateString(str) {
        if (str.length > 100) {
            return str.substring(0, 100) + "...";
        }
        return str;
    }    

    function bookStatus(book_user_id, return_date) {
        if(book_user_id != 0){return `Книги нет в наличии. Вернется в библиотеку: ${return_date.toISOString().split('T')[0]}`}
        else{return "Книга есть в наличии."}
    }   

    const handleDeleteClick = (book) => {
        setSelected_book(book);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        deleteBook(selected_book.id);
        setSelected_book(null);
        setIsModalOpen(false);
    };

    const handleClearModal = () => {
        setSelected_book(null);
        setIsModalOpen(false);
    }

    return (
        <div>
            <div style={{width: "inherit", margin: "20px"}}>
                <Form.Group controlId="formInput">
                    <Form.Control 
                        type="text" 
                        placeholder="Введите имя книги..." 
                        onChange={(e) => setBookName(e.target.value)}
                    />
                </Form.Group>            
            </div>

            {data.length > 0 ? (
                <div>
                    <div style={{ marginLeft: '10px', marginRight: '10px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
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
                                        <span>Автор: {book.book_author.name} {book.book_author.surname}</span><br/><br/>
                                        <span>Жанр: {book.genre}</span><br/><br/>
                                        <span>Описание: {truncateString(book.description)}</span><br/><br/>
                                        <span>Статус книги: {bookStatus(book.userThatGetBook, book.returnBy)}</span><br/>
                                        </Card.Text>
                                        <Button style={{marginRight: "10px"}} variant="info" size="sm" onClick={() => navigate(`/book/${book.id}`)}>Подробно</Button>
                                        
                                        

                                        {(role !== null) && (book.userThatGetBook === 0) && (
                                            <Button variant="warning" size="sm" onClick={() => giveBook(book.id)}>Взять книгу</Button>
                                        )}

                                        {(role === "Admin") && (
                                            <Button variant="danger" size="sm"  onClick={() => handleDeleteClick(book)}>Удалить книгу</Button>
                                        )}
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                    </div>

                    {selected_book && (
                    <DeleteBookModal
                        isOpen={isModalOpen}
                        onConfirm={handleConfirmDelete}
                        onCancel={() => handleClearModal()}
                        bookTitle={selected_book.name}
                    />)}
                </div>

                
            ) : (
                <div style={{marginTop: "20px"}} className="d-flex justify-content-center">
                    <h4>Книг с данным именем не найдено</h4>
                </div>
            )}
        </div>
    );
};

export default SearchedBooks;