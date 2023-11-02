import './auto.css';
import { Link } from 'react-router-dom';

function Autorization() {
  return (
    <div className="Form">
      <Link to='/registration' className='Reg'>Зарегистрироваться</Link>
      <h1 className="Form-title">ВХОД</h1>
      <form className='Form-container'>
        <input type="text" id="Login" required placeholder="Логин" class="Login Input">
        </input>
        <span class="Invalid-login" id="Invalid-login">Поле не должно быть пустым</span>
        <input type="password" id="Password" required placeholder="Пароль" class="Password Input">
        </input>
        <span class="Invalid-password" id="Invalid-password">Поле не должно быть пустым</span>
        <label for="Checkbox" class="Checkbox">
          <input type="checkbox" id="Checkbox" class="Checkbox-input">
          </input>
          <label for="Checkbox" class="Check" id ="Check"></label>
          <p className='Check-text'>Я согласен получать обновления на почту</p>
        </label>
        
        <span class="Invalid-form" id="Invalid-form">Логин или пароль неверен</span>
        <button className="Form-btn">Войти</button>
      </form>
    </div>
  );
}
  
export default Autorization;