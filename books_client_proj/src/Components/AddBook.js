import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import axios from '../api/axios';
import {Button} from "react-bootstrap";
import useAxiosPrivateFile from "../hooks/useAxiosPrivateFile";

const genres = ["Фантастика", "Детектив", "Роман", "Исторический роман", "История", "Фэнтези", "Новелла", "Ужас", "Приключения", "Публицистика", "Боевик", 
    "Повесть", "Манга", "Комикс", "Религия"
];

const AUTHORS_URL = "authors/all";

class Author {
    constructor(id, name, surname, bornDate, country) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.bornDate = new Date(bornDate);
        this.country = country;
    }
}

const AddBookPage = () => {

  const [validISBN, setValidISBN] = useState(false);
  const [validName, setValidName] = useState(false);
  const [validGenre, setValidGenre] = useState(false);
  const [validAuthor, setValidAuthor] = useState(false);
  const [validDescription, setValidDescription] = useState(false);
  const [validImageFile, setValidImageFile] = useState(true);

  const [authors, setAuthors] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [formData, setFormData] = useState({
    isbn: '',
    name: '',
    description: '',
    image: null,
  });

  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivateFile();

  const sendChange = async () => {
    const sendData = new FormData();

    sendData.append('ISBN', formData.isbn);
    sendData.append('Name', formData.name);
    sendData.append('Genre', selectedGenre);
    sendData.append('Description', formData.description);
    sendData.append('AuthorId', selectedAuthor);

    if(formData.image !== null && formData.image.length !== 0)
    {
        sendData.append('ImageFile', formData.image[0]);
    }
    
    const controller = new AbortController();

    try {
        const response = await axiosPrivate.post(`books/add`, sendData, {
            signal: controller.signal
        });

        navigate(`/books`);
    } catch (err) {
        console.error(err);
        navigate('/login');
    }
  }

  const handleISBNChange = (e) => {
    const value = e.target.value;
    const isValid = /^[0-9]{13}$/.test(value); 
    setValidISBN(isValid);
    setFormData({ ...formData, isbn: value });
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    const isValid = value.length >= 1 && value.length <= 254;
    setValidName(isValid);
    setFormData({ ...formData, name: value });
  };

  const handleGenreChange = (e) => {
    const value = e.target.value;
    const isValid = value !== "";
    setValidGenre(isValid);
    setSelectedGenre(value);
  };

  const handleAuthorChange = (e) => {
    const value = e.target.value;
    const isValid = value !== "";
    setValidAuthor(isValid);
    setSelectedAuthor(value);
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    const isValid = value.length >= 50 && value.length <= 1000;
    setValidDescription(isValid);
    setFormData({ ...formData, description: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files;
    let isValid = false;
    if(file.length === 0)
    {
        isValid = true;
    }
    else
    {
        isValid = file[0] && (file[0].type === "image/png" || file[0].type === "image/jpeg");
    }
    
    setValidImageFile(isValid);
    setFormData({ ...formData, image: file });
  };

  useEffect(() => {
      const fetchGenresAndAuthors = async () => {
          try {
              const response = await axios.get(AUTHORS_URL);

              //console.log(response);

              const authors = response.data.value.map(item => new Author(
                  item.id,
                  item.name,
                  item.surname,
                  item.bornDate,
                  item.country
              ));
              setAuthors(authors);
          } catch (error) {
              console.error("Ошибка загрузки данных:", error);
          }
      };

      fetchGenresAndAuthors();
  }, []);

  useEffect(() => {
    setFormData({
        isbn: '',
        name: '',
        description: '',
        image: null,
      });

     setSelectedGenre('');
     setSelectedAuthor('');
  }, []);

  return (
    <div style={{margin: "20px"}}>
      <Form>
            <Form.Group className="mb-3" controlId="ISBN">
            <Form.Label>Международный стандартный книжный номер(ISBN):</Form.Label>
            <Form.Control
                type="number"
                placeholder="9782123456803"
                value={formData.isbn}
                onChange={handleISBNChange}
                isInvalid={!validISBN}
            />
            <Form.Control.Feedback type="invalid">
                ISBN должен содержать 13 цифр.
            </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="Name">
            <Form.Label>Название книги:</Form.Label>
            <Form.Control
                type="text"
                placeholder="Война и мир"
                value={formData.name}
                onChange={handleNameChange}
                isInvalid={!validName}
            />
            <Form.Control.Feedback type="invalid">
                Имя должно содержать от 1 до 254 символов.
            </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="Genre">
            <Form.Label>Жанр:</Form.Label>
            <Form.Control
                as="select"
                value={selectedGenre}
                onChange={handleGenreChange}
                isInvalid={!validGenre}
            >
                <option value="">Выберите жанр</option>
                {genres.map((genre) => (
                <option key={genre} value={genre}>
                    {genre}
                </option>
                ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
                Пожалуйста, выберите жанр.
            </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="AuthorId">
            <Form.Label>Автор:</Form.Label>
            <Form.Control
                as="select"
                value={selectedAuthor}
                onChange={handleAuthorChange}
                isInvalid={!validAuthor}
            >
                <option value="">Выберите автора</option>
                {authors.map((author) => (
                <option key={author.id} value={author.id}>
                    {author.name} {author.surname}
                </option>
                ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
                Пожалуйста, выберите автора.
            </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="Description">
            <Form.Label>Описание:</Form.Label>
            <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={handleDescriptionChange}
                isInvalid={!validDescription}
            />
            <Form.Control.Feedback type="invalid">
                Описание должно содержать от 50 до 1000 символов.
            </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="ImageFile" className="mb-3">
            <Form.Label>Файл изображения в формате (.png, .jpg, .jpeg):</Form.Label>
            <Form.Control
                type="file"
                onChange={handleFileChange}
                isInvalid={!validImageFile}
            />
            <Form.Control.Feedback type="invalid">
                Изображение должно быть в формате .png, .jpg или .jpeg.
            </Form.Control.Feedback>
            </Form.Group>
            {(validISBN === validName === validGenre === validAuthor === validDescription === validImageFile === true) ? (
                <Button variant="success" onClick={() => sendChange()}>Добавить</Button>
            ) : (
                <Button variant="success" disabled>Добавить</Button>
            )}
        </Form>
    </div>
  );
};

export default AddBookPage;