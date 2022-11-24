const Piece = ({ square }) => {
  const styles = {
    X: 'cross-token',
    O: 'circle-token',
  }

  return (
    <div
      className={`${square ? styles[square] : 'empty-piece'} board-piece`}
    ></div>
  )
}

export default Piece
