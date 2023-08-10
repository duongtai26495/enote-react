import Cookies from 'js-cookie'
import React, { useEffect, useRef, useState } from 'react'
import { access_token } from '../utils/constants'
import loading_gif from '../assets/images/loading_gif.gif'
import { checkToken, fetchApiData } from '../utils/functions'
import TaskList from './TaskList'

const TaskItem = ({ task, noteId, updatePercentage, updateTaskList, isUpdateList }) => {

    const [item, setItem] = useState(task)
    const [newContent, setNewContent] = useState(task.content)
    const [newDone, setNewDone] = useState(task.done)
    const isMounted = useRef(false);
    const [isUpdating, setUpdating] = useState(false)
    const [isOpenSetting, setOpenSetting] = useState(false)
    const updateTask = async () => {

        const token = Cookies.get(access_token)
        if (checkToken(token)) {
            if (newContent === "") {
                await deleteTask()
            } else {
                const result = await fetchApiData(`note/task/update`, token, "PUT", item)
                if (result.status === "SUCCESS") {
                    const data = result.content
                    setItem(data)
                }
            }
        }
    }

    const deleteTask = async () => {
        const token = Cookies.get(access_token)
        await fetchApiData(`note/task/remove/${task.id}`, token, "DELETE")
        updateTaskList(true)
    }

    const updateTaskById = () => {

        setUpdating(true)
        let note = { id: noteId }
        let newTask = item
        newTask.content = newContent
        newTask.done = newDone
        newTask.note = note
        setItem(newTask)
        updateTask()
        updatePercentage(true);
        setUpdating(false)
    }


    useEffect(() => {
        if (isMounted.current) {
            updateTaskById()
        } else {
            isMounted.current = true;
        }
    }, [newDone])

    const adjustTextAreaHeight = (element) => {
        element.style.height = 'auto';
        element.style.height = element.scrollHeight + 'px';
    };

    const toggleSubSetting = () => setOpenSetting(preState => !preState)
    const toggleSetNewDone = () => setNewDone(preState => !preState)
    return (
        <div className={`bg-transparent m-2 rounded-md flex-1 flex flex-row gap-3 justify-between items-start px-2 relative border`}>
            <div className={`${isOpenSetting ? "visible" : "invisible"} h-full w-full transition-all rounded-md z-10 overflow-hidden absolute top-0 left-0`}>
                <div className='w-full h-full rounded-md flex flex-row items-center justify-center m-auto gap-3 border bg-opacity-50 bg-black'>
                    <button onClick={()=>deleteTask()} className=' p-1 rounded-md bg-orange-600 text-white text-sm'>Delete</button>
                    <button onClick={toggleSubSetting} className=' p-1 rounded-md bg-slate-600 text-white text-sm'>Cancel</button>
                </div>
            </div>
            <div className={`${isUpdateList ? "visible" : "invisible"} absolute top-0 left-0 w-full h-full bg-white rounded-md flex flex-row items-center justify-center`}>
                <img src={loading_gif} className='w-8 h-8' />
            </div>
            <div className='flex flex-col items-center w-4 h-full justify-center gap-3 mt-4 mx-auto'>
                <p onClick={toggleSubSetting} className='cursor-pointer hover:scale-125 transition-all flex-1'>
                    {/* <svg enableBackground="new 0 0 32 32" height="16" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="16" xmlns="http://www.w3.org/2000/svg" ><g><polyline fill="none" points="   649,137.999 675,137.999 675,155.999 661,155.999  " stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" /><polyline fill="none" points="   653,155.999 649,155.999 649,141.999  " stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" /><polyline fill="none" points="   661,156 653,162 653,156  " stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" /></g><g><path d="M28,6h-6.382l-1.724-3.447C19.725,2.214,19.379,2,19,2h-6c-0.379,0-0.725,0.214-0.895,0.553L10.382,6H4   C3.448,6,3,6.448,3,7s0.448,1,1,1h20v20H8V11c0-0.552-0.448-1-1-1s-1,0.448-1,1v18c0,0.553,0.448,1,1,1h18c0.553,0,1-0.447,1-1V8h2   c0.553,0,1-0.448,1-1S28.553,6,28,6z M13.618,4h4.764l1,2h-6.764L13.618,4z" /><path d="M14,24V14c0-0.552-0.448-1-1-1s-1,0.448-1,1v10c0,0.553,0.448,1,1,1S14,24.553,14,24z" /><path d="M20,24V14c0-0.552-0.447-1-1-1s-1,0.448-1,1v10c0,0.553,0.447,1,1,1S20,24.553,20,24z" /></g></svg> */}
                    <svg width={"18"} height={"18"} enableBackground="new 0 0 32 32" id="Glyph" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"  ><path d="M13,16c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,14.346,13,16z" id="XMLID_294_" /><path d="M13,26c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,24.346,13,26z" id="XMLID_295_" /><path d="M13,6c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,4.346,13,6z" id="XMLID_297_" /></svg>
                </p>
                <input
                    className={`w-6 h-6 ${item.type === "CHECK" ? "block" : "hidden"} flex-1`}
                    defaultChecked={item.done}
                    onChange={e => { setNewDone(e.target.checked) }}
                    type='checkbox'
                />
            </div>

            {/* <button onClick={toggleSetNewDone} className={`${item.type === "CHECK" ? "block" : "hidden"} w-fit rounded-sm p-1 shadow-sm text-white text-sm ${newDone ? "bg-emerald-700" : "bg-sky-600"}`}>
                {newDone ? "Resolved" : "Resolve"}
            </button> */}

            {
                // item.type === "CHECK" ?
                //     <input
                //         className='w-full my-2 p-1 bg-transparent'
                //         value={newContent}
                //         onChange={(e) => { setNewContent(e.target.value) }}
                //         onBlur={updateTaskById}
                //         type='text'
                //     />
                //     :
                <textarea
                    className='w-full my-2 p-1 bg-transparent'
                    defaultValue={newContent}
                    onChange={(e) => {
                        setNewContent(e.target.value)
                        adjustTextAreaHeight(e.target);
                    }}
                    onBlur={updateTaskById}
                    type='text'
                ></textarea>
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

export default React.memo(TaskItem)