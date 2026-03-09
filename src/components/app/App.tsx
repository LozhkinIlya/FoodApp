import { Routes, Route } from 'react-router-dom';
import Basket from '../../pages/basket';
import Products from '../../pages/products';
import NotFound from '../../pages/notFound';
import Product from '../../pages/product';
import Profile from '../../pages/profile';
import Main from '../../pages/main';
import Registration from '../registration/Registration';
import { ProtectedRoute } from '../ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/basket"
          element={
            <ProtectedRoute>
              <Basket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/autorization" element={<Main />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
