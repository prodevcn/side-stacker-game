import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from '../App'
import ErrorPage from '../pages/Error'
import Home from '../pages/Home'
import Game from '../pages/Game'

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} errorElement={<ErrorPage />}>
        <Route path="" element={<Home />} />
        <Route path="game" element={<Game />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  </BrowserRouter>
)

export default AppRouter
