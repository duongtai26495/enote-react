import React, { useState } from 'react'
import { ACTIVATE_EMAIL, URL_PREFIX } from '../utils/constants';
import { fetchApiData } from '../utils/functions';
import { Link, useNavigate } from 'react-router-dom';
import AuthenLogo from '../components/AuthenLogo';
import LoadingComponent from '../components/LoadingComponent';

const RegisterPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('UNKNOWN'); // Mặc định là UNKNOWN
    const [err, setErr] = useState(false)
    const [isLoading, setLoading] = useState(false)

    const [checkUsernameIsExist, setCheckUsernameIsExist] = useState(false)
    const [isUsernameExist, setUsernameExist] = useState(false)
    const [checkedDone, setCheckedDone] = useState(false)

    const [checkEmailIsExist, setCheckEmailIsExist] = useState(false)
    const [isEmailExist, setEmailExist] = useState(false)
    const [checkedEmailDone, setCheckedEmailDone] = useState(false)


    const navigate = useNavigate()
    const handleRegister = async () => {

        setLoading(true)
        // Xử lý đăng ký ở đây
        if (password === confirmPassword) {
            const user = {
                f_name: firstName,
                l_name: lastName,
                username,
                email,
                password,
                gender
            }
            try {
                const result = await fetchApiData("public/sign-up", null, "POST", user)
                localStorage.setItem(ACTIVATE_EMAIL, email)
                result.status === "SUCCESS" ? navigate("/activate-account") : setErr(true)
            } catch (error) {
                setErr(true)
            }
            finally {
                setLoading(false)
            }

        }
    };


    const checkUsernameAvailable = async () => {
        if (username.length > 5) {
            setCheckUsernameIsExist(true)
            setCheckedDone(false)
            const result = await fetchApiData(`public/check-username/${username.toLowerCase()}`)
            const checkWait = setTimeout(() => {
                setUsernameExist(result)
                setCheckedDone(true)
                setCheckUsernameIsExist(false)
            }, 1500)
            return () => clearTimeout(checkWait);
        } else {
            setCheckUsernameIsExist(false)
            setCheckedDone(false)
        }
    }

    const checkEmailAvailable = async () => {
        if (email.length > 5) {
            setCheckEmailIsExist(true)
            setCheckedEmailDone(false)
            const result = await fetchApiData(`public/check-email/${email.toLowerCase()}`)
            const checkWait = setTimeout(() => {
                setEmailExist(result)
                setCheckedEmailDone(true)
                setCheckEmailIsExist(false)
            }, 1500)
            return () => clearTimeout(checkWait);
        } else {
            setCheckEmailIsExist(false)
            setCheckedEmailDone(false)
        }
    }

    return (
        <div className="min-h-screen flex relative justify-center items-center">
            <div style={{ backgroundImage: `url(https://source.unsplash.com/random)` }} className="bg-page w-full h-full absolute top-0 left-0 z-0 bg-cover bg-center bg-indigo-600">

            </div>
            <div className="authen-form register-form h-fit lg:w-96 max-w-lg bg-white flex items-center justify-center absolute rounded-lg">
                
                <div className="p-6">
                <div className={`${isLoading ? "flex" : "hidden"} transition-all absolute top-0 left-0 z-40 items-center justify-center  w-full h-full bg-white bg-opacity-70`}>
                    <LoadingComponent />
                </div>
                    <AuthenLogo />
                    <div className=" mx-2">
                        <h2 className="text-2xl font-semibold mb-4">Đăng ký</h2>
                        <div className='flex gap-3'>
                            <input
                                type="text"
                                placeholder="Họ"
                                value={firstName}
                                name='register_f_name'
                                id='register_f_name'
                                onChange={(e) => setFirstName(e.target.value)}
                                className="mb-2 p-2 border rounded-lg w-full bg-white bg-opacity-60"
                            />
                            <input
                                type="text"
                                placeholder="Tên"
                                name='register_l_name'
                                id='register_l_name'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="mb-2 p-2 border rounded-lg w-full bg-white bg-opacity-60"
                            />
                        </div>
                        <div className={`gap-1 items-center flex`}>

                            <svg className={`${checkUsernameIsExist ? "flex" : "hidden"} w-5 h-5 animate-spin`} version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ><g id="grid_system" /><g id="_icons"><g><path d="M12,2c-0.6,0-1,0.4-1,1v3c0,0.6,0.4,1,1,1s1-0.4,1-1V3C13,2.4,12.6,2,12,2z" /><path d="M14.5,7.7c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5l1.5-2.6c0.3-0.5,0.1-1.1-0.4-1.4c-0.5-0.3-1.1-0.1-1.4,0.4    l-1.5,2.6C13.9,6.8,14,7.4,14.5,7.7z" /><path d="M16.3,9.5c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1l2.6-1.5c0.5-0.3,0.6-0.9,0.4-1.4c-0.3-0.5-0.9-0.6-1.4-0.4    l-2.6,1.5C16.2,8.4,16.1,9,16.3,9.5z" /><path d="M21,11l-3,0c0,0,0,0,0,0c-0.6,0-1,0.4-1,1c0,0.6,0.4,1,1,1l3,0c0,0,0,0,0,0c0.6,0,1-0.4,1-1C22,11.5,21.6,11,21,11z" /><path d="M20.3,15.7l-2.6-1.5c-0.5-0.3-1.1-0.1-1.4,0.4c-0.3,0.5-0.1,1.1,0.4,1.4l2.6,1.5c0.2,0.1,0.3,0.1,0.5,0.1    c0.3,0,0.7-0.2,0.9-0.5C20.9,16.5,20.8,15.9,20.3,15.7z" /><path d="M15.8,16.7c-0.3-0.5-0.9-0.6-1.4-0.4c-0.5,0.3-0.6,0.9-0.4,1.4l1.5,2.6c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1    c0.5-0.3,0.6-0.9,0.4-1.4L15.8,16.7z" /><path d="M12,17c-0.5,0-1,0.4-1,1l0,3c0,0.6,0.4,1,1,1c0,0,0,0,0,0c0.5,0,1-0.4,1-1l0-3C13,17.5,12.5,17,12,17z" /><path d="M9.5,16.3C9,16,8.4,16.2,8.1,16.7l-1.5,2.6c-0.3,0.5-0.1,1.1,0.4,1.4c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5    l1.5-2.6C10.1,17.2,10,16.6,9.5,16.3z" /><path d="M7.7,14.5c-0.3-0.5-0.9-0.6-1.4-0.4l-2.6,1.5c-0.5,0.3-0.6,0.9-0.4,1.4c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1    l2.6-1.5C7.8,15.6,7.9,15,7.7,14.5z" /><path d="M6,13c0.5,0,1-0.4,1-1c0-0.6-0.4-1-1-1l-3,0c0,0,0,0,0,0c-0.5,0-1,0.4-1,1c0,0.6,0.4,1,1,1L6,13C6,13,6,13,6,13z" /><path d="M3.7,8.3l2.6,1.5C6.5,9.9,6.7,10,6.8,10c0.3,0,0.7-0.2,0.9-0.5C8,9,7.8,8.4,7.3,8.1L4.7,6.6C4.3,6.3,3.7,6.5,3.4,6.9 C3.1,7.4,3.3,8,3.7,8.3z" /></g></g></svg>

                            <svg className={`${checkedDone ? "flex" : "hidden"} ${isUsernameExist && checkedDone ? "flex" : "hidden"} w-5 h-5`} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><polygon fillRule="evenodd" points="8 9.414 3.707 13.707 2.293 12.293 6.586 8 2.293 3.707 3.707 2.293 8 6.586 12.293 2.293 13.707 3.707 9.414 8 13.707 12.293 12.293 13.707 8 9.414" /></svg>
                            <svg className={`${checkedDone ? "flex" : "hidden"} ${isUsernameExist ? "hidden" : "flex"} w-5 h-5 fill-green-500`} version="1.1" viewBox="0 0 18 15" xmlns="http://www.w3.org/2000/svg"><title /><desc /><defs /><g fill="none" fillRule="evenodd" id="Page-1" stroke="none" strokeWidth="1"><g className='fill-green-600' id="Core" transform="translate(-423.000000, -47.000000)"><g id="check" transform="translate(423.000000, 47.500000)"><path d="M6,10.2 L1.8,6 L0.4,7.4 L6,13 L18,1 L16.6,-0.4 L6,10.2 Z" id="Shape" /></g></g></g></svg>

                            <span className={`${checkedDone ? "flex" : "hidden"} ${isUsernameExist ? "text-red-500" : "text-green-500"} `}>
                                {isUsernameExist ? "This username already taken" : "You can get this username"}
                            </span>
                        </div>
                        <input
                            type="text"
                            placeholder="Tên người dùng"
                            value={username}
                            name='username'
                            id='username'
                            onBlur={checkUsernameAvailable}
                            onChange={(e) => setUsername(e.target.value.toLowerCase())}
                            className="mb-2 p-2 border rounded-lg w-full bg-white bg-opacity-60"
                        />
                        <div className={`gap-1 items-center flex`}>

                            <svg className={`${checkEmailIsExist ? "flex" : "hidden"} w-5 h-5 animate-spin`} version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ><g id="grid_system" /><g id="_icons"><g><path d="M12,2c-0.6,0-1,0.4-1,1v3c0,0.6,0.4,1,1,1s1-0.4,1-1V3C13,2.4,12.6,2,12,2z" /><path d="M14.5,7.7c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5l1.5-2.6c0.3-0.5,0.1-1.1-0.4-1.4c-0.5-0.3-1.1-0.1-1.4,0.4    l-1.5,2.6C13.9,6.8,14,7.4,14.5,7.7z" /><path d="M16.3,9.5c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1l2.6-1.5c0.5-0.3,0.6-0.9,0.4-1.4c-0.3-0.5-0.9-0.6-1.4-0.4    l-2.6,1.5C16.2,8.4,16.1,9,16.3,9.5z" /><path d="M21,11l-3,0c0,0,0,0,0,0c-0.6,0-1,0.4-1,1c0,0.6,0.4,1,1,1l3,0c0,0,0,0,0,0c0.6,0,1-0.4,1-1C22,11.5,21.6,11,21,11z" /><path d="M20.3,15.7l-2.6-1.5c-0.5-0.3-1.1-0.1-1.4,0.4c-0.3,0.5-0.1,1.1,0.4,1.4l2.6,1.5c0.2,0.1,0.3,0.1,0.5,0.1    c0.3,0,0.7-0.2,0.9-0.5C20.9,16.5,20.8,15.9,20.3,15.7z" /><path d="M15.8,16.7c-0.3-0.5-0.9-0.6-1.4-0.4c-0.5,0.3-0.6,0.9-0.4,1.4l1.5,2.6c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1    c0.5-0.3,0.6-0.9,0.4-1.4L15.8,16.7z" /><path d="M12,17c-0.5,0-1,0.4-1,1l0,3c0,0.6,0.4,1,1,1c0,0,0,0,0,0c0.5,0,1-0.4,1-1l0-3C13,17.5,12.5,17,12,17z" /><path d="M9.5,16.3C9,16,8.4,16.2,8.1,16.7l-1.5,2.6c-0.3,0.5-0.1,1.1,0.4,1.4c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5    l1.5-2.6C10.1,17.2,10,16.6,9.5,16.3z" /><path d="M7.7,14.5c-0.3-0.5-0.9-0.6-1.4-0.4l-2.6,1.5c-0.5,0.3-0.6,0.9-0.4,1.4c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1    l2.6-1.5C7.8,15.6,7.9,15,7.7,14.5z" /><path d="M6,13c0.5,0,1-0.4,1-1c0-0.6-0.4-1-1-1l-3,0c0,0,0,0,0,0c-0.5,0-1,0.4-1,1c0,0.6,0.4,1,1,1L6,13C6,13,6,13,6,13z" /><path d="M3.7,8.3l2.6,1.5C6.5,9.9,6.7,10,6.8,10c0.3,0,0.7-0.2,0.9-0.5C8,9,7.8,8.4,7.3,8.1L4.7,6.6C4.3,6.3,3.7,6.5,3.4,6.9 C3.1,7.4,3.3,8,3.7,8.3z" /></g></g></svg>

                            <svg className={`${checkedEmailDone ? "flex" : "hidden"} ${isEmailExist ? "flex" : "hidden"} w-5 h-5`} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><polygon fillRule="evenodd" points="8 9.414 3.707 13.707 2.293 12.293 6.586 8 2.293 3.707 3.707 2.293 8 6.586 12.293 2.293 13.707 3.707 9.414 8 13.707 12.293 12.293 13.707 8 9.414" /></svg>
                            <svg className={`${checkedEmailDone ? "flex" : "hidden"} ${isEmailExist ? "hidden" : "flex"} w-5 h-5 fill-green-500`} version="1.1" viewBox="0 0 18 15" xmlns="http://www.w3.org/2000/svg"><title /><desc /><defs /><g fill="none" fillRule="evenodd" id="Page-1" stroke="none" strokeWidth="1"><g className='fill-green-600' id="Core" transform="translate(-423.000000, -47.000000)"><g id="check" transform="translate(423.000000, 47.500000)"><path d="M6,10.2 L1.8,6 L0.4,7.4 L6,13 L18,1 L16.6,-0.4 L6,10.2 Z" id="Shape" /></g></g></g></svg>

                            <span className={`${checkedEmailDone ? "flex" : "hidden"} ${isEmailExist ? "text-red-500" : "text-green-500"} `}>
                                {isEmailExist ? "This email already taken" : "You can get this email"}
                            </span>
                        </div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            name='email'
                            id='email'
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={checkEmailAvailable}
                            className="mb-2 p-2 border rounded-lg w-full bg-white bg-opacity-60"
                        />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            name='password'
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mb-2 p-2 border rounded-lg w-full bg-white bg-opacity-60"
                        />
                        <input
                            type="password"
                            id='confirm_password'
                            name='confirm_password'
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mb-2 p-2 border rounded-lg w-full bg-white bg-opacity-60"
                        />
                        <div className="mb-2 w-full flex items-center">
                            <label className='w-full'>Giới tính:</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="p-2 border rounded-lg bg-white bg-opacity-60"
                            >
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                                <option value="UNKNOWN">Không xác định</option>
                            </select>
                        </div>
                        <div className="mt-4 flex flex-col w-full">
                            <button onClick={handleRegister} className="bg-white border w-full text-slate-600 px-4 hover:shadow-md transition-shadow py-2 rounded-lg mr-2">
                                Đăng ký
                            </button>
                            <Link to="/login" className="text-gray-500 mt-5 mb-3 text-sm hover:text-slate-800 font-bold">Quay lại trang đăng nhập</Link>
                        </div>
                      
                        {err && <p className='text-red-600 text-center w-full my-5'>Something went wrong !</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage