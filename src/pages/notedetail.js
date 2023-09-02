import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { access_token, baseURL } from '../utils/constants';
import { checkToken, fetchApiData, getTheTime } from '../utils/functions';
import Cookies from 'js-cookie';
import TaskList from '../components/TaskList';
import CustomLazyLoadedImage from '../components/CustomLazyLoadedImage';
import Breadcrumbs from '../components/Breadcrumbs';

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


    useEffect(() => {
        document.title = item.name
    }, [item.name])

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
            <div className='w-full flex flex-col lg:flex-row gap-2'>
                <div className='w-full lg:w-3/4'>
                    <Breadcrumbs />
                    <div className='w-full flex flex-col lg:flex-row gap-2 p-2 justify-start lg:justify-between'>
                        <div className='w-full flex flex-col '>
                            <input
                                name='name_task'
                                id='name_task'
                                className={`text-xl text-black w-full bg-transparent`}
                                onChange={(e) => { setNewName(e.target.value) }}
                                onBlur={updateNoteById}
                                defaultValue={item.name}
                                placeholder={'Note title'} />
                            <span className={`h-fit lg:h-5 text-sm text-slate-400 italic`}>{item.updated_at && getTheTime(item.updated_at)}</span>
                        </div>
                        <div className='w-fit whitespace-nowrap h-fit'>
                            <span className={`h-fit lg:h-5 text-sm text-slate-800 italic`}>{item.created_at}</span>
                        </div>
                    </div>
                    <div className={`w-full h-fit mb-2 transition-all`}>
                        <div className='w-full relative flex flex-col gap-2'>
                            <span className='font-bold text-sm '>Progress</span>
                            <span className='w-full bg-slate-200 h-2 relative'>
                                <span className={`h-2 ${item.progress === 100 ? "bg-emerald-700" : "bg-red-700 "} delay-300 absolute top-0 left-0 progress-bar-card transition-all duration-500 ease-in-out`} style={{ width: "" + item.progress + "%", minWidth: "5px" }}></span>
                            </span>
                            <span className='text-right text-sm font-bold'>{Math.round(item.progress)}%</span>
                        </div>
                    </div>

                    <TaskList note={item} updateProgressState={updateProgressState} />
                </div>
                <div className='w-full lg:w-1/4'>
                    <CustomLazyLoadedImage
                        style={`w-full object-contain`}
                        src={item.featured_image ? baseURL + "public/image/" + item.featured_image : "https://source.unsplash.com/random"}
                    />
                </div>
            </div>
        </div>
    )
}

export default NoteDetail