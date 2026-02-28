import './auto.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';

type ValidationError = 'empty_login' | 'empty_password' | 'invalid_credentials' | null;

function Autorization() {
  const navigate = useNavigate();
  const { login, hasUser } = useAuth();
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ValidationError>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedLogin = loginValue.trim();
    const trimmedPassword = password.trim();

    if (!trimmedLogin) {
      setError('empty_login');
      return;
    }
    if (!trimmedPassword) {
      setError('empty_password');
      return;
    }

    if (!hasUser) {
      setError('invalid_credentials');
      return;
    }

    const success = login({ login: trimmedLogin, password: trimmedPassword });
    if (success) {
      navigate('/');
    } else {
      setError('invalid_credentials');
    }
  };

  return (
    <div className="Form">
      <Link to="/registration" className="Reg">
        Зарегистрироваться
      </Link>
      <h1 className="Form-title">ВХОД</h1>
      <form className="Form-container" onSubmit={handleSubmit}>
        <input
          type="text"
          id="auth-login"
          required
          placeholder="Логин"
          className="Login Input"
          value={loginValue}
          onChange={(e) => setLoginValue(e.target.value)}
          autoComplete="username"
        />
        <span
          className={`Invalid-login ${error === 'empty_login' ? 'show' : ''}`}
          id="Invalid-login"
        >
          Поле не должно быть пустым
        </span>
        <input
          type="password"
          id="auth-password"
          required
          placeholder="Пароль"
          className="Password Input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <span
          className={`Invalid-password ${error === 'empty_password' ? 'show' : ''}`}
          id="Invalid-password"
        >
          Поле не должно быть пустым
        </span>
        <div className="Checkbox">
          <input type="checkbox" id="auth-checkbox" className="Checkbox-input" />
          <label htmlFor="auth-checkbox" className="Check" />
          <p className="Check-text">Я согласен получать обновления на почту</p>
        </div>
        <span
          className={`Invalid-form ${error === 'invalid_credentials' ? 'show' : ''}`}
          id="Invalid-form"
        >
          Логин или пароль неверен
        </span>
        <button type="submit" className="Form-btn">
          Войти
        </button>
      </form>
    </div>
  );
}

export default Autorization;
