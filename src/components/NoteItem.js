import Cookies from 'js-cookie'
import React, { useEffect, useRef, useState } from 'react'
import { access_token } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import TaskList from './TaskList'

const NoteItem = ({ note }) => {
    const [item, setItem] = useState(note)
    const [newName, setNewName] = useState(note.name)
    const [newDone, setNewDone] = useState(note.done)
    const isMounted = useRef(false);
    const cardRef = useRef(null);

    const updateNoteById = () => {
        let newNote = item
        newNote.name = newName
        newNote.done = newDone
        setItem(newNote)
        updateNote()
    }

    const updateNote = async () => {
        const token = Cookies.get(access_token)
        if (checkToken(token)) {
            const result = await fetchApiData(`note/update`, token, "PUT", item)
            if (result.status === "SUCCESS") {
                const data = result.content
                setItem(data)
            }
        }
    }

    useEffect(() => {
        if (isMounted.current) {
            updateNoteById()
        } else {
            isMounted.current = true;
        }
    }, [newDone])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                setOpenCardSub(false)
            }
        };
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [])

    const [openCardSub, setOpenCardSub] = useState(false)
    const toggleOpenCardSub = () => setOpenCardSub(preState => !preState)

    return (
        <div onBlur={() => setOpenCardSub(false)} className={`w-full relative break-inside-avoid flex flex-col items-center rounded-xl shadow-md hover:shadow-xl transition-all mb-3 border border-gray-200`}>
            
            <div className='w-full border-b flex flex-col p-2'>
                <div ref={cardRef} className='flex flex-row gap-2 w-full items-center justify-end'>
                    <div className={`flex flex-row gap-2 items-center justify-end overflow-hidden transition-all ${openCardSub ? "w-full" : "w-0"}`}>
                        <div className='h-fit w-fit flex flex-row gap-2 items-center '>
                            <label htmlFor='checkDone' >Done</label>
                            <input
                                id='checkDone'
                                type={"checkbox"}
                                className={"w-4 h-4"}
                                defaultChecked={note.done}
                                onChange={e => { setNewDone(e.target.checked) }}
                            />
                        </div>
                    </div>
                    <p onClick={toggleOpenCardSub} className='cursor-pointer hover:scale-125 transition-all'>
                        <svg className='fill-slate-600' enableBackground="new 0 0 32 32" id="Glyph" width="18" height="18" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" ><path d="M13,16c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,14.346,13,16z" id="XMLID_294_" /><path d="M13,26c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,24.346,13,26z" id="XMLID_295_" /><path d="M13,6c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,4.346,13,6z" id="XMLID_297_" /></svg>
                    </p>

                </div>
                <div className='w-full flex flex-col justify-between items-center gap-3 relative'>
                    <input
                        onChange={(e) => { setNewName(e.target.value) }}
                        className='min-h-fit w-full h-fit m-auto font-bold text-base my-2 text-center bg-transparent'
                        value={newName}
                        onBlur={updateNoteById}
                        type='text' />
                </div>
            </div>
            <div className='w-full relative'>
            <div className={`absolute w-full ${newDone ? "h-full" : "h-0"} overflow-hidden transition-all rounded-b-md z-10 bg-white opacity-50 top-0 left-0`}></div>
                <TaskList note={note} />
            </div>
        </div>
    )
}

export default NoteItem