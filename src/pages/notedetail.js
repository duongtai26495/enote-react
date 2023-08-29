import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { access_token, baseURL } from '../utils/constants';
import { checkToken, fetchApiData, getTheTime } from '../utils/functions';
import Cookies from 'js-cookie';
import TaskList from '../components/TaskList';

const NoteDetail = () => {
    const navigate = useNavigate();
    let { id } = useParams();
    const token = Cookies.get(access_token)
    const [isUpdateProgress, setUpdateProgress] = useState(false)
    const [item, setItem] = useState({})
    const [newName, setNewName] = useState(item.name)
    const [newDone, setNewDone] = useState(item.done)
    const isMounted = useRef(false);
    useEffect(() => {
        const getNoteDetail = async () => {
            if (checkToken(token)) {
                const result = await fetchApiData(`note/get/` + id, token)
                if (result.status === "SUCCESS") {
                    const data = result.content
                    setItem(data) 
                    setUpdateProgress(false)
                }
            }
        }
        getNoteDetail()
    }, [isUpdateProgress])
   

    useEffect(()=>{
        document.title = item.name
    },[item.name])

    const removeNote = async () => {

        if (item.tasks === null || item.tasks.length < 1) {
            await fetchApiData(`note/remove/${item.id}`, token, "DELETE")
            navigate("/")
        }
    }


    const updateNoteById = () => {
        let newNote = item
        newNote.name = newName
        newNote.done = newDone
        setItem(newNote)
        updateNote()
    }

    useEffect(() => {
        if (isMounted.current) {
            updateNoteById()
        } else {
            isMounted.current = true;
        }
    }, [newDone])

    const updateProgressState = (value) => {
        setUpdateProgress(value)
    }

    const updateNote = async () => {
        if (checkToken(token)) {
            if (newName === "" && item.tasks.length === 0) {
                await removeNote()
            } else {
                setItem({})
                const result = await fetchApiData(`note/update`, token, "PUT", item)
                if (result.status === "SUCCESS") {
                    const data = result.content
                    setItem(data)
                }
            }

        }
    }



    return (
        <div className='w-full'>
            <div className='bg-slate-200 p-1'>
                <button className='p-2 lg:hover:bg-slate-100 text-xs rounded bg-white shadow' onClick={() => navigate(-1)}>
                    Back to Home
                </button>
            </div>
            <div className='w-full flex flex-row gap-2 p-2 justify-between'>
                <div className='w-full flex flex-col '>
                    <input
                        className={`text-xl text-black w-full`}
                        onChange={(e) => { setNewName(e.target.value)}}
                        onBlur={updateNoteById}
                        defaultValue={item.name}
                        placeholder={'Note title'} />
                    <span className={`h-5 text-sm text-slate-400 italic`}>{item.updated_at && getTheTime(item.updated_at)}</span>
                </div>
                <div className='w-fit whitespace-nowrap h-fit'>
                    <span className={`h-5 text-sm text-slate-800 italic`}>{item.created_at}</span>
                </div>
            </div>
            <div className={`w-full h-fit mb-2 transition-all`}>
                <div className='w-full relative flex flex-col gap-2'>
                    <span className='font-bold text-sm '>Progress</span>
                    <span className='w-full bg-slate-200 h-2 relative'>
                        <span className={`h-2 ${item.progress === 100 ? "bg-emerald-700" : "bg-red-700 "} absolute top-0 left-0 progress-bar-card transition-all duration-500 ease-in-out`} style={{ width: "" + item.progress + "%", minWidth: "5px" }}></span>
                    </span>
                    <span className='text-right text-sm font-bold'>{Math.round(item.progress)}%</span>
                </div>
            </div>
            <div>

                <TaskList note={item} updateProgressState={updateProgressState} />
            </div>
        </div>
    )
}

export default NoteDetail