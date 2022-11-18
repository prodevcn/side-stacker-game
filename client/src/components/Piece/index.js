const Piece = ({ square }) => {
  const classMap = {
    X: 'cross-token',
    O: 'circle-token',
  }

  return (
    <div
      className={`${square ? classMap[square] : 'bg-amber-50'} board-piece`}
    ></div>
  )
}

export default Piece
