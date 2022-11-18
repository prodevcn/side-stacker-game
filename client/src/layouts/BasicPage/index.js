const BasicPage = (props) => {
  return (
    <div className="basic-page">
      <div className="basic-board">
        <div className="basic-title">
          <h1 className="title">SIDE - STACKER GAME</h1>
        </div>
        {props.children}
      </div>
    </div>
  )
}

export default BasicPage
