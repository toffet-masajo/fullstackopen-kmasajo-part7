import { useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

import { useUserValue, useUserDispatch } from './context/UserContext';
import { setToken } from './services/blogs';
import Home from './components/Home';
import Blog from './components/Blog';
import BlogList from './components/BlogList';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import User from './components/User';
import UsersList from './components/UsersList';
import { Nav, Navbar } from 'react-bootstrap';

const App = () => {
  const user = useUserValue();
  const userDispatch = useUserDispatch();

  useEffect(() => {
    const userJSONobj = window.localStorage.getItem('loggedUser');
    if (userJSONobj) {
      const loggedUser = JSON.parse(userJSONobj);
      userDispatch({ type: 'SET_USER', payload: loggedUser });
      setToken(loggedUser.token);
    }
  }, []);

  const linkStyle = { padding: 5 };

  return (
    <div className="container">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#" as="span">
              <Link style={linkStyle} to="/">
                home
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={linkStyle} to="/blogs">
                blogs
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={linkStyle} to="/users">
                users
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              {user ? (
                <em style={linkStyle}>{user.username} logged in</em>
              ) : (
                <Link style={linkStyle} to="/login">
                  login
                </Link>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Notification />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/users" element={user ? <UsersList /> : <Navigate replace to="/login" />} />
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="/users/:id" element={<User />} />
      </Routes>
      {/* </Router> */}
    </div>
  );
};

export default App;
