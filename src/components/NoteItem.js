import Cookies from 'js-cookie'
import React, { useEffect, useRef, useState, memo } from 'react'
import { access_token } from '../utils/constants'
import loading_gif from '../assets/images/loading_gif.gif'
import { checkToken, fetchApiData } from '../utils/functions'
import TaskList from './TaskList'

const NoteItem = ({ note, refreshNoteList }) => {
    const [item, setItem] = useState(note)
    const [newName, setNewName] = useState(note.name)
    const [newDone, setNewDone] = useState(note.done)
    const isMounted = useRef(false);
    const cardRef = useRef(null);

    const token = Cookies.get(access_token)
    const updateNoteById = () => {
        let newNote = item
        newNote.name = newName
        newNote.done = newDone
        setItem(newNote)
        updateNote()
    }

    const updateNote = async () => {
        if (checkToken(token)) {
            if(newName === "" && note.tasks.length === 0){
                await removeNote()
            }else{
                setItem({})
                const result = await fetchApiData(`note/update`, token, "PUT", item)
                if (result.status === "SUCCESS") {
                    const data = result.content
                    setItem(data)
                }
            }
            
        }
    }

    const removeNote = async () => {
        await fetchApiData(`note/remove/${note.id}`, token, "DELETE")
        refreshNoteList(true)
    }


    useEffect(() => {
        if (isMounted.current) {
            updateNoteById()
        } else {
            isMounted.current = true;
        }
    }, [newDone])

    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (cardRef.current && !cardRef.current.contains(event.target)) {
    //             setOpenCardSub(false)
    //         }
    //     };
    //     document.addEventListener('click', handleClickOutside);

    //     return () => {
    //         document.removeEventListener('click', handleClickOutside);
    //     };
    // }, [])

    const [openCardSub, setOpenCardSub] = useState(false)
    const toggleOpenCardSub = () => setOpenCardSub(preState => !preState)
    const toggleSetNewDone = () => setNewDone(preState => !preState)
    return (
        <div onBlur={() => setOpenCardSub(false)} className={`w-full block break-inside-avoid p-3 relative `}>
          
            <div className='flex flex-col rounded-lg bg-white bg-opacity-75 pr-2'>
                <div className='flex flex-row gap-2'>

            <button onClick={toggleSetNewDone}className={`progress-bar flex-1 relative font-bold w-full  rounded-tl-md  p-1 shadow-sm text-black text-sm hover:bg-sky-600 hover:text-white transition-all`}>
                {newDone ? "Resolved" : "In Progress"}
            </button>
            <button onClick={() => removeNote()}>
                <svg viewBox="0 0 448 512" width={"14"} height={"14"} xmlns="http://www.w3.org/2000/svg"><path d="M53.21 467c1.562 24.84 23.02 45 47.9 45h245.8c24.88 0 46.33-20.16 47.9-45L416 128H32L53.21 467zM432 32H320l-11.58-23.16c-2.709-5.42-8.25-8.844-14.31-8.844H153.9c-6.061 0-11.6 3.424-14.31 8.844L128 32H16c-8.836 0-16 7.162-16 16V80c0 8.836 7.164 16 16 16h416c8.838 0 16-7.164 16-16V48C448 39.16 440.8 32 432 32z"/></svg>
            </button>
                </div>
            <div className='w-full border-b flex flex-col p-2  '>

                {/* <div ref={cardRef} className='flex flex-row gap-2 w-full items-center justify-end '>
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
                            <button onClick={toggleSetNewDone} className={`w-fit rounded-md p-1 shadow-sm text-white text-sm ${newDone ? "bg-gray-400" : "bg-sky-600"}`}>
                                {newDone ? "Resolved" : "Resolve"}
                            </button>
                        </div>
                    </div>
                    <p onClick={toggleOpenCardSub} className='cursor-pointer hover:scale-125 transition-all'>
                        <svg className='fill-slate-600' enableBackground="new 0 0 32 32" id="Glyph" width="18" height="18" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" ><path d="M13,16c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,14.346,13,16z" id="XMLID_294_" /><path d="M13,26c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,24.346,13,26z" id="XMLID_295_" /><path d="M13,6c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,4.346,13,6z" id="XMLID_297_" /></svg>
                    </p>

                </div> */}
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
                <div className={`absolute w-full ${newDone ? "h-full" : "h-0"} bg-white overflow-hidden transition-all rounded-b-md z-10 opacity-50 top-0 left-0`}></div>
                <TaskList note={note} />
            </div>
            </div>
            
        </div>
    )
}

export default NoteItem