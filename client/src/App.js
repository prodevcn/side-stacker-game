import { Outlet } from 'react-router-dom'
import BasicPage from './layouts/BasicPage'

const App = () => {
  return (
    <BasicPage>
      <Outlet />
    </BasicPage>
  )
}

export default App
