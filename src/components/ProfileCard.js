import React, { useEffect, useRef, useState } from 'react'
import CustomLazyLoadedImage from './CustomLazyLoadedImage'
import { useNavigate } from 'react-router-dom'
import { access_token, baseURL, localUser } from '../utils/constants'
import Cookies from 'js-cookie'
import { checkToken, fetchApiData, getTheTime, uploadDataFileApi } from '../utils/functions'

const ProfileCard = () => {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem(localUser)) ?? {})
    const token = Cookies.get(access_token)
    const [isUpdateName, setUpdateNameState] = useState(false)
    const [newFname, setNewFname] = useState(user.f_name)
    const [newLname, setNewLname] = useState(user.l_name)
    const [selectedImage, setSelectedImage] = useState(null)
    const [profileImage, setProfileImage] = useState((baseURL + "public/image/" + user.profile_image) ?? "https://source.unsplash.com/random")
    const [previewImage, setPreviewImage] = useState(null)
    const [changeImageLabel, setChangeImageLabel] = useState("Change Image")
    const imageRef = useRef(null)
    const navigate = useNavigate()

    const getUserProfile = async () => {
        if (checkToken(token)) {
            const result = await fetchApiData(`user/info/${user.username}`, token)
            if (result.status === "SUCCESS") {
                setUser(result.content)
                localStorage.setItem(localUser, JSON.stringify(result.content))
            } else {
                navigate("/login?unlogin=true")
            }
        }
    }

    useEffect(() => {
        getUserProfile()
    }, [profileImage])

    const updateUserInfo = async (newUser) => {
        if (checkToken(token)) {
            const result = await fetchApiData(`user/update`, token, "PUT", JSON.stringify(newUser))
            if (result.status === "SUCCESS") {
                let updatedUser = result.content
                console.log(updatedUser)
                setUser(updatedUser)
                localStorage.removeItem(localUser)
                localStorage.setItem(localUser, JSON.stringify(updatedUser))
                setUpdateNameState(false)
            }
        }
    }

    const updateUserHandle = async () => {
        if (newLname !== "" && newFname !== "") {
            let newUser = {
                l_name: newLname,
                f_name: newFname,
                username: user.username,
                gender: user.gender
            }

            await updateUserInfo(newUser)
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
                }, 2000);

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

    const upLoadSelectedImage = async () => {
        if (checkToken(token)) {
            const data = new FormData()
            data.append('user_profile_image', selectedImage)
            const result = await uploadDataFileApi(`user/upload/image/${user.username}`, token, "POST", data)
            if (result.status === "SUCCESS") {
                setProfileImage(baseURL + "public/image/" + result.content)
                setPreviewImage(null)
                setSelectedImage(null)
            }
        }
    }


    const toggleUpdateName = () => { setUpdateNameState(prevState => !prevState) }

    return (
        <div className='w-full h-full flex flex-row px-2 shadow-xl bg-white mt-5 rounded-xl overflow-hidden'>
            <div className='w-full flex flex-col gap-2 mt-5 border-b pb-3'>
                <div className={`w-full h-fit relative`}>
                    <CustomLazyLoadedImage
                        className={`aspect-square profile_image object-cover w-full object-center card_profile_image rounded-full mb-3 border-8 border-gray-300 shadow-sm`}
                        src={`${previewImage ?? profileImage}`}
                    />
                    <input
                        type='file'
                        id='profile_image'
                        name='profile_image'
                        ref={imageRef}
                        className='hidden'
                        onChange={selectImageHandle}
                    />
                    {
                        previewImage ?
                            <div className='w-full flex flex-row gap-3'>
                                <span onClick={() => upLoadSelectedImage()} className='text-center w-full border text-white p-2 bg-emerald-600'>
                                    Update
                                </span>
                                <span onClick={() => setPreviewImage(null)} className='text-center w-full border text-white p-2 bg-orange-400'>
                                    Cancel
                                </span>
                            </div>
                            :
                            <div onClick={() => imageRef.current.click()} className={`cursor-pointer lg:hover:bg-slate-100 transition-all text-sm w-full text-center p-2 border mb-5`}>
                                {changeImageLabel}
                            </div>
                    }
                </div>
                <h3 onClick={toggleUpdateName} className={`${isUpdateName ? "hidden" : "block"} text-2xl font-bold mb-3 w-full text-center`}>{user.f_name} {user.l_name}</h3>
                <div className={`${isUpdateName ? "flex" : "hidden"} w-full flex-col gap-3`}>
                    <div className={`w-full transition-all flex flex-row gap-3`}>
                        <input
                            type='text'
                            className='w-full px-2 py-1 rounded text-black bg-slate-100 border'
                            placeholder='First name'
                            id='profile_f_name'
                            name='profile_f_name'
                            onChange={(e) => setNewFname(e.target.value)}
                            defaultValue={newFname}
                        />
                        <input
                            type='text'
                            className='w-full px-2 py-1 rounded text-black bg-slate-100 border'
                            placeholder='Last name'
                            id='profile_l_name'
                            name='profile_l_name'
                            onChange={(e) => setNewLname(e.target.value)}
                            defaultValue={newLname}
                        />
                    </div>
                    <div className={`flex transition-all flex-row gap-3`}>
                        <span className='w-full text-center rounded border bg-emerald-700 text-white' onClick={() => { updateUserHandle() }}>Done</span>
                        <span className='w-full text-center rounded border bg-amber-500 text-white' onClick={() => { setUpdateNameState(false) }}>Cancel</span>
                    </div>
                </div>
                <p className='text-sm text-gray-600'><strong>Username:</strong> {user.username}</p>
                <p className='text-sm text-gray-600'><strong>Email:</strong> {user.email}</p>
                <p className='text-sm text-gray-600'><strong>Joined at:</strong> {getTheTime(user.joined_at)}</p>
                <p className='text-sm text-gray-600'><strong>Last edited:</strong> {getTheTime(user.updated_at)}</p>
            </div>
        </div>
    )
}

export default ProfileCard