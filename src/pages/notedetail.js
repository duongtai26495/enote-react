import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ACCESS_TOKEN, URL_PREFIX } from '../utils/constants';
import { checkToken, fetchApiData, getTheTime, uploadDataFileApi } from '../utils/functions';
import Cookies from 'js-cookie';
import TaskList from '../components/TaskList';
import Breadcrumbs from '../components/Breadcrumbs';
import ProgressBar from '../components/ProgressBar';

const NoteDetail = () => {
    const navigate = useNavigate();
    let { id } = useParams();
    const token = Cookies.get(ACCESS_TOKEN)
    const [isUpdateProgress, setUpdateProgress] = useState(false)
    const [item, setItem] = useState({})
    const [workspace, setWorkspace] = useState({})
    const [newName, setNewName] = useState(item.name)
    const [newDone, setNewDone] = useState(item.done)
    const [selectedImage, setSelectedImage] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
    const [featuredImage, setFeaturedImage] = useState("")
    const isMounted = useRef(false);
    const imageRef = useRef(null)
    const newNameRef = useRef(null)
    const [changeImageLabel, setChangeImageLabel] = useState("Change Image")

    useEffect(() => {
        const getNoteDetail = async () => {
            if (checkToken(token)) {
                const result = await fetchApiData(`note/get/` + id, token)
                if (result.status === "SUCCESS") {
                    const data = result.content
                    let image = data.featured_image
                    let f_image = image ? URL_PREFIX + `public/image/${image}` : "https://source.unsplash.com/random"
                    setItem(data)
                    setFeaturedImage(f_image)
                    setWorkspace(data.workspace)
                    setUpdateProgress(false)
                }
            }
        }
        getNoteDetail()
    }, [isUpdateProgress])


    useEffect(() => {
        document.title = item.name
    }, [item.name])
    
    useEffect(() => {
        if (isMounted.current) {
            updateNoteById()
        } else {
            isMounted.current = true;
        }
    }, [newDone])
    
    const removeNote = async () => {

        if (item.tasks === null || item.tasks.length < 1) {
            await fetchApiData(`note/remove/${item.id}`, token, "DELETE")
            navigate("/")
        }
    }


    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            updateNoteById();
            newNameRef.current.blur();
        }
    };

    const updateNoteById = () => {
        let newNote = item
        newNote.name = newName
        newNote.done = newDone
        setItem(newNote)
        updateNote()
    }

 

    const updateProgressState = (value) => {
        setUpdateProgress(value)
    }

    const updateNote = async () => {
        if (checkToken(token)) {
            if (newName === "" && item.tasks.length === 0) {
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

    const upLoadSelectedImage = async () => {
        if (checkToken(token)) {
            const data = new FormData()
            data.append('f_image', selectedImage)
            const result = await uploadDataFileApi(`note/upload/${item.id}`, token, "POST", data)
            if (result.status === "SUCCESS") {
                setFeaturedImage(URL_PREFIX + "public/image/" + result.content)
                setPreviewImage(null)
                setSelectedImage(null)
                setChangeImageLabel("Image changed success")
                let clear = setTimeout(() => {
                    setChangeImageLabel("Change Image")
                }, 5000);

                return () => clearTimeout(clear);
            }
        }
    }
    const selectImageHandle = (event) => {
        const file = event.target.files[0]; // Lấy tệp đầu tiên từ danh sách tệp đã chọn

        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setPreviewImage(null)
                setChangeImageLabel("File too large (<5mb)")
                let clear = setTimeout(() => {
                    setChangeImageLabel("Change Image")
                }, 5000);

                return () => clearTimeout(clear);
            } else {

                const reader = new FileReader();

                reader.onload = (e) => {
                    // Set trước ảnh đã chọn để hiển thị
                    setPreviewImage(e.target.result);
                };

                reader.readAsDataURL(file);
                setSelectedImage(file)
            }
        }
    }

    return (
        <div className='w-full'>
            <div className='w-full flex flex-col lg:flex-row gap-2'>
                <div className='w-full'>

                    <div style={{ backgroundImage: `url(${previewImage ?? featuredImage})` }}
                        className='w-full h-60 flex bg-center bg-no-repeat relative bg-cover flex-col lg:flex-row gap-2 justify-start lg:justify-between'>
                        <div className='w-full h-full absolute top-0 left-0 flex flex-row px-5 z-10'>
                            <div className='absolute right-1 bottom-1'>
                                <input
                                    type='file'
                                    id='feature_image'
                                    name='feature_image'
                                    ref={imageRef}
                                    className='hidden'
                                    onChange={selectImageHandle}
                                />
                                {
                                    previewImage ?
                                        <div className='w-full flex flex-row gap-3'>
                                            <span onClick={() => upLoadSelectedImage()} className='text-center w-full  text-white rounded-md py-1 cursor-pointer px-2 bg-emerald-600'>
                                                Update
                                            </span>
                                            <span onClick={() => setPreviewImage(null)} className='text-center w-full  text-white rounded-md py-1 cursor-pointer px-2 bg-orange-400'>
                                                Cancel
                                            </span>
                                        </div>
                                        :
                                        <p
                                            onClick={() => imageRef.current.click()}
                                            className='cursor-pointer text-black z-20 bg-white lg:hover:bg-slate-100 rounded border px-2 py-1'>{changeImageLabel}</p>
                                }

                            </div>
                            <div className='w-full flex flex-col justify-center'>
                                <input
                                    name='name_task'
                                    id='name_task'
                                    onKeyDown={handleKeyPress}
                                    className={`text-2xl font-bold text-white w-full bg-transparent`}
                                    onChange={(e) => { setNewName(e.target.value) }}
                                    onBlur={updateNoteById}
                                    defaultValue={item.name}
                                    ref={newNameRef}
                                    placeholder={'Note title'} />
                                <span className={`h-fit lg:h-5 text-sm text-slate-200 italic`}>{item.created_at}</span>
                                <span className={`h-fit lg:h-5 text-sm text-slate-200 italic`}>{item.updated_at && getTheTime(item.updated_at)}</span>
                            </div>
                            <ProgressBar style={"fill-white"} percentage={item.progress} />
                        </div>

                        <div className='absolute top-0 left-0 h-full w-full bg-black opacity-60 z-0'></div>
                    </div>
                    <div className='flex flex-col lg:flex-row justify-start py-2 px-2 lg:items-center gap-3 w-full bg-slate-300 border-b'>
                        <Breadcrumbs text={"Back to home"} className={``} />
                        <Link className='bg-white text-xs rounded-sm p-2' to={`/workspace/${workspace.id}`} >Back to <strong>{workspace.name}</strong></Link>
                    </div>
                    <TaskList note={item} updateProgressState={updateProgressState} />
                </div>

            </div>
        </div>
    )
}

export default React.memo(NoteDetail)