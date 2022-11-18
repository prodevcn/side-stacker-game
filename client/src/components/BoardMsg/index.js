import Spinner from '../Spinner'

const BoardMsg = ({ gameStatus }) => {
  const MsgUI = {
    WAITING_PIECE: <span>It&apos;s your turn!</span>,
    WAITING_PLAYER: <span>It&apos;s opponent&apos;s turn!</span>,
    WAITING_SERVER: <Spinner className="text-slate-50" />,
  }

  return <div className="board-message">{MsgUI[gameStatus]}</div>
}

export default BoardMsg
