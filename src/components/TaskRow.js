import Cookies from 'js-cookie'
import React, { useEffect, useRef, useState } from 'react'
import { access_token } from '../utils/constants'
import loading_gif from '../assets/images/loading_gif.gif'
import { checkToken, fetchApiData } from '../utils/functions'

const TaskRow = ({ task, noteId, updatePercentage, isUpdateList, deleteTaskId }) => {


    const [newContent, setNewContent] = useState(task.content)
    const [newState, setNewState] = useState(task.done)
    const [isOpenSetting, setOpenSetting] = useState(false)
    const [isUpdating, setUpdating] = useState(false)
    const isMounted = useRef(false);

    const toggleSubSetting = () => setOpenSetting(preState => !preState)
    const updateTask = async (item) => {
        setUpdating(true)
        const token = Cookies.get(access_token)
        if (checkToken(token)) {
            const result = await fetchApiData(`note/task/update`, token, "PUT", item)
            if (result.status === "SUCCESS") {
                const data = result.content
                setNewContent(data.content)
                setNewState(data.done)
            }
        }
        setUpdating(false)
    }

    const removeTask = () => {
        deleteTaskId(task.id)
        setOpenSetting(false)
    }

    const updateTaskById = async () => {
        if(newContent === ""){
            removeTask()
        }
        let item = task
        let note = { id: noteId }
        item.note = note
        item.content = newContent
        item.done = newState
        await updateTask(item)
        updatePercentage(true);
    }

    const updateContent = (e) => {
 
        let newTaskContent = e.target.value
        setNewContent(newTaskContent)
    }

    useEffect(() => {
        if (isMounted.current) {
            updateTaskById()
        } else {
            isMounted.current = true;
        }
    }, [newState])
    return (
        <div className={`h-fit overflow-y-hidden transition-all bg-transparent m-2 rounded-md flex-1 flex flex-row gap-5 justify-between items-center px-2 relative border`}>
            <div className={`${isOpenSetting ? "visible" : "invisible"} h-full w-full transition-all rounded-md z-10 overflow-hidden absolute top-0 left-0`}>
                <div className='w-full h-full rounded-md flex flex-row items-center justify-center m-auto gap-3 border bg-opacity-50 bg-black'>
                    <button onClick={() => removeTask()} className=' p-1 rounded-md bg-orange-600 text-white text-sm'>Delete</button>
                    <button onClick={toggleSubSetting} className=' p-1 rounded-md bg-slate-600 text-white text-sm'>Cancel</button>
                </div>
            </div>
            <div className={`${isUpdateList && deleteTaskId === task.id ? "visible" : "invisible"} absolute top-0 left-0 w-full h-full bg-white rounded-md flex flex-row items-center justify-center`}>
                <img src={loading_gif} className='w-8 h-8' />
            </div>
            <div className='flex flex-row items-center w-4 h-full justify-center gap-1 mx-auto'>
                <p onClick={toggleSubSetting} className='cursor-pointer hover:scale-125 transition-all flex-1'>
                    {/* <svg enableBackground="new 0 0 32 32" height="16" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="16" xmlns="http://www.w3.org/2000/svg" ><g><polyline fill="none" points="   649,137.999 675,137.999 675,155.999 661,155.999  " stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" /><polyline fill="none" points="   653,155.999 649,155.999 649,141.999  " stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" /><polyline fill="none" points="   661,156 653,162 653,156  " stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" /></g><g><path d="M28,6h-6.382l-1.724-3.447C19.725,2.214,19.379,2,19,2h-6c-0.379,0-0.725,0.214-0.895,0.553L10.382,6H4   C3.448,6,3,6.448,3,7s0.448,1,1,1h20v20H8V11c0-0.552-0.448-1-1-1s-1,0.448-1,1v18c0,0.553,0.448,1,1,1h18c0.553,0,1-0.447,1-1V8h2   c0.553,0,1-0.448,1-1S28.553,6,28,6z M13.618,4h4.764l1,2h-6.764L13.618,4z" /><path d="M14,24V14c0-0.552-0.448-1-1-1s-1,0.448-1,1v10c0,0.553,0.448,1,1,1S14,24.553,14,24z" /><path d="M20,24V14c0-0.552-0.447-1-1-1s-1,0.448-1,1v10c0,0.553,0.447,1,1,1S20,24.553,20,24z" /></g></svg> */}
                    <svg width={"18"} height={"18"} enableBackground="new 0 0 32 32" id="Glyph" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"  ><path d="M13,16c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,14.346,13,16z" id="XMLID_294_" /><path d="M13,26c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,24.346,13,26z" id="XMLID_295_" /><path d="M13,6c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,4.346,13,6z" id="XMLID_297_" /></svg>
                </p>
                <input
                    className={`w-6 h-6 ${task.type === "CHECK" ? "block" : "hidden"} flex-1`}
                    defaultChecked={newState}
                    onChange={e => { setNewState(e.target.checked) }}
                    type='checkbox'
                />
            </div>
            <textarea
                disabled={isUpdating}
                className='w-full my-2 p-1 bg-transparent'
                value={newContent}
                rows={1}
                onChange={e => { updateContent(e) }}
                onBlur={updateTaskById}
            ></textarea>
        </div>
    )
}

export default TaskRow