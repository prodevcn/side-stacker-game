import BasicContainer from '../BasicContainer'
import Spinner from '../../components/Spinner'

const WaitContainer = () => {
  return (
    <BasicContainer>
      <h4 className="highlight-text">Creating a new game!</h4>
      <Spinner className="spinner" />
    </BasicContainer>
  )
}

export default WaitContainer
