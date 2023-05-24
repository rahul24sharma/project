import React from 'react'
import { Puff } from 'react-loader-spinner'
import './Loader.css'


const Loader = () => {
  
  return (
    <div className="loadermain">
    <Puff
      height="80"
      width="80"
      radius="9"
      color="aqua"
      ariaLabel="loading"
      wrapperStyle
      wrapperClass
    />
  </div>
  
  )
}

export default Loader
