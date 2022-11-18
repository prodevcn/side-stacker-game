import { useNavigate } from 'react-router-dom'
import Process1 from '../../assets/images/process1.png'
import Process2 from '../../assets/images/process2.png'
import Process3 from '../../assets/images/process3.png'
import Process4 from '../../assets/images/process4.png'
import { ProcessDescription } from '../../lib/constant'

const Home = () => {
  const ProcessLogos = [Process1, Process2, Process3, Process4]
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/game')
  }
  return (
    <div id="home-content">
      <h3 className="highlight">Playing with friends is easy:</h3>
      <div className="process-content">
        <div id="process-description">
          {ProcessDescription.map((item, index) => (
            <div className="process-item" key={'process-item' + index}>
              <img
                src={ProcessLogos[index]}
                alt="process-1-logo"
                className="process-item-logo"
              />
              <h5 className="process-desc">{item}</h5>
            </div>
          ))}
        </div>
        <div className="control-content">
          <button className="control-btn" onClick={handleClick}>
            Start Game
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
