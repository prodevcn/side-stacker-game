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
      <h4 className="highlight-text">
        New game link: please share link to the player
      </h4>
      <input
        className="highlight-area"
        onClick={handleCopy}
        ref={setLink}
        value={window.location.href}
        readOnly
      />
      <span className="notify-content">
        {copied ? 'Copied in clipboard' : 'Click to copy'}
      </span>
    </BasicContainer>
  )
}

export default LinkContainer
