import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { access_token, baseURL } from '../utils/constants';
import { checkToken, fetchApiData, getTheTime } from '../utils/functions';
import Cookies from 'js-cookie';
import TaskList from '../components/TaskList';
import CustomLazyLoadedImage from '../components/CustomLazyLoadedImage';
import Breadcrumbs from '../components/Breadcrumbs';
import ProgressBar from '../components/ProgressBar';

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
                <div className='w-full'>
                    <Breadcrumbs />
                    <div style={{backgroundImage:`url(${item.featured_image ? baseURL + "public/image/" + item.featured_image : "https://source.unsplash.com/random"})`}} 
                    className='w-full h-60 flex bg-center bg-no-repeat relative bg-cover flex-col lg:flex-row gap-2 justify-start lg:justify-between'>
                        <div className='w-full h-full absolute top-0 left-0 flex flex-row px-5 z-10'>
                            <div className='w-full flex flex-col justify-center'>
                                <input
                                    name='name_task'
                                    id='name_task'
                                    className={`text-2xl font-bold text-white w-full bg-transparent`}
                                    onChange={(e) => { setNewName(e.target.value) }}
                                    onBlur={updateNoteById}
                                    defaultValue={item.name}
                                    placeholder={'Note title'} />
                                <span className={`h-fit lg:h-5 text-sm text-slate-200 italic`}>{item.created_at}</span>
                                <span className={`h-fit lg:h-5 text-sm text-slate-200 italic`}>{item.updated_at && getTheTime(item.updated_at)}</span>
                            </div>
                            <ProgressBar style={"fill-white"} percentage={item.progress} />
                        </div>
                        <div className='absolute top-0 left-0 h-full w-full bg-black opacity-60 z-0'></div>
                    </div>
                    <TaskList note={item} updateProgressState={updateProgressState} />
                </div>

            </div>
        </div>
    )
}

export default NoteDetail