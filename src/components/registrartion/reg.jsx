import './reg.css';
import { Link } from 'react-router-dom';


function Registration() {
  return (
    <div className="Background">
      <div className="Form Registration">
      <Link to='/autorization' className='Reg'>Авторизоваться</Link>
      <h1 className="Form-title">РЕГИСТРАЦИЯ</h1>
      <form className='Form-container' id='formReg'>
        <input type="text" id="Login" required placeholder="Логин" class="Login Input" name="loginReg">
        </input>
        <span class="Invalid-login" id="Invalid-login">Поле не должно быть пустым</span>
        <span class="Invalid-login" id="Short-login">Логин должен содержать не менее 4-х символов</span>
        <input type="password" id="Password" required placeholder="Пароль" class="Password Input" name="passwordReg">
        </input>
        <span class="Invalid-password" id="Invalid-password">Поле не должно быть пустым</span>
        <span class="Invalid-password" id="Short-password">Пароль должен содержать не менее 3-х символов</span>
        <label for="Checkbox" class="Checkbox">
          <input type="checkbox" id="Checkbox" class="Checkbox-input">
          </input>
          <label for="Checkbox" class="Check" id ="Check"></label>
          <p className='Check-text'>Я согласен получать обновления на почту</p>
        </label>
        <span class="Invalid-form" id="Invalid-form">Логин или пароль неверен</span>
        <button type="submit" className="Form-btn" id="buttonReg" value='Регистрация'>Зарегистрироваться</button>
      </form>
      </div>
    </div>
  );
}
  
export default Registration;