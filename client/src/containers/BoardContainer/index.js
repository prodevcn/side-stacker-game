import { Fragment } from 'react'
import BoardBtn from '../../components/BoardBtn'
import BoardMsg from '../../components/BoardMsg'
import Piece from '../../components/Piece'

const BoardContainer = ({
  board,
  placePiece,
  piece,
  availableRows,
  gameState,
}) => {
  return (
    <div className="basic-container sub-board">
      <BoardMsg gameState={gameState} />
      <div className="game-board">
        {board.map((r, ri) => (
          <Fragment key={ri}>
            <BoardBtn
              piece={piece}
              placePiece={placePiece.bind(null, ri, 'L')}
              enabled={gameState === 'WAITING_PIECE' && availableRows[ri]}
            />
            {r.map((s, si) => {
              return <Piece square={s} key={ri * r.length + si} />
            })}
            <BoardBtn
              piece={piece}
              placePiece={placePiece.bind(null, ri, 'R')}
              enabled={gameState === 'WAITING_PIECE' && availableRows[ri]}
            />
          </Fragment>
        ))}
      </div>
    </div>
  )
}
export default BoardContainer
