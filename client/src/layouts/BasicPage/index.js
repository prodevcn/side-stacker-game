const BasicPage = (props) => {
  return (
    <div className="basic-page">
      <div className="basic-board">
        <div className="title-content">
          <h1 className="title">SIDE - STACKER GAME</h1>
        </div>
        <div className="board-content">{props.children}</div>
      </div>
    </div>
  )
}

export default BasicPage
