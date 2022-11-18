const BoardBtn = ({ piece, placePiece, enabled }) => {
  const playerPieceClass = piece === 'X' ? 'cross-token' : 'circle-token'
  return (
    <button
      className={`board-btn ${playerPieceClass}`}
      disabled={!enabled}
      onClick={placePiece}
    />
  )
}

export default BoardBtn
