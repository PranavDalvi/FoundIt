import React from 'react'
import "./backdrop.scss"

export const Backdrop = ({children, onClick}) => {
  return (
    <div className='backdrop'onClick={onClick}>{children}</div>
  )
}
