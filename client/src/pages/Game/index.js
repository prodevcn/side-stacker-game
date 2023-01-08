import { useEffect } from 'react'
import { useGameManager, useGameInitializer } from '../../hooks/GameManager'
import { useGameClient } from '../../hooks/GameClient'
import { useGameCore } from '../../hooks/GameCore'
import BoardContainer from '../../containers/BoardContainer'
import WaitContainer from '../../containers/WaitContainer'
import LinkContainer from '../../containers/LinkContainer'
import ResultContainer from '../../containers/ResultContainer'
import ErrorContainer from '../../containers/ErrorContainer'

const Game = () => {
  const { gameId, withBot } = useGameInitializer()
  const { serverMessage, sendMessage } = useGameClient(gameId)
  const { gameAppState, result, self, players, playerId } = useGameManager(
    gameId,
    serverMessage
  )
  const gameCoreProps = useGameCore(
    7,
    self,
    players,
    serverMessage,
    sendMessage
  )

  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault()
      if (gameAppState === 'STARTED') {
        localStorage.setItem('playerId', playerId)
        sendMessage({
          type: 'disconnect-player',
          player_id: localStorage.getItem('playerId'),
        })
      } else {
        localStorage.clear()
      }
    }

    window.addEventListener('beforeunload', unloadCallback)
    return () => window.removeEventListener('beforeunload', unloadCallback)
  }, [sendMessage, playerId, gameAppState])

  switch (gameAppState) {
    case 'WAITING':
    case 'INITIALIZED':
      return <WaitContainer />
    case 'CONNECTING':
      return <LinkContainer />
    case 'STARTED':
      return <BoardContainer {...gameCoreProps} />
    case 'ENDED':
      return <ResultContainer result={result} withBot={withBot} />
    default:
      return <ErrorContainer />
  }
  // return (
  //   <Fragment>
  //     {gameAppState === 'WAITING' || gameAppState === 'INITIALIZED' ? (
  //       <WaitContainer />
  //     ) : gameAppState === 'CONNECTING' ? (
  //       <LinkContainer />
  //     ) : gameAppState === 'STARTED' ? (
  //       <BoardContainer {...gameCoreProps} />
  //     ) : gameAppState === 'ENDED' ? (
  //       <ResultContainer result={result} withBot={withBot} />
  //     ) : (
  //       <ErrorContainer />
  //     )}
  //     <h6>GameAppState: {gameAppState}</h6>
  //     <h6>PlayerId: {playerId}</h6>
  //   </Fragment>
  // )
}

export default Game
