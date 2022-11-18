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
  const { gameId } = useGameInitializer()
  const { serverMessage, sendMessage } = useGameClient(gameId)
  const { gameStatus, result, self, players, message } = useGameManager(
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
  const gameManagerProps = {
    gameStatus,
    result,
    self,
    message,
    gameId,
  }

  useEffect(() => {
    console.log('Got Server Message', JSON.stringify(serverMessage))
    console.log(gameId)
  }, [serverMessage])

  return (
    <GameUI gameManagerProps={gameManagerProps} gameProps={gameCoreProps} />
  )
}

const GameUI = ({ gameManagerProps, gameCoreProps }) => {
  switch (gameManagerProps.gameStatus) {
    case 'WAITING':
    case 'INITIALIZED':
      return <WaitContainer />
    case 'CONNECTING':
      return <LinkContainer />
    case 'STARTED':
      return <BoardContainer {...gameCoreProps} />
    case 'ENDED':
      return <ResultContainer result={gameManagerProps.result} />
    default:
      return <ErrorContainer />
  }
}

export default Game
