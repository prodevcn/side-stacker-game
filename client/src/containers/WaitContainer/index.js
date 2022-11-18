import BasicContainer from '../BasicContainer'
import Spinner from '../../components/Spinner'

const WaitContainer = () => {
  return (
    <BasicContainer>
      <h2 className="highlight-text">Creating a new game!</h2>
      <Spinner className="spinner" />
    </BasicContainer>
  )
}

export default WaitContainer
