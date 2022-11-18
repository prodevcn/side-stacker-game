import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from '../App'
import ErrorPage from '../pages/Error'
import Home from '../pages/Home'
import Game from '../pages/Game'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'game',
        element: <Game />,
      },
      {
        path: '*',
        element: <Home />,
      },
    ],
  },
])

const AppRouter = () => <RouterProvider router={router} />
export default AppRouter
