import React from 'react'
import { useNavigate } from 'react-router-dom'

const Breadcrumbs = () => {
    const navigate = useNavigate()
    return (
        <div className='bg-slate-200 p-1'>
            <button className='p-2 lg:hover:bg-slate-100 text-xs rounded bg-white shadow' onClick={() => navigate(-1)}>
                Back to Home
            </button>
        </div>
    )
}

export default Breadcrumbs