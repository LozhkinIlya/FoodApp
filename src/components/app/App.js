import './App.css';
import Basket from '../../pages/basket';
import {Routes, Route} from 'react-router-dom';
import Products from '../../pages/products';
import NotFound from '../../pages/notFound';
import Product from '../../pages/product';
import Main from '../../pages/main';
import Registration from '../registrartion/reg';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Products />} />
        <Route path='/basket' element={<Basket />} />
        <Route path='*' element={<NotFound />} />
        <Route path='/product/:id' element={<Product />} />
        <Route path='/autorization' element={<Main />} />
        <Route path='/registration' element={<Registration />} />
      </Routes>
    </div>
  );
}

export default App;