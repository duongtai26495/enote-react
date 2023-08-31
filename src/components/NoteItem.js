import Cookies from 'js-cookie'
import React, { useEffect, useRef, useState, memo } from 'react'
import { access_token, baseURL } from '../utils/constants'
import loading_gif from '../assets/images/loading_gif.gif'
import { checkToken, fetchApiData, getTheTime, uploadDataFileApi } from '../utils/functions'
import TaskList from './TaskList'
import CustomLazyLoadedImage from './CustomLazyLoadedImage'
import loading_icon from '../assets/images/loading_icon.png'
import { Link } from 'react-router-dom'
const NoteItem = ({ note, removeNote }) => {
    const [item, setItem] = useState(note)
    const [newName, setNewName] = useState(note.name)
    const [newDone, setNewDone] = useState(note.done)
    const [isOpenSetting, setOpenSetting] = useState(false)
    const [featured_image, setFeatured_Image] = useState(note.featured_image)
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState("")
    const [changeImageLabel, setChangeImageLabel] = useState("Change Image")
    const isMounted = useRef(false);
    const [isChanging, setChanging] = useState(false)
    const token = Cookies.get(access_token)
    
    const updateNoteById = () => {
        let newNote = item
        newNote.name = newName
        newNote.done = newDone
        setItem(newNote)
        updateNote()
    }

    const updateNote = async () => {
        if (checkToken(token)) {
            if (newName === "" && note.tasks.length === 0) {
                await removeNote()
            } else {
                setItem({})
                const result = await fetchApiData(`note/update`, token, "PUT", item)
                if (result.status === "SUCCESS") {
                    const data = result.content
                    setItem(data)
                }
            }

        }
    }

    const removeHandle = () => {
        removeNote(note)
        toggleOpenCardSub()
    }



    useEffect(() => {
        if (isMounted.current) {
            updateNoteById()
        } else {
            isMounted.current = true;
        }
    }, [newDone])

    useEffect(() => {
        let clear = setTimeout(() => {
            setChanging(true)
            updateImage()
        }, 1000)
        return () => clearTimeout(clear);
    }, [previewImage])


    const updateImage = async () => {
        if (checkToken(token)) {
            if (selectedImage) {
                const data = new FormData()
                data.append('f_image', selectedImage)
                const result = await uploadDataFileApi(`note/upload/${note.id}`, token, "POST", data)
                if (result.status === "SUCCESS") {
                    setFeatured_Image(result.content)
                }
            }
        }
        setChanging(false)
    }

    const changeImageHandle = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            if (selectedFile.size <= 5 * 1024 * 1024) {
                const imageUrl = URL.createObjectURL(selectedFile);
                setSelectedImage(selectedFile);
                setPreviewImage(imageUrl)

            }
            else {
                setPreviewImage("")
                setChangeImageLabel("File too large (<5mb)")
                let clear = setTimeout(() => {
                    setChangeImageLabel("Change Image")
                }, 2000);

                return () => clearTimeout(clear);
            }
        }
    }


    const toggleOpenCardSub = () => setOpenSetting(preState => !preState)
    const toggleSetNewDone = () => setNewDone(preState => !preState)
    return (
        <div className={`w-full block break-inside-avoid p-3 relative`}>

            <div className='note_style-1 relative border p-2 flex flex-col rounded-lg bg-white bg-opacity-75 transition-all lg:hover:-translate-y-1'>
                <div className={`${isOpenSetting ? "flex" : "hidden"} z-10 transition-all shadow right-8 absolute top-2 bg-white border rounded`}>
                    <ul className='flex flex-col rounded'>
                        <li className='py-1 px-2 text-sm cursor-pointer lg:hover:bg-slate-300 transition-all'>Done</li>
                        <li onClick={() => { removeHandle() }} className='py-1 px-2 text-sm cursor-pointer lg:hover:bg-slate-300 transition-all'>Delete</li>
                    </ul>

                </div>
                <div className='w-full gap-2 p-1 flex flex-row justify-between items-center border-b'>
                    <span className={`h-4 text-xs text-slate-400 italic whitespace-nowrap`}>{item.created_at && getTheTime(item.created_at)}</span>
                    <span className='h-4 text-xs w-full text-end font-bold'>
                         { item.tasks?.length > 0 &&
                        "("+(item.tasks.length > 5 ? "5+" : item.tasks.length)+")"
                         }
                    </span>
                    <span className='cursor-pointer' onClick={toggleOpenCardSub}>
                        <svg height={16} width={16} enableBackground="new 0 0 32 32" id="Glyph" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"  ><path d="M13,16c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,14.346,13,16z" id="XMLID_294_" /><path d="M13,26c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,24.346,13,26z" id="XMLID_295_" /><path d="M13,6c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,4.346,13,6z" id="XMLID_297_" /></svg>
                    </span>
                </div>
                <Link to={"/note/" + note.id} className='w-full flex flex-col justify-between items-center relative'>
                    <div className={`w-full h-fit mb-2 transition-all`}>
                        <div className='w-full relative flex flex-col gap-2'>
                            <span className='font-bold text-sm '>Progress</span>
                            <span className='w-full bg-slate-200 h-2 relative'>
                                <span 
                                className={`h-2 ${note.progress === 100 ? "bg-emerald-700" : "bg-red-700 "} absolute top-0 left-0 progress-bar-card transition-all duration-500 ease-in-out`} 
                                style={{ width: "" + note.progress + "%", minWidth: "5px" }}></span>
                            </span>
                            <span className='text-right text-sm font-bold'>{Math.round(note.progress)}%</span>
                        </div>
                    </div>
                    <p className='min-h-fit whitespace-pre-line w-full h-fit m-auto font-bold text-md lg:text-xl text-center bg-transparent'>
                        {note.name}
                    </p>
                    <span className={`h-5 text-xs text-slate-400 italic`}>{item.updated_at && getTheTime(item.updated_at)}</span>
                </Link>
            </div>

        </div>
    )
}

export default React.memo(NoteItem)