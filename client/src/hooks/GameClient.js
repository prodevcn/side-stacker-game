/* eslint-disable no-undef */
import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

export const useGameClient = (gameId) => {
  const ws = useRef()
  const [error, setError] = useState()
  const [serverMessage, setServerMessage] = useState()

  useEffect(() => {
    if (!gameId || ws.current) return

    const playerId = localStorage.getItem('playerId') ?? 'new'

    const wsURL =
      process.env.NODE_ENV === 'development'
        ? `ws://localhost:5000/api/game/${gameId}/${playerId}`
        : window.location.protocol === 'https:'
        ? 'wss'
        : 'ws' + `://${window.location.host}/api/game/${gameId}/${playerId}`
    ws.current = new WebSocket(wsURL)
    ws.current.addEventListener('error', (err) => {
      console.error('WebSocket Error', err)
      setError(err)
    })
    ws.current.addEventListener('message', (msg) => {
      const msgData = JSON.parse(msg.data)
      console.log('[GameClient]:[new message]:', msgData)
      flushSync(() => setServerMessage(msgData))
    })
  }, [gameId])

  const sendMessage = useCallback((msg) => {
    if (!ws.current) return
    ws.current.send(JSON.stringify(msg))
  }, [])

  return { error, serverMessage, sendMessage }
}
