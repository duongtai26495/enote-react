import React, { useEffect, useRef, useState } from 'react'
import CustomLazyLoadedImage from './CustomLazyLoadedImage'
import { useNavigate } from 'react-router-dom'
import { ACCESS_TOKEN, URL_PREFIX, LOCAL_USER } from '../utils/constants'
import Cookies from 'js-cookie'
import { checkToken, fetchApiData, getTheTime, logoutAccount, uploadDataFileApi } from '../utils/functions'
import LoadingComponent from './LoadingComponent'

const ProfileCard = ({profileImageUrl}) => {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem(LOCAL_USER)) ?? {})
    const token = Cookies.get(ACCESS_TOKEN)
    const [isUpdateName, setUpdateNameState] = useState(false)
    const [newFname, setNewFname] = useState(user.f_name)
    const [newLname, setNewLname] = useState(user.l_name)
    const [selectedImage, setSelectedImage] = useState(null)
    const [profileImage, setProfileImage] = useState(user.profile_image ? URL_PREFIX + "public/image/" + user.profile_image : "https://source.unsplash.com/random")
    const [previewImage, setPreviewImage] = useState(null)
    const [changeImageLabel, setChangeImageLabel] = useState("Update image")
    const [changePasswordLabel, setChangePwLabel] = useState("Update password")
    const [isLoadingAvt, setLoadingAvt] = useState(false)
    const [isUpdatePassword, setUpdatePasswordState] = useState(false)
    const [isLogout, setLogout] = useState(false)
    const [newPassword, setNewPasword] = useState("")
    const [newPasswordConfirm, setNewPwConfirm] = useState("")
    const imageRef = useRef(null)
    const navigate = useNavigate()

    const getUserProfile = async () => {
        if (checkToken(token)) {
            const result = await fetchApiData(`user/info/${user.username}`, token)
            if (result.status === "SUCCESS") {
                setUser(result.content)
                localStorage.setItem(LOCAL_USER, JSON.stringify(result.content))
            } else {
                navigate("/login?unlogin=true")
            }
        }
    }
    useEffect(() => {
        document.title = user.f_name + " " + user.l_name + " - Space Application"
    }, [])

    const checkLogin = () => {
        const token = Cookies.get(ACCESS_TOKEN)
        setLogout(false)
        !checkToken(token) && navigate("/login?unlogin")
    }

    useEffect(() => {
        getUserProfile()
    }, [profileImage])

    const updateUserInfo = async (newUser) => {
        if (checkToken(token)) {
            const result = await fetchApiData(`user/update`, token, "PUT", JSON.stringify(newUser))
            if (result.status === "SUCCESS") {
                let updatedUser = result.content
                setUser(updatedUser)
                localStorage.removeItem(LOCAL_USER)
                localStorage.setItem(LOCAL_USER, JSON.stringify(updatedUser))
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
        setLoadingAvt(true)
        const file = event.target.files[0]; // Lấy tệp đầu tiên từ danh sách tệp đã chọn

        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setPreviewImage(null)
                setLoadingAvt(false)
                setChangeImageLabel("File too large (<5mb)")
                let clear = setTimeout(() => {
                    setChangeImageLabel("Update image")
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
        setLoadingAvt(false)
    }

    const upLoadSelectedImage = async () => {
        setLoadingAvt(true)
        if (checkToken(token)) {
            const data = new FormData()
            data.append('user_profile_image', selectedImage)
            const result = await uploadDataFileApi(`user/upload/image/${user.username}`, token, "POST", data)
            if (result.status === "SUCCESS") {
                setProfileImage(URL_PREFIX + "public/image/" + result.content)
                setPreviewImage(null)
                setSelectedImage(null)
                setLoadingAvt(false)
                setChangeImageLabel("Image changed success")
                let clear = setTimeout(() => {
                    setChangeImageLabel("Update image")
                }, 5000);

                return () => clearTimeout(clear);
            }
        }
        setLoadingAvt(false)
    }

    const changePasswordHandle = async () => {
        if (checkToken(token)) {

            if (newPassword === newPasswordConfirm) {
                let newUser = {
                    password: newPassword,
                    username: user.username
                }
                const result = await fetchApiData("user/update-password", token, "PUT", JSON.stringify(newUser))
                if (result.status === "SUCCESS") {
                    setUpdatePasswordState(false)
                    setChangePwLabel("Password updated")
                    let clear = setTimeout(() => {
                        setChangePwLabel("Update password")
                    }, 5000);

                    return () => clearTimeout(clear);
                }
            }
        }
    }
    const logout = () => {
        setLogout(true)
        logoutAccount()
        checkLogin()
    }
    const toggleUpdatePassword = () => { setUpdatePasswordState(prevState => !prevState) }
    const toggleUpdateName = () => { setUpdateNameState(prevState => !prevState) }

    return (
        <div className='w-full h-full flex flex-row px-2 shadow-xl bg-white rounded-xl overflow-hidden'>
            <div className='w-full flex flex-col gap-2 mt-5 border-b pb-3'>
                <div className={`w-full h-fit relative`}>
                    <div className='card_profile_image cursor-pointer relative'>
                        <LoadingComponent className={`${isLoadingAvt ? "flex" : "hidden"} bg-white bg-opacity-60 transition-all w-full h-full border-4 rounded-full absolute top-0 left-0`} />
                        <CustomLazyLoadedImage
                            onClick={()=>profileImageUrl(profileImage)}
                            className={`aspect-square profile_image object-cover w-full object-center h-full rounded-full mb-3 border-8 border-gray-300 shadow-sm`}
                            src={`${previewImage ?? profileImage}`}
                        />
                        <div className='absolute bottom-10 w-full'>
                            <button onClick={() => imageRef.current.click()} className='p-2 bg-white bg-opacity-70 block mx-auto rounded-md lg:hover:bg-opacity-100 transition-all'>
                            {changeImageLabel}
                            </button>
                        </div>
                    </div>
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
                                <button disabled={isLoadingAvt} onClick={() => upLoadSelectedImage()} className={`${isLoadingAvt ? "cursor-wait" : "cursor-pointer"} text-center w-full border text-white p-2 bg-emerald-600`}>
                                    Update
                                </button>
                                <button disabled={isLoadingAvt} onClick={() => setPreviewImage(null)} className={`${isLoadingAvt ? "cursor-wait" : "cursor-pointer"}ter text-center w-full border text-white p-2 bg-orange-400`}>
                                    Cancel
                                </button>
                            </div>
                            :
                            ""
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
                <p onClick={toggleUpdatePassword}
                    className={`${isUpdatePassword ? "hidden" : "flex"} text-red-700 border px-2 py-1 font-bold cursor-pointer transition-all text-sm w-full justify-center mx-auto text-center `}>
                    {changePasswordLabel}
                </p>
                <div className={`${isUpdatePassword ? "flex" : "hidden"} flex-col gap-3`}>
                    <input
                        type='password'
                        className='w-full px-2 py-1 rounded text-black bg-slate-100 border'
                        placeholder='New password'
                        id='new_pw'
                        name='new_pw'
                        autoFocus
                        onChange={(e) => setNewPasword(e.target.value)}
                        defaultValue={""}
                    />
                    <input
                        type='password'
                        className='w-full px-2 py-1 rounded text-black bg-slate-100 border'
                        placeholder='Confirm new password'
                        id='confirm_new_pw'
                        name='confirm_new_pw'
                        onChange={(e) => setNewPwConfirm(e.target.value)}
                        defaultValue={""}
                    />
                    <div className='w-full flex flex-row gap-3'>
                        <span onClick={() => changePasswordHandle()} className='cursor-pointer text-center w-full border text-white p-2 bg-emerald-600'>
                            Update
                        </span>
                        <span onClick={() => setUpdatePasswordState(false)} className='cursor-pointer text-center w-full border text-white p-2 bg-orange-400'>
                            Cancel
                        </span>
                    </div>
                </div>
                <button onClick={() => logout()} className={`w-full py-1 text-sm font-bold border`}>
                    {
                        isLogout ?
                            <LoadingComponent size={`w-5 h-5`} className={`flex`} />
                            :
                            <span>Log out</span>
                    }
                </button>
            </div>

        </div>
    )
}

export default ProfileCard