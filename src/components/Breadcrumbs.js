import React from 'react'
import { useNavigate } from 'react-router-dom'

const Breadcrumbs = ({className, text}) => {
    const navigate = useNavigate()
    return (
        <div className={`bg-slate-300 p-2 ${className}`}>
            
            <button className='p-2 flex flex-rpw gap-2 lg:hover:bg-slate-100 text-xs rounded bg-white shadow' onClick={() => navigate(-1)}>
            <svg height={16} width={16} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M5.828 7l2.536 2.536L6.95 10.95 2 6l4.95-4.95 1.414 1.414L5.828 5H13a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H5.828z"/></g></svg>
                {text}
            </button>
        </div>
    )
}

export default Breadcrumbs