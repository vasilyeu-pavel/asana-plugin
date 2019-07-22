import HeaderNavigation from './layouts';

// Route Pages
import Auth from './pages/Auth/Auth';
import Application from './components/Application/Application';

export default [
  {
    path: '/oauth_callback',
    exact: true,
    layout: HeaderNavigation,
    component: Auth,
  },
  {
    path: '/',
    exact: true,
    layout: HeaderNavigation,
    component: Application,
  },
  // for PWA app
  {
    path: '/index.html',
    exact: true,
    layout: HeaderNavigation,
    component: Application,
  },
];
