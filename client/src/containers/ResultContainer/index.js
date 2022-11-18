import { Link } from 'react-router-dom'
import BasicContainer from '../BasicContainer'

const ResultContainer = ({ result }) => {
  const avatars = {
    draw: 'https://avatars.dicebear.com/api/big-smile/1.svg?mouth=unimpressed',
    lost: 'https://avatars.dicebear.com/api/big-smile/1.svg?mouth=openSad',
    win: 'https://avatars.dicebear.com/api/big-smile/1.svg',
  }

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
      <span className="highlight-area">{messages[result.toLowerCase()]}</span>
      <Link
        to={'/game'}
        onClick={() => (window.location.href = '/game')}
        className="new-game-button"
      >
        Try again?
      </Link>
    </BasicContainer>
  )
}

export default ResultContainer
