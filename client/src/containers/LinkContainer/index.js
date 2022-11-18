import { useState, useCallback } from 'react'
import BasicContainer from '../BasicContainer'

const LinkContainer = () => {
  const [link, setLink] = useState()
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    if (!link) return
    navigator.clipboard.writeText(link.value)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }, [link])

  return (
    <BasicContainer>
      <h3>New game link: please share link to the player</h3>
      <span
        className="highlight-area"
        onClick={handleCopy}
        ref={setLink}
        role="presentation"
      >
        {window.location.href}
      </span>
      <span className="notify-content">
        {copied ? 'Copied in clipboard' : 'Click to copy'}
      </span>
    </BasicContainer>
  )
}

export default LinkContainer
