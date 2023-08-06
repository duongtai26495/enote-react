import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { access_token } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import TaskItem from './TaskItem'

const TaskList = ({ note }) => {

    const [taskList, setTaskList] = useState([])
    const [percentage, setPercent] = useState(note.progress)
    const [isUpdateProgress, setUpdateProgress] = useState(false)
    const [isUpdateList, setUpdateList] = useState(false)
    const hasDoneItem = taskList.some(item => item.type === "CHECK")

    const getAllTaskByNoteId = async () => {
        const token = Cookies.get(access_token)
        if (checkToken(token) && note.id > 0) {
            const result = await fetchApiData(`note/tasks/${note.id}`, token)
            const data = result.content
            setTaskList(data)
            setUpdateList(false)
        }
    }
    const updateNoteProgress = async () => {
        const token = Cookies.get(access_token)
        if (checkToken(token) && note.id > 0) {
            note.progress = percentage
            const result = await fetchApiData(`note/update`, token, "PUT", note)
            const data = result.content
            setPercent(data.progress)
        }
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


    useEffect(() => {
        getAllTaskByNoteId()
    }, [note.id, isUpdateList])



    const RenderTaskList = () => {
        return (
            taskList.map(item => (
                <TaskItem updateTaskList={updateTaskList} updatePercentage={updatePercentage} task={item} noteId={note.id} key={item.id} />
            ))
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
            {
                hasDoneItem ?
                    <div className='w-full h-fit'>
                        <div className='w-full flex flex-col gap-2'>
                            <span className='py-1 px-2 font-bold text-emerald-700 '>Progress : {Math.round(percentage)}%</span>
                            <span className={`h-2 ${percentage === 100 ? "bg-emerald-700" : "bg-red-700 "} transition-all`} style={{ width: "" + percentage + "%", minWidth: "5px" }}></span>
                        </div>
                    </div>
                    :
                    ""
            }
            <RenderTaskList />
        </>
    )
}

export default TaskList