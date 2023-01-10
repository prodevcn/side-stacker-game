import { Link } from 'react-router-dom'
import BasicContainer from '../BasicContainer'
import Win from '../../assets/images/win.png'
import Lose from '../../assets/images/lose.png'
import Draw from '../../assets/images/draw.png'

const avatars = {
  win: Win,
  lost: Lose,
  draw: Draw,
}

const ResultContainer = ({ result, withBot }) => {
  const messages = {
    draw: `It's a draw`,
    lost: 'You lost',
    win: 'You win',
  }

  return (
    <BasicContainer>
      <span className="result-text">{messages[result.toLowerCase()]}</span>
      <img
        src={avatars[result.toLowerCase()]}
        alt="Result Avatar"
        className="result-avatar"
      />
      <Link
        to={`/game${withBot ? '?bot=true' : ''}`}
        onClick={() =>
          (window.location.href = `/game${withBot ? '?bot=true' : ''}`)
        }
        className="new-game-button"
      >
        Try again?
      </Link>
      <Link to="/" onClick={() => {}} className="go-to-home">
        Go to home
      </Link>
    </BasicContainer>
  )
}

export default ResultContainer
