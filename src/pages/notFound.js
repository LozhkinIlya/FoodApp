import { Link } from 'react-router-dom';
import '../components/errors/notFound.css';

function NotFound() {
  return (
    <div className="NotFound">
      <p>404 такой страницы не существует</p>
      <Link to='/'><button className="Back">на главную</button></Link>
    </div>
  );
}
  
export default NotFound;