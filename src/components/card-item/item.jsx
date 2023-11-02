import './item.css';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../reducers/basket-reducer';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';

function Item({id, url, title, description, price, weight}) {
  const dispatch = useDispatch();

  const handlePlus = () => {
    const item = {
      id: id,
      idx: uuidv4(),
      title: title,
      url: url,
      price: price
    }
    dispatch(addToCart(item));
  }
  
  return (
    <div className="Item">
      <Link to={`/product/${id}`}>
      <img src={url} className="Item-img" alt="food" />
      <div className='Item-top'>
        <h2 className="Item-title">{title}</h2>
        <p className="Item-description">{description}</p>
        <div className="Item-buttom">
          <span className="Item-price">{price} ₽</span>
          <span className='Slash'>/</span>
          <span className="Item-weight">{weight}</span>
        </div>
      </div>
      </Link>
      
      <button onClick={handlePlus} className="Item-btn">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className='Hide'>
        <path d="M7 1.28564V12.3571" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M12.3569 6.82135L1.28551 6.82135" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <p className='Hide-cart-text'>В корзину</p>
      </button>
    </div>
  );
}

export default Item;