import Cookies from 'js-cookie'
import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { access_token } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import TaskItem from './TaskItem'

const TaskList = ({ note }) => {

    const [taskList, setTaskList] = useState([])
    const [percentage, setPercent] = useState(note.progress)
    const [isUpdateProgress, setUpdateProgress] = useState(false)
    const [isUpdateList, setUpdateList] = useState(false)
    const hasDoneItem = taskList.some(item => item.type === "CHECK")


    const updateNoteProgress = async () => {
        const token = Cookies.get(access_token)
        if (checkToken(token) && note.id > 0) {
            note.progress = percentage
            const result = await fetchApiData(`note/update`, token, "PUT", note)
            const data = result.content
            setPercent(data.progress)
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
            <li onClick={() => addNewTask()} className='flex flex-row gap-2 items-center p-2 text-slate-600 rounded-md border border-slate-400 mx-2 my-1 cursor-pointer hover:bg-slate-500 hover:text-white hover:fill-white bg-white transition-all justify-center'>
                New task <svg className='fill-slate-400 ' height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m2.513 12.833 9.022 5.04a.995.995 0 0 0 .973.001l8.978-5a1 1 0 0 0-.002-1.749l-9.022-5a1 1 0 0 0-.968-.001l-8.978 4.96a1 1 0 0 0-.003 1.749z" /><path d="m3.485 15.126-.971 1.748 9 5a1 1 0 0 0 .971 0l9-5-.971-1.748L12 19.856l-8.515-4.73zM20 8V6h2V4h-2V2h-2v2h-2v2h2v2z" /></svg>
            </li>
        )
    }

    const RenderTaskList = () => {
        return (
            taskList.map((item, index) => (
                <li key={index}
                    className='flex flex-row gap-2 items-center justify-between transition-all'>
                    <TaskItem updateTaskList={updateTaskList} isUpdateList={isUpdateList} updatePercentage={updatePercentage} task={item} noteId={note.id} />
                </li>
            ))
        )
    }

    const PercentageDone = () => {
        if (hasDoneItem) {
            const countDone = taskList.filter(item => item.done && item.type === "CHECK").length;
            const totalCount = taskList.filter(item => item.type === "CHECK").length;
            const setpercentage = (countDone / totalCount) * 100;
            setPercent(setpercentage)
            const timeout = setTimeout(() => {
                updateNoteProgress()
            }, 500);
            clearTimeout(timeout);
            setUpdateProgress(false)
        }
    }

    return (
        <>
            <div className={`${hasDoneItem ? "block" : "hidden"} w-full h-fit`}>
                <div className='w-full flex flex-col gap-2'>
                    <span className='py-1 px-2 font-bold text-sm'>Progress : {Math.round(percentage)}%</span>
                    <span className={`h-2 ${percentage === 100 ? "bg-emerald-700" : "bg-red-700 "} transition-all duration-500 ease-in-out`} style={{ width: "" + percentage + "%", minWidth: "5px" }}></span>
                </div>
            </div>
            <PleaceholderTask />
            <RenderTaskList />
        </>
    )
}

export default TaskList