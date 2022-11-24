import { useState, useEffect, useReducer, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

const newGame = async () => {
  const response = await fetch('http://localhost:5000/api/game', {
    method: 'POST',
  })
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
      return {
        ...state,
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

  const getNewGame = useCallback(async () => {
    if (!gameId) {
      const gameInfo = await newGame()
      setGameId(gameInfo.id)
      setSearchParams({ gameId: gameInfo.id })
    }
  }, [gameId, setSearchParams])

  useEffect(() => {
    getNewGame()
  }, [getNewGame])

  return gameId
}

export const useGameManager = (gameId, message) => {
  const [state, dispatch] = useReducer(gameStatusReducer, {
    gameId: undefined,
    gameAppState: 'WAITING',
    self: undefined,
    players: undefined,
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
    result: state.result,
    message: state.message,
  }
}
