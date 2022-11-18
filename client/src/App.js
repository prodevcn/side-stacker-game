import { Outlet } from 'react-router-dom'
import BasicPage from './layouts/BasicPage'

const App = () => {
  return (
    <div id="side-stacker-game">
      <BasicPage>
        <Outlet />
      </BasicPage>
    </div>
  )
}

export default App
