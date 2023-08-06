import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { access_token } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import TaskItem from './TaskItem'

const TaskList = ({ id }) => {

    const [taskList, setTaskList] = useState([])
    const [percentage, setPercent] = useState(0)
    const [isUpdateProgress, setUpdateProgress] = useState(false)
    const hasDoneItem = taskList.some(item => item.type === "CHECK")

    const getAllTaskByNoteId = async () => {
        const token = Cookies.get(access_token)
        if (checkToken(token) && id > 0) {
            const result = await fetchApiData(`note/tasks/${id}`, token)
            const data = result.content
            setTaskList(data)
        }
    }

    const updatePercentage = (newPercentage) => {
        setUpdateProgress(newPercentage);
    }

    useEffect(() => {
        PercentageDone()
    }, [isUpdateProgress, percentage])


    useEffect(() => {
        getAllTaskByNoteId()
    }, [id])

    const RenderTaskList = () => {
        return (
            taskList.map(item => (
                <TaskItem updatePercentage={updatePercentage} task={item} noteId={id} key={item.id} />
            ))
        ) 
    }

    const PercentageDone = () => {
        if (hasDoneItem) {
            const countDone = taskList.filter(item => item.done && item.type === "CHECK").length;
            const totalCount = taskList.filter(item => item.type === "CHECK").length;
            const setpercentage = (countDone / totalCount) * 100;
            setPercent(setpercentage)
            console.log(percentage)
            setUpdateProgress(false)
        }
    } 
    return (
        <>
            {
                hasDoneItem ?
                    <div className='w-full h-fit'>
                        <div className='w-full flex flex-col gap-2'>
                            <span className='py-1 px-2 font-bold text-emerald-700 '>Progress : {percentage}%</span>
                            <span className={`h-2 ${percentage === 100 ? "bg-emerald-700" : "bg-red-700 "} transition-all`} style={{ width: ""+percentage + "%" }}></span>
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