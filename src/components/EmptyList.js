import React from 'react'
import empty_page from '../assets/images/empty_page.gif'
const EmptyList = () => {
  return (
    <div className='h-fit flex flex-col' style={{backgroundColor:"#ffffff"}}>
    <h2 className='mx-auto my-5 text-xl font-bold'>Nothing to show</h2>
      <img src={empty_page} className='m-auto' />
    </div>
  )
}

export default EmptyList