import './reg.scss';
import '../autorization/auto.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';

type ValidationError = 'empty_login' | 'short_login' | 'empty_password' | 'short_password' | null;

function Registration() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ValidationError>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedLogin = login.trim();
    const trimmedPassword = password.trim();

    if (!trimmedLogin) {
      setError('empty_login');
      return;
    }
    if (trimmedLogin.length < 4) {
      setError('short_login');
      return;
    }
    if (!trimmedPassword) {
      setError('empty_password');
      return;
    }
    if (trimmedPassword.length < 3) {
      setError('short_password');
      return;
    }

    register({ login: trimmedLogin, password: trimmedPassword });
    navigate('/autorization');
  };

  return (
    <div className="Background">
      <div className="Form Registration">
        <Link to="/autorization" className="Reg">
          Авторизоваться
        </Link>
        <h1 className="Form-title">РЕГИСТРАЦИЯ</h1>
        <form className="Form-container" onSubmit={handleSubmit}>
          <input
            type="text"
            id="reg-login"
            required
            placeholder="Логин"
            className="Login Input"
            name="loginReg"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoComplete="username"
          />
          <span
            className={`Invalid-login ${error === 'empty_login' ? 'show' : ''}`}
            id="Invalid-login"
          >
            Поле не должно быть пустым
          </span>
          <span
            className={`Invalid-login ${error === 'short_login' ? 'show' : ''}`}
            id="Short-login"
          >
            Логин должен содержать не менее 4-х символов
          </span>
          <input
            type="password"
            id="reg-password"
            required
            placeholder="Пароль"
            className="Password Input"
            name="passwordReg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <span
            className={`Invalid-password ${error === 'empty_password' ? 'show' : ''}`}
            id="Invalid-password"
          >
            Поле не должно быть пустым
          </span>
          <span
            className={`Invalid-password ${error === 'short_password' ? 'show' : ''}`}
            id="Short-password"
          >
            Пароль должен содержать не менее 3-х символов
          </span>
          <div className="Checkbox">
            <input type="checkbox" id="reg-checkbox" className="Checkbox-input" />
            <label htmlFor="reg-checkbox" className="Check" />
            <p className="Check-text">Я согласен получать обновления на почту</p>
          </div>
          <button type="submit" className="Form-btn">
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
