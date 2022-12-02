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
      <img
        src={avatars[result.toLowerCase()]}
        alt="Result Avatar"
        className="result-avatar"
      />
      <span className="result-text">{messages[result.toLowerCase()]}</span>
      <Link
        to={`/game${withBot ? '?bot=true' : ''}`}
        onClick={() =>
          (window.location.href = `/game${withBot ? '?bot=true' : ''}`)
        }
        className="new-game-button"
      >
        Try again?
      </Link>
    </BasicContainer>
  )
}

export default ResultContainer
