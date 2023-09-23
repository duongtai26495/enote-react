import React from 'react'
import Breadcrumbs from '../components/Breadcrumbs'
import NoteList from '../components/NoteList'
import { useParams } from 'react-router-dom'

const WorkspaceDetail = () => {

    const {id} = useParams()

  return (
    <div className='w-full flex flex-col gap-2'>
    <Breadcrumbs text={"Back to home"} className={`w-full`} />
    
    <NoteList id={id} />
    </div>
  )
}

export default WorkspaceDetail