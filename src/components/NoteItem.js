import Cookies from 'js-cookie'
import React, { useEffect, useRef, useState } from 'react'
import { ACCESS_TOKEN } from '../utils/constants'
import { checkToken, fetchApiData, getTheTime, uploadDataFileApi } from '../utils/functions'
import { Link } from 'react-router-dom'
import ProgressBar from './ProgressBar'

const NoteItem = ({ note, removeNote, subclass }) => {
    const [item, setItem] = useState(note)
    const [newName, setNewName] = useState(note.name)
    const [newDone, setNewDone] = useState(note.done)
    const [isOpenSetting, setOpenSetting] = useState(false)
    const [isUpdate, setUpdate] = useState(false)
    const isMounted = useRef(false);
    const noteNameRef = useRef(null)
    const token = Cookies.get(ACCESS_TOKEN)

    const updateNoteById = () => {
        if(newName !== note.name || newDone !== note.done){
            let newNote = item
            newNote.name = newName
            newNote.done = newDone
            setItem(newNote)
            updateNote()
        }
    }

    const updateNote = async () => {
        if (checkToken(token)) {
            const result = await fetchApiData(`note/update`, token, "PUT", item)
            if (result.status === "SUCCESS") {
                const data = result.content
                setItem(data)
                setUpdate(false)
            }

        }
    }

    const removeHandle = () => {
        removeNote(note.id)
        toggleOpenCardSub()
    }


    useEffect(() => {
        if (isMounted.current) {
            updateNoteById()
        } else {
            isMounted.current = true;
        }
    }, [newDone])


    const handleKeyPress = async (e) => {
        if (e.key === "Enter") {
            updateNoteById()
            noteNameRef.current.blur()
        }
    }

    const toggleOpenCardSub = () => setOpenSetting(preState => !preState)
    const toggleUpdate = () => {
        setNewDone(prevState => !prevState)
        toggleOpenCardSub()
    }
    return (
        <div className={`w-full block break-inside-avoid py-3 relative ${subclass}`}>

            <div className={`relative border p-2 flex flex-col rounded-lg ${item.done ? "bg-teal-500 " : "bg-transparent shadow-sm"} transition-all lg:hover:-translate-y-1`}>
                <div className={`${isOpenSetting ? "flex" : "hidden"} z-10 transition-all shadow right-8 absolute top-2 bg-white border rounded`}>
                    <ul className='flex flex-col rounded'>
                        <li onClick={toggleUpdate} className='py-1 px-2 text-sm cursor-pointer lg:hover:bg-slate-300 transition-all'>Finish</li>
                        <li onClick={() => { removeHandle() }} className='py-1 px-2 text-sm cursor-pointer lg:hover:bg-slate-300 transition-all'>Delete</li>
                    </ul>

                </div>
                <div className='w-full gap-2 p-1 flex flex-row justify-between items-center border-b'>
                    <span className={` ${item.done ? "text-white" : "text-slate-500 "} card-note-time flex items-center justify-end italic whitespace-nowrap`}>{item.created_at && getTheTime(item.created_at)}</span>
                    <span className={`text-sm w-full text-end font-bold ${item.done ? "text-white " : "text-slate-500 "}`}>
                        {item.tasks?.length > 0 &&
                            "(" + (item.tasks.length > 5 ? "5+" : item.tasks.length) + ")"
                        }
                    </span>
                    <span className='w-fit cursor-pointer' onClick={toggleOpenCardSub}>
                        <svg className={`${item.done ? "fill-white" : "fill-slate-500 "} `} height={16} width={16} enableBackground="new 0 0 32 32" id="Glyph" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"  ><path d="M13,16c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,14.346,13,16z" id="XMLID_294_" /><path d="M13,26c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,24.346,13,26z" id="XMLID_295_" /><path d="M13,6c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,4.346,13,6z" id="XMLID_297_" /></svg>
                    </span>
                </div>

                <div className='min-h-fit my-5 whitespace-pre-line w-full h-fit m-auto font-bold text-md lg:text-xl text-center bg-transparent'>

                    <input
                        type='text'
                        defaultValue={newName}
                        ref={noteNameRef}
                        onChange={e => setNewName(e.target.value)}
                        onBlur={updateNoteById}
                        onKeyDown={handleKeyPress}
                        className={`${item.done ? "text-white " : "text-slate-500 "} outline-none w-full mx-auto text-sm bg-transparent border p-1 rounded block text-center`}
                    />

                </div>

                <Link to={"/note/" + note.id} className='w-full flex flex-col justify-between items-center relative'>

                    <ProgressBar percentage={note.progress} style={`${item.done ? "fill-white" : "fill-slate-400 "} `} />
                    <span className={`${item.done ? "text-white" : "text-slate-500"} h-5 text-xs italic`}>{item.updated_at && getTheTime(item.updated_at)}</span>
                </Link>

            </div>
        </div >
    )
}

export default React.memo(NoteItem)