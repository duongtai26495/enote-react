import Cookies from 'js-cookie'
import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { CHECK_TYPE, NOTE_TYPE, SELECTED_SORT, SELECTED_TASK_SORT, SORT_TASK_ITEMS, ACCESS_TOKEN, CURRENT_TASK_PAGE, SORTS } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import TaskRow from './TaskRow'
import LoadingAnimation from './LoadingAnimation'
import LoadingComponent from './LoadingComponent'
import Pagination from './Pagination'
import { useTranslation } from 'react-i18next'

const TaskList = ({ note, updateProgressState }) => {

    const {t} = useTranslation()
    const [taskList, setTaskList] = useState(note.tasks)
    const [isUpdateList, setUpdateList] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [selectedSort, setSelectedSort] = useState(JSON.parse(localStorage.getItem(SELECTED_TASK_SORT)) ?? "updated_at_desc")

    const isMounted = useRef(false);
    const [isLoaded, setLoaded] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [elementPerPage, setElPerPage] = useState(0)
    const [maxElelentPerPage, setMaxElPerPage] = useState(0)
    const [emptyList, setEmptyList] = useState(true)

    const firstPage = 1

    const token = Cookies.get(ACCESS_TOKEN)

    const addNewTask = async (type) => {
        if (checkToken(token)) {
            const newTask = ({ content: "New task", type, note: { id: note.id } })
            const result = await fetchApiData(`note/task/add`, token, "POST", JSON.stringify(newTask))
            const data = result.content
            if (taskList?.length >= maxElelentPerPage) {
                await getTaskInBackground()
            } else {
                taskList ? setTaskList(oldData => [data, ...oldData]) : setTaskList(data)
            }

        } else {
            console.log("Token is expired")
        }
    }
    const setPage = (TYPE) => {
        switch (TYPE) {
            case "PREV":
                if (currentPage > 1) {
                    let current = Number(currentPage) - 1
                    setCurrentPage(current)
                    localStorage.setItem(CURRENT_TASK_PAGE, current)
                }
                break;
            case "NEXT":
                if (currentPage < maxPage) {
                    let current = Number(currentPage) + 1
                    setCurrentPage(current)
                    localStorage.setItem(CURRENT_TASK_PAGE, current)
                }
                break;
        }
    }

    const sortHandle = (value) => {
        setSelectedSort(value.target.value)
        localStorage.setItem(SELECTED_TASK_SORT, JSON.stringify(value.target.value))
    }
    const updatePercentage = (newPercentage) => {
        updateProgressState(newPercentage);
    }

    const updateTaskList = async (update) => {
        setUpdateList(update)
        await updateListTask()
    }

    const updateListTask = async () => {
        let newTaskList = taskList;
        if (deleteId) {
            newTaskList = taskList.filter(item => item.id !== deleteId);
            await deleteTask()
        }
        if (newTaskList?.length < maxElelentPerPage) {
            await getTaskInBackground()
        } else {
            setTaskList(newTaskList)
        }
        setUpdateList(false)
        setLoaded(false)
        updateProgressState(false)
    }


    const deleteTaskId = (value) => {
        setDeleteId(value)
    }

    
  const RenderSort = () => {
    const sortValues = SORTS.filter((item, index) => (index >= 0 && index <= 2));

    return (
      <div className='w-fit flex gap-1 items-center font-bold'>
      <label className='hidden lg:block text-sm whitespace-nowrap'>{t('sorts.sorting')}</label>
      <select className='w-full lg:w-fit bg-white border p-2 font-bold cursor-pointer rounded-md text-sm' name='sort_note' id='sort_note'
        value={selectedSort} onChange={(e) => sortHandle(e)}>
        {sortValues?.map((item, index) => {
          return (
            <option key={index} value={item.value}>{t(item.name)}</option>
          );
        })}

      </select>
      </div>
    )
  }


    const getTaskInBackground = async () => { 
        let page = currentPage > 0 ? Number(currentPage) - 1 : 0
        const result = await fetchApiData(`note/tasks/${note.id}?page=${page}&size=10&sort=${selectedSort}`, token)
        const maxPageResult = result.totalPages
        const data = result.content
        if (data && data?.length > 0) {
            setTaskList(result.content);
        } else {
            setTaskList([])
            setCurrentPage(firstPage)
        }
        setEmptyList(result.empty)
        setElPerPage(result.totalElements)
        setMaxElPerPage(result.size)
        setMaxPage(maxPageResult)
        return result
    }

    const getAllTaskByNoteId = async () => {
        setLoaded(true)
        const token = Cookies.get(ACCESS_TOKEN)
        if (checkToken(token) && note.id > 0) {
            await getTaskInBackground()
            setUpdateList(false)
        }
        setLoaded(false)
    }

    const deleteTask = async () => {
        if (deleteId !== null) {
            const token = Cookies.get(ACCESS_TOKEN)
            await fetchApiData(`note/task/remove/${deleteId}`, token, "DELETE")
            setDeleteId(null)

        }
        updateProgressState(true)
    }

    useEffect(() => {
        if (isMounted.current) {
            updateListTask()
        } else {
            isMounted.current = true;
        }
    }, [deleteId, maxPage])

    useEffect(() => {
        getAllTaskByNoteId()
    }, [note.id, isUpdateList, selectedSort, currentPage])

    const PleaceholderTask = () => {
        return (
            <ul className='w-full flex flex-row gap-3 justify-start'>
                <li onClick={() => addNewTask(CHECK_TYPE)} className='whitespace-nowrap button_style-1 flex flex-row w-fit gap-2 text-xs font-bold items-center p-1 text-slate-600 rounded-sm cursor-pointer lg:hover:bg-slate-500 lg:hover:text-white hover:fill-white bg-white transition-all justify-center'>
                    {t('task.new_task')} <svg className='fill-slate-400 ' height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 22h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2h-2a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1H5c-1.103 0-2 .897-2 2v15c0 1.103.897 2 2 2zM5 5h2v2h10V5h2v15H5V5z" /><path d="m11 13.586-1.793-1.793-1.414 1.414L11 16.414l5.207-5.207-1.414-1.414z" /></svg>
                </li>
                <li onClick={() => addNewTask(NOTE_TYPE)} className='whitespace-nowrap button_style-1 flex flex-row w-fit gap-2 text-xs font-bold items-center p-1 text-slate-600 rounded-sm cursor-pointer lg:hover:bg-slate-500 lg:hover:text-white hover:fill-white bg-white transition-all justify-center'>
                {t('task.new_note')} <svg className='fill-slate-200 ' height="21" strokeWidth="1" viewBox="0 0 24 24" width="21" xmlns="http://www.w3.org/2000/svg">
                        <path className='stroke-slate-400' d="M16 5L18.2929 2.70711C18.6834 2.31658 19.3166 2.31658 19.7071 2.70711L21.2929 4.29289C21.6834 4.68342 21.6834 5.31658 21.2929 5.70711L19 8M16 5L10.2929 10.7071C10.1054 10.8946 10 11.149 10 11.4142V13C10 13.5523 10.4477 14 11 14H12.5858C12.851 14 13.1054 13.8946 13.2929 13.7071L19 8M16 5L19 8" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" />
                        <path className='stroke-slate-400' d="M6 14H5C3.89543 14 3 14.8954 3 16V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 18.8954 21 20V20C21 21.1046 20.1046 22 19 22H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </li>

            </ul>
        )
    }


    const RenderTaskList = () => {
        return (
            <div className={`h-fit w-full duration-500 overflow-y-hidden transition-all px-2`}>
                {
                    taskList?.map((item, index) => (
                        <li
                            key={index}
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
            <div className='bg-transparent p-2 flex flex-row justify-between sticky z-40 top-0'>
                <PleaceholderTask />
                <RenderSort />
            </div>
            {
                isLoaded ?
                    <LoadingComponent className={`flex mt-5`} size='w-10 h-10' />
                    :
                    <>
                        <RenderTaskList />
                        <Pagination
                            className={`${taskList?.length > 0 ? "flex" : "hidden"} overflow-hidden justify-center my-3`}
                            currentPage={currentPage}
                            maxPage={maxPage}
                            firstPage={firstPage}
                            setCurrentPage={setCurrentPage}
                            setPage={setPage}
                        />
                    </>
            }

        </>
    )
}



export default React.memo(TaskList)