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

const GET_PB_LIST_URL = "books/pagination";
const IMAGE_URL = "https://localhost:7002/Resources/";

const genres = ["Фантастика", "Детектив", "Роман", "Исторический роман", "История", "Фэнтези", "Новелла", "Ужас", "Приключения", "Публицистика", "Боевик", 
    "Повесть", "Манга", "Комикс", "Религия"
];

const GetAllBooks = () => {
    const [data, setData] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("Без категории");
    const [bookUpdated, setBookUpdated] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selected_book, setSelected_book] = useState(null);

    const [selectedAuthor, setSelectedAuthor] = useState({ id: null, fullname: "" });

    const [role, setRole] = useState(getUserRole());

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

    useEffect(() => {
        setRole(getUserRole());
        
        const getPB_List = async () => {
            
            let response = null;
            let params = {pageIndex};

            if(selectedCategory != "Без категории")
            {
                params.cat = selectedCategory;
            }

            if(selectedAuthor.id != null)
            {
                params.authorId = selectedAuthor.id;
            }

            try{
                response = await axios.get(GET_PB_LIST_URL, { params });

            

                const books = response.data.items.map(item => {
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
                setTotalPages(response.data.totalPages);
                console.log(books);
                console.log(response.data.totalPages);
            }
            catch(err)
            {
                if(!err?.response)
                {
                    setData([]);
                }
            }
        };

        getPB_List();

    }, [bookUpdated, pageIndex, totalPages, selectedCategory, selectedAuthor, navigate, location]);

    const handlePageChange = (newPageIndex) => {
        setPageIndex(newPageIndex);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        setPageIndex(1);
    };

    const handleAuthorChange = (authorId, fullname) => {
        setSelectedAuthor({ id: authorId, fullname });
        setPageIndex(1);
    };    
    
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

    const MyPagination = () => {
        let items = [];

        if (pageIndex === 1) {
            items.push(
                <Pagination.First disabled key="first-disabled" />
            )
            items.push(
                <Pagination.Prev disabled key="prev-disabled" />
            );
        } else {
            items.push(
                <Pagination.First key="first" 
                    onClick={() => handlePageChange(1)}
                />
            )
            items.push(
                <Pagination.Prev 
                    key="prev" 
                    onClick={() => handlePageChange(pageIndex - 1)}
                />
            );
        }
        
        
        for (let i = 1; i <= totalPages; i++) {
            items.push(
                
                <Pagination.Item 
                    key={i} 
                    active={i === pageIndex} 
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Pagination.Item>
                
            );
        }

        if (pageIndex === totalPages) {
            items.push(<Pagination.Next disabled key="next-disabled" />);
            items.push(
                <Pagination.Last disabled key="last-disabled" />
            )
        } else {
            items.push(<Pagination.Next key="next" onClick={() => handlePageChange(pageIndex + 1)} />);
            items.push(
                <Pagination.Last key="last" onClick={() => handlePageChange(totalPages)} />
            )
        }
    
        return <Pagination>{items}</Pagination>;
    };

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
            <div style={{width: "inherit", marginTop: "20px", marginBottom: "20px"}}>
                <Form.Select style={{width: "70%", margin: "0 auto"}} value={selectedCategory} onChange={handleCategoryChange} aria-label="Default select example">
                    <option value="Без категории">Без категории</option>
                    {genres.map((genre) => (
                        <option key={genre} value={genre}>
                            {genre}
                        </option>
                    ))}
                </Form.Select>                
            </div>

            <div style={{width: "inherit", marginTop: "20px", marginBottom: "20px"}}>
                {(selectedAuthor.id !== null) && (
                    <div>
                        <Alert 
                            variant="info" 
                            style={{ width: "30%", margin: "0 auto", whiteSpace: "normal", display: "block"}}
                        >
                            Выбранный автор: {selectedAuthor.fullname}
                            <Button style={{ marginLeft: "5px"}} variant="danger" size="sm" onClick={() => handleAuthorChange(null, '')}>Убрать фильтр на автора</Button>
                        </Alert>
                        
                    </div>
                    )}
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
                                        <Button style={{marginRight: "10px"}} variant="secondary" size="sm" onClick={() => handleAuthorChange(book.book_author.id, `${book.book_author.name} ${book.book_author.surname}`)}>Фильтр по автору</Button>
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
                    <div style={{marginTop: "20px"}} className="d-flex justify-content-center">
                        {MyPagination()}
                    </div>

                    {selected_book && (
                    <DeleteBookModal
                        isOpen={isModalOpen}
                        onConfirm={handleConfirmDelete}
                        onCancel={() => handleClearModal()}
                        bookTitle={selected_book.name}
                    />
            )}
                </div>
            ) : (
                <div style={{marginTop: "20px"}} className="d-flex justify-content-center">
                    <h4>Нет книг для отображения</h4>
                </div>
                
            )}
        </div>
    );
};

export default GetAllBooks;