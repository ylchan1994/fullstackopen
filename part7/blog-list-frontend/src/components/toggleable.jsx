import { useImperativeHandle, useState } from 'react'

const Toggleable = (props) => {
  const [isVisible, setIsVisible] = useState(false)

  //const showWhenVisible = { display: isVisible ? '' : 'none' }
  const showWhenNotVisible = { display: isVisible ? 'none' : '' }

  const toggleVisibility = () => setIsVisible(!isVisible)

  useImperativeHandle(props.ref, () => {
    return toggleVisibility
  })

  return (
    <div>
      {!isVisible &&
        <button onClick={toggleVisibility} style={showWhenNotVisible}>{props.buttonLabel}</button>
      }
      {isVisible &&
      <div >
        {props.children}
      </div>}
    </div>
  )
}

export default Toggleable