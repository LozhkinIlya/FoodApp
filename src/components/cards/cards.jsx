import './cards.css';
import Item from '../card-item';
import { products } from '../../services/menuList';

function Cards() {
  
  return (
    <div className="Cards">
      {products.map(item => {
        return (
          <Item
          key={item.id}
          id={item.id}
          url={item.url}
          title={item.title}
          description={item.description}
          price={item.price}
          weight={item.weight}
          />
        )
      })}
    </div>
  );
}

export default Cards;