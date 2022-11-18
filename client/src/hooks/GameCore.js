import { useCallback, useEffect, useReducer } from 'react'

const initialCoreState = {
  gameStatus: undefined,
  turn: undefined,
  currentPiece: undefined,
  board: undefined,
  availableRows: undefined,
  self: undefined,
  players: undefined,
  lastMove: undefined,
  lastBoard: undefined,
}

const handleSetPlayers = (players, state) => {
  const isReady = players.length >= 2
  const firstPiece = isReady && players.find((p) => p.turn === 0).piece
  const isSelfFirst = isReady && firstPiece === state.self.piece
  return {
    ...state,
    players,
    currentPiece: isReady ? firstPiece : undefined,
    gameStatus: isSelfFirst ? 'WAITING_PIECE' : 'WAITING_PLAYER',
  }
}

const handlePlacePiece = (placement, state) => {
  const { row, side } = placement
  const { board, currentPiece } = state
  const newBoard = placePiece(board, currentPiece, row, side)
  const availability = getRowAvailabilityFromBoard(newBoard)
  return {
    ...state,
    board: newBoard,
    availableRows: availability,
    gameStatus: 'WAITING_SERVER',
    lastMove: placement,
    lastBoard: board,
  }
}

const handlePiecePlacedWaitServer = (message, state) => {
  if (
    message.player === state.currentPiece &&
    message.turn === state.turn &&
    message.row === state.lastMove.row &&
    message.side === state.lastMove.side
  ) {
    return {
      ...state,
      gameStatus: 'WAITING_PLAYER',
      turn: state.turn + 1,
      currentPiece: message.player === 'X' ? 'O' : 'X',
    }
  } else {
    console.log(
      "Received piece_placed but didn't match expected response",
      'state:',
      state,
      'message:',
      message
    )
    return state
  }
}

const handlePiecePlacedWaitPlayer = (message, state) => {
  if (message.player === state.currentPiece && message.turn === state.turn) {
    const { row, side } = message
    const { board, currentPiece } = state
    const newBoard = placePiece(board, currentPiece, row, side)
    const availability = getRowAvailabilityFromBoard(newBoard)
    return {
      ...state,
      board: newBoard,
      availableRows: availability,
      gameStatus: 'WAITING_PIECE',
      lastMove: { row, side },
      turn: state.turn + 1,
      currentPiece: message.player === 'X' ? 'O' : 'X',
    }
  } else {
    console.log(
      "Received piece_placed but didn't match expected response",
      'state:',
      state,
      'message:',
      message
    )
    return state
  }
}

const handlePiecePlacedError = (message, state) => {
  if (state.gameStatus === 'WAITING_SERVER') {
    if (message.player === state.currentPiece && message.turn === state.turn) {
      return {
        ...state,
        gameStatus: 'WAITING_PIECE',
        board: state.lastBoard,
      }
    } else {
      console.log(
        "Received piece_placed_error but didn't match expected response",
        'state',
        state,
        'message',
        message
      )
      return state
    }
  } else {
    console.log(
      "Received piece_placed_error but wasn't awaiting for confirmation",
      'state',
      state,
      'message',
      message
    )
    return state
  }
}

const handleSetMessage = (message, state) => {
  switch (message.type) {
    case 'PIECE_PLACED': {
      if (state.gameStatus === 'WAITING_SERVER') {
        return handlePiecePlacedWaitServer(message, state)
      } else if (state.gameStatus === 'WAITING_PLAYER') {
        return handlePiecePlacedWaitPlayer(message, state)
      } else {
        console.log(
          "Received piece_placed but wasn't awaiting for player or confirmation",
          'state',
          state,
          'message',
          message
        )
        return state
      }
    }
    case 'PIECE_PLACED_ERROR':
      return handlePiecePlacedError(message, state)
    default:
      return state
  }
}

export const placePiece = (board, piece, row, side) => {
  const boardRow = [...board[row]]
  let [iter, iterCondition, iterModifier] =
    side === 'L'
      ? [0, (i) => i < boardRow.length, () => iter++]
      : [boardRow.length - 1, (i) => i >= 0, () => iter--]
  for (iter; iterCondition(iter); iterModifier()) {
    if (!boardRow[iter]) {
      boardRow[iter] = piece
      break
    }
  }
}

export const getRowAvailabilityFromBoard = (board) => {
  let rowToAvailability = []
  for (let i = 0; i < board.length; i++) {
    let row = board[i]
    rowToAvailability.push(row.indexOf(undefined) > -1)
  }
  return rowToAvailability
}

const gameCoreReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SELF':
      return {
        ...state,
        self: action.payload,
      }
    case 'SET_PLAYERS': {
      const players = action.payload
      return handleSetPlayers(players, state)
    }
    case 'PLACE_PIECE': {
      const piecePlacement = action.payload
      return handlePlacePiece(piecePlacement, state)
    }
    case 'SET_MESSAGE': {
      const message = action.payload
      return handleSetMessage(message, state)
    }
    default: {
      console.log('Core Reducer: unhandled case', action)
      return state
    }
  }
}

export const useGameCore = (size, self, players, message, sendMessage) => {
  const [state, dispatch] = useReducer(gameCoreReducer, {
    ...initialCoreState,
    turn: 0,
    board: [...Array(size)].map(() =>
      Array(size)
        .fill(undefined)
        .map(() => undefined)
    ),
    availableRows: [...Array(size).fill(true)],
  })

  useEffect(() => {
    if (!state.self && self) {
      dispatch({ type: 'SET_SELF', payload: self })
    }
  }, [self, state.self])

  useEffect(() => {
    if (!players) return
    dispatch({ type: 'SET_PLAYERS', payload: players })
  }, [players])

  useEffect(() => {
    if (!message) return
    dispatch({ type: 'SET_MESSAGE', payload: message })
  }, [message])

  useEffect(() => {
    if (state.gameStatus !== 'WAIT_SERVER') return
    sendMessage({
      type: 'piece-placement',
      row: state.lastMove.row,
      side: state.lastMove.side,
    })
  }, [state.lastMove, state.gameStatus, sendMessage])

  const placePiece = useCallback((row, side) => {
    dispatch({ type: 'PLACE_PIECE', payload: { row, side } })
  }, [])

  return {
    gameStatus: state.gameStatus,
    board: state.board,
    placePiece,
    availableRows: state.availableRows,
    piece: state.self ? state.self.piece : 'O',
  }
}
