const Spinner = ({ className }) => {
  return (
    <svg
      className={`${className ?? ''} icon-spins`}
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      viewBox="0 0 16 16"
    >
      <g fill="#212121">
        <path
          d="M8 15c-3.86 0-7-3.141-7-7 0-3.86 3.14-7 7-7 3.859 0 7 3.14 7 7 0 3.859-3.141 7-7 7zM8 3C5.243 3 3 5.243 3 8s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z"
          opacity=".3"
        />
        <path d="M14 9a1 1 0 0 1-1-1c0-2.757-2.243-5-5-5a1 1 0 0 1 0-2c3.859 0 7 3.14 7 7a1 1 0 0 1-1 1z" />
      </g>
    </svg>
  )
}

export default Spinner
