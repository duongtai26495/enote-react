import Cookies from 'js-cookie'
import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { CHECK_TYPE, NOTE_TYPE, access_token } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import TaskItem from './TaskItem'
import { memo } from 'react'
import TaskRow from './TaskRow'

const TaskList = ({ note }) => {

    const [taskList, setTaskList] = useState([])
    const [percentage, setPercent] = useState(note.progress)
    const [isUpdateProgress, setUpdateProgress] = useState(false)
    const [isExpandTask, setExpandTask] = useState(false)
    const [isUpdateList, setUpdateList] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
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

    const addNewTask = async (type) => {
        const token = Cookies.get(access_token)
        const newTask = ({ content: "New task", type, note: { id: note.id } })
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

    const deleteTaskId = (value) => {
        setDeleteId(value)
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

    const deleteTask = async () => {
        if (deleteId !== null) {
            const token = Cookies.get(access_token)
            await fetchApiData(`note/task/remove/${deleteId}`, token, "DELETE")

        }
        setUpdateList(true)
    }

    useEffect(() => {
        deleteTask()
    }, [deleteId])

    useEffect(() => {
        const timeout = setTimeout(() => {
            getAllTaskByNoteId()
        }, 500);

        return () => clearTimeout(timeout);
    }, [note.id, isUpdateList])

    const PleaceholderTask = () => {
        return (
            <ul className='w-full flex flex-row gap-1 justify-center'>
                <li onClick={() => addNewTask(CHECK_TYPE)} className='button_style-1 flex flex-row w-fit gap-2 text-xs font-bold items-center p-1 text-slate-600 rounded-md mx-2 cursor-pointer hover:bg-slate-500 hover:text-white hover:fill-white bg-white transition-all justify-center'>
                    New note <svg className='fill-slate-400 ' height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 22h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2h-2a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1H5c-1.103 0-2 .897-2 2v15c0 1.103.897 2 2 2zM5 5h2v2h10V5h2v15H5V5z" /><path d="m11 13.586-1.793-1.793-1.414 1.414L11 16.414l5.207-5.207-1.414-1.414z" /></svg>
                </li>
                <li onClick={() => addNewTask(NOTE_TYPE)} className='button_style-1 flex flex-row w-fit gap-2 text-xs font-bold items-center p-1 text-slate-600 rounded-md mx-2 cursor-pointer hover:bg-slate-500 hover:text-white hover:fill-white bg-white transition-all justify-center'>
                    New task <svg className='fill-slate-200 ' height="21" strokeWidth="1" viewBox="0 0 24 24" width="21" xmlns="http://www.w3.org/2000/svg">
                        <path className='stroke-slate-400' d="M16 5L18.2929 2.70711C18.6834 2.31658 19.3166 2.31658 19.7071 2.70711L21.2929 4.29289C21.6834 4.68342 21.6834 5.31658 21.2929 5.70711L19 8M16 5L10.2929 10.7071C10.1054 10.8946 10 11.149 10 11.4142V13C10 13.5523 10.4477 14 11 14H12.5858C12.851 14 13.1054 13.8946 13.2929 13.7071L19 8M16 5L19 8" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" />
                        <path className='stroke-slate-400' d="M6 14H5C3.89543 14 3 14.8954 3 16V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 18.8954 21 20V20C21 21.1046 20.1046 22 19 22H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </li>
            </ul>
        )
    }

    const RenderTaskList = () => {
        return (
            <div className={`${isExpandTask ? "max-h-fit" : "max-h-20"} duration-500 overflow-y-hidden transition-all`}>
                {
                    taskList.map((item, index) => (
                        <li key={index}
                            className={`flex flex-row gap-2 items-center justify-between transition-all `}>
                            <TaskRow isExpandTask={isExpandTask} deleteTaskId={deleteTaskId} updateTaskList={updateTaskList} isUpdateList={isUpdateList} updatePercentage={updatePercentage} task={item} noteId={note.id} />
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
                <div className={`w-full h-fit mb-2 transition-all`}>
                    <div className='w-full relative flex flex-col gap-2'>
                        <span className='py-1 px-2 font-bold text-sm'>Progress : {Math.round(percentage)}%</span>
                        <span className={`h-2 ${percentage === 100 ? "bg-emerald-700" : "bg-red-700 "} transition-all duration-500 ease-in-out`} style={{ width: "" + percentage + "%", minWidth: "5px" }}></span>
                    </div>
                </div>
                <PleaceholderTask />
            </div>
            <RenderTaskList />
            <div onClick={toggleExpand} className={`h-fit w-full p-2  transition-all hover:bg-opacity-100 rounded-b-md cursor-pointer`}>
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