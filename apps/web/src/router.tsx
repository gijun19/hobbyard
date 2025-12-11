import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Marketplace from './pages/Marketplace';
import CardDetail from './pages/CardDetail';
import BuyerBox from './pages/BuyerBox';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Marketplace />,
      },
      {
        path: 'cards/:id',
        element: <CardDetail />,
      },
      {
        path: 'buyer-box',
        element: <BuyerBox />,
      },
    ],
  },
]);
