import { useState, useEffect, useCallback, useReducer } from 'react'
import { useSearchParams } from 'react-router-dom'

const initialState = {
  gameId: null,
  gameStatus: null,
  self: null,
  players: null,
  result: null,
  message: '',
}

const newGame = async () => {
  const response = await fetch('/api/new-game', { method: 'POST' })
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
        gameStatus: 'INITIALIZED',
      }
    case 'SET_CONNECT':
      return {
        ...state,
        self: { piece: action.player, turn: action.turn },
      }
    case 'SET_PLAYER_INFO':
      return {
        ...state,
        players: action.players,
        gameStatus: action.players.length >= 2 ? 'STARTED' : 'CONNECTING',
      }
    case 'SET_DISCONNECT':
      return {
        ...state,
        message: `Player ${action.player} disconnect!`,
      }
    case 'SET_GAME_RESULT': {
      const winner = action.winner
      let gameResult
      if (!winner) gameResult = 'DRAW'
      else if (winner === state.self.piece) gameResult = 'WIN'
      else gameResult = 'LOST'

      return {
        ...state,
        result: gameResult,
        gameStatus: 'ENDED',
      }
    }
    case 'PIECE_PLACED':
    case 'PIECE_PLACED_ERROR':
      return state
    default: {
      console.log('gameStateReducer: Unhandled message type', action)
      return state
    }
  }
}

export const useGameInitializer = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [gameId, setGameId] = useState(searchParams.get('gameId'))
  const getNewGameId = useCallback(async () => {
    if (!gameId) {
      const gameInfo = await newGame()
      setGameId(gameInfo.game_id)
      setSearchParams({ gameId: gameInfo.game_id })
    }
  }, [gameId, setSearchParams])

  useEffect(() => {
    getNewGameId()
  }, [getNewGameId])

  return { gameId }
}

export const useGameManager = (gameId, message) => {
  const [state, dispatch] = useReducer(gameStatusReducer, {
    ...initialState,
    gameStatus: 'WAITING',
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
    gameStatus: state.gameStatus,
    self: state.self,
    players: state.players,
    result: state.result,
    message: state.message,
  }
}
