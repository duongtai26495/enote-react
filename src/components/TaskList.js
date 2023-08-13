import Cookies from 'js-cookie'
import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { access_token } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import TaskItem from './TaskItem'
import { memo } from 'react'

const TaskList = ({ note }) => {

    const [taskList, setTaskList] = useState([])
    const [percentage, setPercent] = useState(note.progress)
    const [isUpdateProgress, setUpdateProgress] = useState(false)
    const [isExpandTask, setExpandTask] = useState(false)
    const [isUpdateList, setUpdateList] = useState(false)
    const hasDoneItem = taskList.some(item => item.type === "CHECK")


    const updateNoteProgress = async () => {
        const token = Cookies.get(access_token)
        if (checkToken(token) && note.id > 0) {
            note.progress = percentage
            const result = await fetchApiData(`note/update`, token, "PUT", note)
            const data = result.content
            const timeout = setTimeout(() => {
                setPercent(data.progress)
            }, 500);

            clearTimeout(timeout);
        }
    }

    const addNewTask = async () => {
        const token = Cookies.get(access_token)
        const newTask = ({ content: "New task", type: "CHECK", note: { id: note.id } })
        const result = await fetchApiData(`note/task/add`, token, "POST", newTask)
        const data = result.content
        setTaskList(oldData => [data, ...oldData])
    }

    const updatePercentage = (newPercentage) => {
        setUpdateProgress(newPercentage);
    }

    const updateTaskList = (update) => {
        setUpdateList(update)
    }

    const toggleExpand = () => setExpandTask(preState => !preState)

    useEffect(() => {
        PercentageDone()
    }, [isUpdateProgress])

    const getAllTaskByNoteId = async () => {
        const token = Cookies.get(access_token)
        if (checkToken(token) && note.id > 0) {
            const result = await fetchApiData(`note/tasks/${note.id}`, token)
            const data = result.content
            setTaskList(data)
            setUpdateList(false)
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            getAllTaskByNoteId()
        }, 500);

        return () => clearTimeout(timeout);
    }, [note.id, isUpdateList])

    const PleaceholderTask = () => {
        return (
            <li onClick={() => addNewTask()} className='flex flex-row w-fit gap-2 text-xs font-bold items-center p-1 text-slate-600 rounded-md border border-slate-400 mx-2 cursor-pointer hover:bg-slate-500 hover:text-white hover:fill-white bg-white transition-all justify-center'>
                New task <svg className='fill-slate-400 ' height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m2.513 12.833 9.022 5.04a.995.995 0 0 0 .973.001l8.978-5a1 1 0 0 0-.002-1.749l-9.022-5a1 1 0 0 0-.968-.001l-8.978 4.96a1 1 0 0 0-.003 1.749z" /><path d="m3.485 15.126-.971 1.748 9 5a1 1 0 0 0 .971 0l9-5-.971-1.748L12 19.856l-8.515-4.73zM20 8V6h2V4h-2V2h-2v2h-2v2h2v2z" /></svg>
            </li>
        )
    }

    const RenderTaskList = () => {
        return (
            <div className={`${isExpandTask ? "h-fit" : "h-0"} duration-500 overflow-y-hidden transition-all`}>
                {
                    taskList.map((item, index) => (
                        <li key={index}
                            className={`flex flex-row gap-2 items-center justify-between transition-all`}>
                            <TaskItem updateTaskList={updateTaskList} isUpdateList={isUpdateList} updatePercentage={updatePercentage} task={item} noteId={note.id} />
                        </li>
                    ))
                }
            </div>
        )
    }

    const PercentageDone = () => {
        if (hasDoneItem) {
            const countDone = taskList.filter(item => item.done && item.type === "CHECK").length;
            const totalCount = taskList.filter(item => item.type === "CHECK").length;
            const setpercentage = (countDone / totalCount) * 100;
            setPercent(setpercentage)
            updateNoteProgress()
            setUpdateProgress(false)
        }
    }

    return (
        <>
            <div className=' py-2'>
                <div className={`${hasDoneItem ? "block" : "hidden"} w-full h-fit mb-2 transition-all`}>
                    <div className='w-full flex flex-col gap-2'>
                        <span className='py-1 px-2 font-bold text-sm'>Progress : {Math.round(percentage)}%</span>
                        <span className={`h-2 ${percentage === 100 ? "bg-emerald-700" : "bg-red-700 "} transition-all duration-500 ease-in-out`} style={{ width: "" + percentage + "%", minWidth: "5px" }}></span>
                    </div>
                </div>
                <PleaceholderTask />
            </div>
                <RenderTaskList />
            <div onClick={toggleExpand} className={`${taskList.length > 0 ? "flex" : "hidden"} w-full p-2  transition-all hover:bg-opacity-100 rounded-b-md cursor-pointer`}>
                <svg className={`${isExpandTask ? "rotate-180" : "rotate-0"} duration-300 transition-all fill-slate-700 m-auto`}
                    height="12" width="12" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 330 330">
                    <path id="XMLID_225_" d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
                                    c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
                                    s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"/>
                </svg>
            </div>
        </>
    )
}

export default React.memo(TaskList)