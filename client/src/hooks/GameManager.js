import { useState, useEffect, useReducer, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

const newGame = async (withBot = undefined) => {
  const response = await fetch(
    `http://localhost:5000/api/game${withBot ? '?bot=True' : ''}`,
    {
      method: 'POST',
    }
  )
  const json = await response.json()
  return json
}

const gameStatusReducer = (state, action) => {
  if (!action.type) return state

  switch (action.type) {
    case 'SET_GAME_ID':
      return {
        ...state,
        gameId: action.payload,
        gameAppState: 'INITIALIZED',
      }
    case 'SET_CONNECT':
      // localStorage.setItem('playerId', action.playerId)
      return {
        ...state,
        playerId: action.playerId,
        self: { piece: action.player, turn: action.turn },
      }
    case 'SET_PLAYER_INFO':
      return {
        ...state,
        players: action.players,
        gameAppState: action.players.length >= 2 ? 'STARTED' : 'CONNECTING',
      }
    case 'SET_DISCONNECT':
      return {
        ...state,
        message: `Player ${action.player} disconnect!`,
      }
    case 'ENDED': {
      const winner = action.winner
      let gameResult
      if (!winner) gameResult = 'DRAW'
      else if (winner === state.self.piece) gameResult = 'WIN'
      else gameResult = 'LOST'
      localStorage.clear()

      return {
        ...state,
        result: gameResult,
        gameAppState: 'ENDED',
      }
    }
    case 'PIECE_PLACED':
    case 'PIECE_PLACED_ERROR':
      return state
    default: {
      return state
    }
  }
}

export const useGameInitializer = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [gameId, setGameId] = useState(searchParams.get('gameId'))
  const withBot = searchParams.get('bot')

  const getNewGame = useCallback(async () => {
    if (!gameId) {
      const gameInfo = await newGame(withBot)
      setGameId(gameInfo.id)
      setSearchParams(
        Object.assign(
          { gameId: gameInfo.id },
          withBot ? { bot: withBot } : null
        )
      )
    } else {
      console.log('[useGameInitializer]:[game_id exists]:', gameId)
    }
  }, [gameId, withBot, setSearchParams])

  useEffect(() => {
    getNewGame()
  }, [getNewGame])

  return { gameId, withBot }
}

export const useGameManager = (gameId, message) => {
  const [state, dispatch] = useReducer(gameStatusReducer, {
    gameId: undefined,
    gameAppState: 'WAITING',
    self: undefined,
    players: undefined,
    playerId: undefined,
    result: undefined,
    message: '',
  })

  useEffect(() => {
    if (message && message.type) {
      dispatch(message)
    }
  }, [message])

  useEffect(() => {
    if (gameId) {
      dispatch({ type: 'SET_GAME_ID', payload: gameId })
    }
  }, [gameId])
  return {
    gameAppState: state.gameAppState,
    self: state.self,
    players: state.players,
    playerId: state.playerId,
    result: state.result,
    message: state.message,
  }
}
