import '../components/card-item/product.scss';
import Header from '../components/app-header';
import Item from '../components/card-item';
import { products } from '../services/menuList';
import { useParams, useNavigate } from 'react-router-dom';
import NotFound from './notFound';

function Product() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return <NotFound />;
  }

  const { url, title, description, price, weight } = product;

  return (
    <div className="Product">
      <Header
        leftContent={
          <button className="Header-back-btn" onClick={() => navigate(-1)} aria-label="Назад">
            <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.65166 1.04683C3.787 0.911493 4.00007 0.911493 4.13541 1.04683C4.26618 1.1776 4.26618 1.39524 4.13541 1.5257L1.68253 3.97859H9.77672C9.9654 3.97859 10.1202 4.12856 10.1202 4.31725C10.1202 4.50593 9.9654 4.66078 9.77672 4.66078H1.68253L4.13541 7.10909C4.26618 7.24443 4.26618 7.46238 4.13541 7.59284C4.00007 7.72818 3.787 7.72818 3.65166 7.59284L0.618095 4.55927C0.487328 4.42851 0.487328 4.21086 0.618095 4.0804L3.65166 1.04683Z" fill="#D58C51" />
            </svg>
          </button>
        }
      />

      <div className="Product-item">
        <Item
          key={product.id}
          id={product.id}
          url={`../${url}`}
          title={title}
          description={description}
          price={price}
          weight={weight}
        />
      </div>
    </div>
  );
}

export default Product;
