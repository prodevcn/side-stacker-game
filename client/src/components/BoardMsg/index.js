import Spinner from '../Spinner'

const BoardMsg = ({ gameState }) => {
  const MsgUI = {
    WAITING_PIECE: <span>It&apos;s your turn!</span>,
    WAITING_PLAYER: <span>It&apos;s opponent&apos;s turn!</span>,
    WAITING_SERVER: <Spinner className="spinner" />,
  }

  return <div className="board-message">{MsgUI[gameState]}</div>
}

export default BoardMsg
