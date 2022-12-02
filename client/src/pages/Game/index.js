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
  const { gameAppState, result, self, players } = useGameManager(
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
}

export default Game
