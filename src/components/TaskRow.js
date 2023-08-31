import Cookies from 'js-cookie'
import React, { useEffect, useRef, useState } from 'react'
import { CHECK_TYPE, access_token } from '../utils/constants'
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
        if (newContent === "") {
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


    const toggleNewState = () => setNewState(preState => !preState)

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
            <div className='flex flex-row items-center gap-3 w-16 border-r pr-3'>
                <p onClick={toggleSubSetting} className='cursor-pointer lg:hover:scale-125 transition-all flex-1'>
                    {/* <svg enableBackground="new 0 0 32 32" height="16" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="16" xmlns="http://www.w3.org/2000/svg" ><g><polyline fill="none" points="   649,137.999 675,137.999 675,155.999 661,155.999  " stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" /><polyline fill="none" points="   653,155.999 649,155.999 649,141.999  " stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" /><polyline fill="none" points="   661,156 653,162 653,156  " stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" /></g><g><path d="M28,6h-6.382l-1.724-3.447C19.725,2.214,19.379,2,19,2h-6c-0.379,0-0.725,0.214-0.895,0.553L10.382,6H4   C3.448,6,3,6.448,3,7s0.448,1,1,1h20v20H8V11c0-0.552-0.448-1-1-1s-1,0.448-1,1v18c0,0.553,0.448,1,1,1h18c0.553,0,1-0.447,1-1V8h2   c0.553,0,1-0.448,1-1S28.553,6,28,6z M13.618,4h4.764l1,2h-6.764L13.618,4z" /><path d="M14,24V14c0-0.552-0.448-1-1-1s-1,0.448-1,1v10c0,0.553,0.448,1,1,1S14,24.553,14,24z" /><path d="M20,24V14c0-0.552-0.447-1-1-1s-1,0.448-1,1v10c0,0.553,0.447,1,1,1S20,24.553,20,24z" /></g></svg> */}
                    <svg height="20px" width="20px" id="Layer_1" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" ><path d="M341,128V99c0-19.1-14.5-35-34.5-35H205.4C185.5,64,171,79.9,171,99v29H80v32h9.2c0,0,5.4,0.6,8.2,3.4c2.8,2.8,3.9,9,3.9,9  l19,241.7c1.5,29.4,1.5,33.9,36,33.9h199.4c34.5,0,34.5-4.4,36-33.8l19-241.6c0,0,1.1-6.3,3.9-9.1c2.8-2.8,8.2-3.4,8.2-3.4h9.2v-32  h-91V128z M192,99c0-9.6,7.8-15,17.7-15h91.7c9.9,0,18.6,5.5,18.6,15v29H192V99z M183.5,384l-10.3-192h20.3L204,384H183.5z   M267.1,384h-22V192h22V384z M328.7,384h-20.4l10.5-192h20.3L328.7,384z" /></svg>
                </p>

                <div onClick={toggleNewState} className={`${task.type === "CHECK" ? "block" : "hidden"} cursor-pointer h-4 w-4 text-start border relative`}>

                    <svg height="16px" style={{ marginTop: "-1px" }} version="1.1" viewBox="0 0 18 18" width="16px" xmlns="http://www.w3.org/2000/svg" ><title /><desc /><defs /><g fill="none" fillRule="evenodd" id="Page-1" stroke="none" strokeWidth="1"><g fill="#000000" id="Core" transform="translate(-3.000000, -87.000000)"><g id="check-box-outline-blank" transform="translate(3.000000, 87.000000)"><path d="M16,2 L16,16 L2,16 L2,2 L16,2 L16,2 Z M16,0 L2,0 C0.9,0 0,0.9 0,2 L0,16 C0,17.1 0.9,18 2,18 L16,18 C17.1,18 18,17.1 18,16 L18,2 C18,0.9 17.1,0 16,0 L16,0 L16,0 Z" id="Shape" /></g></g></g></svg>

                    <span className={`absolute w-fit left-0 ${newState ? "block" : "hidden"}`} style={{ bottom: "-1px" }}>
                        <svg fill='red' width={`20px`} height={`20px`} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M480 128c0 8.188-3.125 16.38-9.375 22.62l-256 256C208.4 412.9 200.2 416 192 416s-16.38-3.125-22.62-9.375l-128-128C35.13 272.4 32 264.2 32 256c0-18.28 14.95-32 32-32c8.188 0 16.38 3.125 22.62 9.375L192 338.8l233.4-233.4C431.6 99.13 439.8 96 448 96C465.1 96 480 109.7 480 128z" /></svg>
                    </span>
                </div>
            </div>
            {
                task.type === CHECK_TYPE ?
                    <textarea
                    id='content_task'
                    name='content_task'
                        disabled={isUpdating}
                        className='w-full my-2 p-1 bg-transparent'
                        value={newContent}
                        rows={1}
                        onChange={e => { updateContent(e) }}
                        onBlur={updateTaskById}
                    ></textarea>
                    :
                    <input
                        id='content_task'
                        name='content_task'
                        type='text'
                        disabled={isUpdating}
                        className='w-full my-2 p-1 bg-transparent'
                        value={newContent}
                        onChange={e => { updateContent(e) }}
                        onBlur={updateTaskById}
                    />
            }
        </div>
    )
}

export default TaskRow