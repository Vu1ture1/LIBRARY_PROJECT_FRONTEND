import './App.css';
import react from 'react';
import Register from './Components/Register';
import Login from './Components/Login';
import { Routes, Route } from 'react-router-dom';
import Unauthorized from './Components/Unauthorized';
import GetAllBooks from './Components/GetAllBooks';
import UserProfile from './Components/Account';
import PrivateRoute from './Components/PrivateRoute';
import Header from './Components/Header';
import BookDetails from './Components/BookDetails';
import SearchedBooks from './Components/BookSearch';
import Logout from './Components/Logout';
import ChangePage from './Components/ChangeBook';
import AddBookPage from './Components/AddBook';
import { Navigate } from 'react-router-dom';
import AddAuthorPage from './Components/AddAuthor';


function App() {
  return (
    <div>
      <Header/>
      <Routes>
              <Route path="/" element={<Navigate to="/books" />} />
              <Route path="login" element={<Login/>}/>
              <Route path="register" element={<Register/>}/>
              <Route path="books" element={<GetAllBooks/>}/>
              <Route path="book/:id" element={<BookDetails />} />
              <Route path="unauthorized" element={<Unauthorized/>}/>
              <Route path="search" element={<SearchedBooks/>}/>
              <Route path="logout" element={<PrivateRoute element={<Logout/>} allowedRoles={['User', 'Admin']} />} />
              <Route path="account" element={<PrivateRoute element={<UserProfile/>} allowedRoles={['User', 'Admin']} />} />
              <Route path="change" element={<PrivateRoute element={<ChangePage/>} allowedRoles={['Admin']} />} />
              <Route path="add_book" element={<PrivateRoute element={<AddBookPage/>} allowedRoles={['Admin']} />} />
              <Route path="add_author" element={<PrivateRoute element={<AddAuthorPage/>} allowedRoles={['Admin']} />} />
      </Routes>
    </div>
    
  );
}

export default App;
