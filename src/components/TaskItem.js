import Cookies from 'js-cookie'
import React, { useEffect, useRef, useState } from 'react'
import { access_token } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'

const TaskItem = ({ task, noteId, updatePercentage, updateTaskList }) => {

    const [item, setItem] = useState(task)
    const [newContent, setNewContent] = useState(task.content)
    const [newDone, setNewDone] = useState(task.done)
    const isMounted = useRef(false);

    const updateTask = async () => {
        const token = Cookies.get(access_token)
        if (checkToken(token)) {
            if (newContent === "") {
                await fetchApiData(`note/task/remove/${task.id}`, token, "DELETE")
                updateTaskList(true)
            } else {
                const result = await fetchApiData(`note/task/update`, token, "PUT", item)
                if (result.status === "SUCCESS") {
                    const data = result.content
                    setItem(data)
                }
            }
        }
    }

    const updateTaskById = () => {
        let note = { id: noteId }
        let newTask = item
        newTask.content = newContent
        newTask.done = newDone
        newTask.note = note
        setItem(newTask)
        updateTask()
        updatePercentage(true);
    }


    useEffect(() => {
        if (isMounted.current) {
            updateTaskById()
        } else {
            isMounted.current = true;
        }
    }, [newDone])

    return (
        <div className='flex flex-row gap-3 justify-between items-center px-2'>
            <input
                className='w-full my-2 p-1'
                value={newContent}
                onChange={(e) => { setNewContent(e.target.value) }}
                onBlur={updateTaskById}
                type='text'
            />
            {
                item.type === "CHECK" &&
                <input
                    className='w-4 h-4'
                    defaultChecked={item.done}
                    onChange={e => { setNewDone(e.target.checked) }}
                    type='checkbox'
                />
            }

            {/* {
                item.type === "CHECK" &&
                <button
                    className={`text-sm rounded-md ${newDone ? "bg-red-500" : "bg-slate-300"} p-1 border`}
                    onClick={() => setNewDone(true)}
                >{item.done ? "Resolved" : "Resolve"}</button>
            } */}
        </div>
    )
}

export default TaskItem