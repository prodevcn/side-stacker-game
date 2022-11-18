import { Fragment } from 'react'
import BoardBtn from '../../components/BoardBtn'
import BoardMsg from '../../components/BoardMsg'
import Piece from '../../components/Piece'

const BoardContainer = ({
  board,
  placePiece,
  piece,
  availableRows,
  gameStatus,
}) => {
  return (
    <div className="flex flex-col">
      <BoardMsg gameState={gameStatus} />
      <div className="board">
        {board.map((r, ri) => (
          <Fragment key={ri}>
            <BoardBtn
              piece={piece}
              placePiece={placePiece.bind(null, ri, 'L')}
              enabled={gameStatus === 'awaiting-piece' && availableRows[ri]}
            />
            {r.map((s, si) => {
              return <Piece square={s} key={ri * r.length + si} />
            })}
            <BoardBtn
              piece={piece}
              placePiece={placePiece.bind(null, ri, 'R')}
              enabled={gameStatus === 'awaiting-piece' && availableRows[ri]}
            />
          </Fragment>
        ))}
      </div>
    </div>
  )
}
export default BoardContainer
