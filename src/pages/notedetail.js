import React, { useEffect, useState } from 'react'
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
    const [percentage, setPercent] = useState(item.progress)
    const hasDoneItem = item.tasks?.some(item => item.type === "CHECK")

    useEffect(() => {
        const getNoteDetail = async () => {
            if (checkToken(token)) {
                const result = await fetchApiData(`note/get/` + id, token)
                if (result.status === "SUCCESS") {
                    const data = result.content
                    setItem(data)
                }
            }
        }
        getNoteDetail()
    }, [])

    const updateNoteProgress = async () => {
        const token = Cookies.get(access_token)
        if (checkToken(token) && item.id > 0) {
            item.progress = percentage
            const result = await fetchApiData(`note/update`, token, "PUT", item)
            const data = result.content
            setPercent(data.progress)
        }

        setUpdateProgress(false)
    }

    const updateProgressState = (value) => {
        setUpdateProgress(value)
    }

    useEffect(() => {
        PercentageDone()
    }, [isUpdateProgress])

 
    useEffect(()=>{
        updateNoteProgress()
    },[percentage])

    const PercentageDone = async () => {
        if (hasDoneItem) {
            const taskList = item.tasks
            const countDone = taskList.filter(item => item.done && item.type === "CHECK").length;
            const totalCount = taskList.filter(item => item.type === "CHECK").length;
            const setpercentage = (countDone / totalCount) * 100;
            setPercent(setpercentage)
        }
    }



    return (
        <div className='w-full'>
            <div className='bg-slate-200 p-1'>
                <button className='p-2 hover:bg-slate-100 text-xs rounded bg-white shadow' onClick={() => navigate(-1)}>
                    Back to Home
                </button>
            </div>
            <div className='w-full flex flex-row gap-2 p-2 justify-between'>
                <div className='w-full flex flex-col'>
                    <input
                        className={`text-xl text-black w-fit`}
                        onChange={(e) => { }}
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
                        <span className={`h-2 ${percentage === 100 ? "bg-emerald-700" : "bg-red-700 "} absolute top-0 left-0 progress-bar-card transition-all duration-500 ease-in-out`} style={{ width: "" + percentage + "%", minWidth: "5px" }}></span>
                    </span>
                    <span className='text-right text-sm font-bold'>{Math.round(percentage)}%</span>
                </div>
            </div>
            <div>

                <TaskList note={item} updateProgressState={updateProgressState} />
            </div>
        </div>
    )
}

export default NoteDetail