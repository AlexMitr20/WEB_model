import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext'; 
import { Link } from 'react-router-dom';
import { IoClose, IoMenu } from 'react-icons/io5';
import './navbar.css';
import logoImage from './Logo.png';

const ErrorMessage = ({ message, type }) => {
  return (
    <p className={`message ${type === 'success' ? 'success' : 'error'}`}>
      {message}
    </p>
  );
};

const Navbar = () => {
  const { userId, updateUser } = useUser();
  const [showMenu, setShowMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '', confirmPassword: '' });
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    if (storedUserId && storedUsername) {
      const parsedUserId = parseInt(storedUserId);
      setCurrentUser({ id: parsedUserId, username: storedUsername });
    }
  }, []);

  const toggleMenu = () => setShowMenu(!showMenu);

  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
    setMessage({ type: '', text: '' });
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
    setMessage({ type: '', text: '' });
  };

  const openProfileModal = () => {
    setShowProfileModal(true);
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setShowProfileModal(false);
    clearFormData();
    setMessage({ type: '', text: '' });
  };

  const clearFormData = () => {
    setLoginData({ username: '', password: '' });
    setRegisterData({ username: '', password: '', confirmPassword: '' });
    setPasswordMismatch(false);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({ ...prevData, [name]: value }));
    if (passwordMismatch) {
      setPasswordMismatch(false);
      setMessage({ type: '', text: '' });
    }
  };

  const handleLogin = async () => {
    setMessage({ type: '', text: '' });
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      if (response.ok) {
        const data = await response.json();
        if (data.userId) {
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('username', data.username);
          setMessage({ type: 'success', text: 'Вы успешно вошли в систему!' });
          setCurrentUser({ id: data.userId, username: data.username });
          updateUser(data.userId);
          setTimeout(closeModals, 2000);
        } else {
          setMessage({ type: 'error', text: 'Неверный формат данных пользователя' });
        }
      } else {
        const data = await response.json();
        if (data.message === 'Неправильный логин или пароль') {
          setMessage({ type: 'error', text: 'Неправильный логин или пароль!' });
        } else {
          setMessage({ type: 'error', text: 'Такового пользователя не существует!' });
        }
      }
    } catch (error) {
      console.error('Ошибка при входе', error);
    }
  };
  
  const handleRegister = async () => {
    setMessage({ type: '', text: '' });
  
    if (registerData.password !== registerData.confirmPassword) {
      setPasswordMismatch(true);
      setMessage({ type: 'error', text: 'Пароли не совпадают' });
      return;
    }
  
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.userId) {
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('username', data.username);
          setMessage({ type: 'success', text: 'Вы успешно зарегистрировались!' });
          setCurrentUser({ id: data.userId, username: data.username });
          updateUser(data.userId);
          setTimeout(closeModals, 2000);
        } else {
          setMessage({ type: 'error', text: 'Ошибка при регистрации' });
        }
      } else {
        const data = await response.json();
        if (data.message === 'Такой пользователь уже существует') {
          setMessage({ type: 'error', text: 'Такой пользователь уже существует!' });
        } else {
          setMessage({ type: 'error', text: 'Ошибка при регистрации' });
        }
      }
    } catch (error) {
      console.error('Ошибка при регистрации', error);
      setMessage({ type: 'error', text: 'Произошла ошибка при регистрации' }); // Добавлено новое сообщение об ошибке
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setCurrentUser(null);
    updateUser(null);
    setShowProfileModal(false);
  };

  return (
    <header className="header">
      <nav className="nav container">
        <div className="nav__logo-container">
          <img src={logoImage} alt="logo" className="nav__logo-img" />
        </div>
        <div className={`nav__menu ${showMenu ? 'show-menu' : ''}`} id="nav-menu">
          <h1>Навигация по сайту</h1>
          <ul className="nav__list">
            <li className="nav__item">
              <Link to="/Menu" className="nav__link" onClick={toggleMenu}>
                Главная информация
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/Dialogs" className="nav__link" onClick={toggleMenu}>
                Процесс создания диалогов
              </Link>
            </li>
            <li className="nav__item">
            <Link to="/About" className="nav__link" onClick={toggleMenu}>
                О нас
              </Link>
            </li>
          </ul>
          <div className="nav__button">
            <Link to="/WorkFile" className="nav__link" onClick={toggleMenu}>
              Попробуй!
            </Link>
          </div>
          <p className="nav__signature">Связьтранзит 2024</p>
          <div className="nav__close" onClick={toggleMenu}>
            <IoClose />
          </div>
        </div>
        <div className="nav__toggle" onClick={toggleMenu}>
          <IoMenu />
        </div>
        <div className="auth-buttons">
          {currentUser ? (
            <button onClick={openProfileModal} className="profile-button">
              Профиль
            </button>
          ) : (
            <>
              <button onClick={openLoginModal} className="login-button">
                Вход
              </button>
              <button onClick={openRegisterModal} className="register-button">
                Регистрация
              </button>
            </>
          )}
        </div>
      </nav>

{/* Login Modal */}
{showLoginModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Вход</h2>
      <input
        type="text"
        name="username"
        value={loginData.username}
        onChange={handleLoginChange}
        placeholder="Логин"
      />
      <input
        type="password"
        name="password"
        value={loginData.password}
        onChange={handleLoginChange}
        placeholder="Пароль"
      />
      <button onClick={handleLogin} className="auth-button">
        Войти
      </button>
      <button onClick={closeModals} className="close-button">
        Закрыть
      </button>
    
      {message.type === 'success' && (
        <p className={`message success`}>
          {message.text}
        </p>
      )}
      {message.type === 'error' && (
        <p className={`message error`}>
          {message.text}
        </p>
      )}
    </div>
  </div>
)}


{/* Registration Modal */}
{showRegisterModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Регистрация</h2>
      <input
        type="text"
        name="username"
        value={registerData.username}
        onChange={handleRegisterChange}
        placeholder="Логин"
      />
      <input
        type="password"
        name="password"
        value={registerData.password}
        onChange={handleRegisterChange}
        placeholder="Пароль"
      />
      <input
        type="password"
        name="confirmPassword"
        value={registerData.confirmPassword}
        onChange={handleRegisterChange}
        placeholder="Подтвердите пароль"
      />
      <button onClick={handleRegister} className="auth-button">
        Зарегистрироваться
      </button>
      <button onClick={closeModals} className="close-button">
        Закрыть
      </button>
      {message.type === 'success' && (
        <p className={`message success`}>
          {message.text}
        </p>
      )}

      {message.type === 'error' && (
        <p className={`message error`}>
          {message.text}
        </p>
      )}   
    </div>
  </div>
)}


{/* Profile Modal */}
{showProfileModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Профиль</h2>
      <p>Ваше имя: {currentUser && currentUser.username}</p>
      <button onClick={handleLogout} className="logout-button">
        Выйти
      </button>
      <button onClick={closeModals} className="close-button">
        Закрыть
      </button>
    </div>
  </div>
)}
    </header>
  );
};

export default Navbar;