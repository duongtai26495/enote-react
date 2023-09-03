import Cookies from 'js-cookie'
import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { CHECK_TYPE, NOTE_TYPE, SELECTED_SORT, SELECTED_TASK_SORT, SORT_TASK_ITEMS, access_token } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import TaskRow from './TaskRow'

const TaskList = ({ note, updateProgressState }) => {

    const [taskList, setTaskList] = useState(note.tasks)
    const [isUpdateList, setUpdateList] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [selectedSort, setSelectedSort] = useState(JSON.parse(localStorage.getItem(SELECTED_TASK_SORT)) ?? "updated_at_desc")
    const [sortValues, setSortValues] = useState(JSON.parse(localStorage.getItem(SORT_TASK_ITEMS)))


    const addNewTask = async (type) => {
        const token = Cookies.get(access_token)
        const newTask = ({ content: "New task", type, note: { id: note.id } })
        const result = await fetchApiData(`note/task/add`, token, "POST", newTask)
        const data = result.content
        updateProgressState(true)
        setTaskList(oldData => [data, ...oldData])
    }
    const sortHandle = (value) => {
        setSelectedSort(value.target.value)
        localStorage.setItem(SELECTED_TASK_SORT, JSON.stringify(value.target.value))
    }
    const updatePercentage = (newPercentage) => {
        updateProgressState(newPercentage);
    }

    const updateTaskList = (update) => {
        setUpdateList(update)
    }

    const deleteTaskId = (value) => {
        setDeleteId(value)
    }

    const RenderSort = () => {
        return (
            <select className='w-full lg:w-fit bg-transparent border p-1 bg-white rounded-md text-sm mx-2' name='sort_task' id='sort_task' value={selectedSort} onChange={(e) => sortHandle(e)}>
                {sortValues?.map((item, index) => {
                    const keys = Object.keys(item)[0]; // Lấy key (chỉ có 1 key trong mỗi đối tượng)
                    const value = item[keys]; // Lấy giá trị

                    return (
                        <option key={index} value={value}>{keys}</option>
                    );
                })}

            </select>
        )
    }


    const getAllTaskByNoteId = async () => {
        const token = Cookies.get(access_token)
        if (checkToken(token) && note.id > 0) {
            const result = await fetchApiData(`note/tasks/${note.id}?sort=${selectedSort}`, token)
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
        updateProgressState(true)
    }

    useEffect(() => {
        deleteTask()
    }, [deleteId])

    useEffect(() => {
        const timeout = setTimeout(() => {
            getAllTaskByNoteId()
        }, 500);

        return () => clearTimeout(timeout);
    }, [note.id, isUpdateList, selectedSort])

    const PleaceholderTask = () => {
        return (
            <ul className='w-full flex flex-row gap-1 justify-start '>
                <li onClick={() => addNewTask(CHECK_TYPE)} className='whitespace-nowrap button_style-1 flex flex-row w-fit gap-2 text-xs font-bold items-center p-1 text-slate-600 rounded-md mx-2 cursor-pointer lg:hover:bg-slate-500 lg:hover:text-white hover:fill-white bg-white transition-all justify-center'>
                    New task <svg className='fill-slate-400 ' height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 22h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2h-2a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1H5c-1.103 0-2 .897-2 2v15c0 1.103.897 2 2 2zM5 5h2v2h10V5h2v15H5V5z" /><path d="m11 13.586-1.793-1.793-1.414 1.414L11 16.414l5.207-5.207-1.414-1.414z" /></svg>
                </li>
                <li onClick={() => addNewTask(NOTE_TYPE)} className='whitespace-nowrap button_style-1 flex flex-row w-fit gap-2 text-xs font-bold items-center p-1 text-slate-600 rounded-md mx-2 cursor-pointer lg:hover:bg-slate-500 lg:hover:text-white hover:fill-white bg-white transition-all justify-center'>
                    New note <svg className='fill-slate-200 ' height="21" strokeWidth="1" viewBox="0 0 24 24" width="21" xmlns="http://www.w3.org/2000/svg">
                        <path className='stroke-slate-400' d="M16 5L18.2929 2.70711C18.6834 2.31658 19.3166 2.31658 19.7071 2.70711L21.2929 4.29289C21.6834 4.68342 21.6834 5.31658 21.2929 5.70711L19 8M16 5L10.2929 10.7071C10.1054 10.8946 10 11.149 10 11.4142V13C10 13.5523 10.4477 14 11 14H12.5858C12.851 14 13.1054 13.8946 13.2929 13.7071L19 8M16 5L19 8" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" />
                        <path className='stroke-slate-400' d="M6 14H5C3.89543 14 3 14.8954 3 16V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 18.8954 21 20V20C21 21.1046 20.1046 22 19 22H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </li>

            </ul>
        )
    }

    const RenderTaskList = () => {
        return (
            <div className={`h-fit w-full duration-500 overflow-y-hidden transition-all`}>
                {
                    taskList?.map((item, index) => (
                        <li key={index}
                            className={`flex flex-row gap-2 items-center justify-between transition-all `}>
                            <TaskRow
                                deleteTaskId={deleteTaskId}
                                updateTaskList={updateTaskList}
                                isUpdateList={isUpdateList}
                                updatePercentage={updatePercentage}
                                task={item}
                                noteId={note.id} />
                        </li>
                    ))
                }
            </div>

        )
    }


    return (
        <>
            <div className='bg-slate-300 py-2 flex flex-row justify-between'>
                <PleaceholderTask />
                <RenderSort />
            </div>
            <RenderTaskList />
        </>
    )
}



export default React.memo(TaskList)