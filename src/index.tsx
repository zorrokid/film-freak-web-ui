import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { initAxios } from './interceptors/jwtInterceptor';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from './routes/root';
import { ErrorPage } from './ErrorPage';
import { LoginForm } from './routes/login/LoginForm';
import { Index } from './routes/index/index';
import { UsersList } from './routes/users/UsersList';
import { UserForm } from './routes/users/UserForm';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: 'login',
        element: <LoginForm />,
      },
      {
        path: 'users',
        element: <UsersList />
      },
      {
        path: 'add-user',
        element: <UserForm />
      },
    ]

  },
]);

initAxios(store);

root.render(
  //<React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
