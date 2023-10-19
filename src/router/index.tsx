import {
  createBrowserRouter,
  Navigate,
  createHashRouter,
} from 'react-router-dom';
import NoMatch from '@/views/noMatch';
import {
  ProductIntro,
  ProductDetail,
  ServicesSubscriptions,
} from '@/views/product';
import App from '@/App';

import Test from '@/views/test';
import Apply from '@/views/product/intro/apply-scene';

const router = createHashRouter([
  {
    path: '/',
    element: <Navigate to="/product_intro" />,
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/product_intro',
        element: <ProductIntro />,
      },
      {
        path: '/product_detail',
        element: <ProductDetail />,
      },
      {
        path: '/services_subscriptions',
        element: <ServicesSubscriptions />,
      },
      {
        path: '/test',
        element: <Test />,
      },
      {
        path: '/apply',
        element: <Apply />,
      },
    ],
    // errorElement
  },

  {
    path: '*',
    element: <NoMatch />,
  },
]);

export default router;
