import React, { useRef, useState } from 'react'
import { ACTIVATE_EMAIL, AUTO_SEND, URL_PREFIX } from '../utils/constants';
import { fetchApiData, validateEmail } from '../utils/functions';
import { Link, useNavigate } from 'react-router-dom';
import AuthenLogo from '../components/AuthenLogo';
import LoadingComponent from '../components/LoadingComponent';
import { useTranslation } from 'react-i18next';

const RegisterPage = () => {

    const { t, i18n } = useTranslation()
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('MALE'); // Mặc định là UNKNOWN
    const [isLoading, setLoading] = useState(false)

    const [checkUsernameIsExist, setCheckUsernameIsExist] = useState(false)
    const [isUsernameExist, setUsernameExist] = useState(false)
    const [checkedDone, setCheckedDone] = useState(false)

    const [checkEmailIsExist, setCheckEmailIsExist] = useState(false)
    const [isEmailExist, setEmailExist] = useState(false)
    const [checkedEmailDone, setCheckedEmailDone] = useState(false)

    const [errNameMsg, setErrNameMsg] = useState("")
    const [errUnameMsg, setErrUnameMsg] = useState("")
    const [errEmailMsg, setErrEmailMsg] = useState("")
    const [errPasswordMsg, setErrPasswordMsg] = useState("")
    const [errCommonMsg, setErrCommonMsg] = useState("")

    const lastNameRef = useRef(null)
    const usernameRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)


    const navigate = useNavigate()

    const checkInputRegister = async () => {
        setErrEmailMsg("")
        setErrNameMsg("")
        setErrUnameMsg("")
        setErrPasswordMsg("")
        setErrCommonMsg("")

        let err = false
        if (firstName.length < 3 || lastName.length < 3) {
            setErrNameMsg(t('authen.name_3_character_error_title'))
            err = true
        }
        if (username.length < 5) {
            setErrUnameMsg(t('authen.username_5_character_error_title'))
            err = true
        }
        if (!validateEmail(email)) {
            setErrEmailMsg(t('authen.format_email_wrong_error_title'))
            err = true
        }
        if (password.length < 5) {
            setErrPasswordMsg(t('authen.password_5_character_error_title'))
            err = true
        }
        if (err) {
            setErrCommonMsg(t('authen.common_error_title'))
        } else {
            await handleRegister()
        }
    }

    const handleRegister = async () => {

        setLoading(true)
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
            localStorage.setItem(AUTO_SEND, false)
            result.status === "SUCCESS" ? navigate("/activate-account") : setErrCommonMsg(result.content.msg)
        } catch (error) {
            setErrCommonMsg(error.content.msg)
        }
        finally {
            setLoading(false)
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

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
            await checkInputRegister();
        }
    };


    return (
        <div className="authen-box authen-form h-fit register-form lg:w-96 max-w-sm flex items-center justify-center absolute">

            <div className="p-6">
                <div className={`${isLoading ? "flex" : "hidden"} transition-all absolute top-0 left-0 z-40 items-center justify-center  w-full h-full bg-white bg-opacity-70`}>
                    <LoadingComponent />
                </div>
                <AuthenLogo />
                <div className=" mx-2">
                    <h2 className="text-2xl font-semibold mb-4">{t('authen.register_title')}</h2>
                    <div className='flex gap-3'>
                        <input
                            type="text"
                            placeholder={t('authen.first_name_title')}
                            value={firstName}
                            onKeyDown={(e) => e.key === 'Enter' ? lastNameRef.current.focus() : null}
                            name='register_f_name'
                            id='register_f_name'
                            onChange={(e) => setFirstName(e.target.value)}
                            className={`p-2 border rounded-lg w-full bg-white bg-opacity-60 outline-none ${errNameMsg ? "border-red-600" : ""}`}
                        />
                        <input
                            type="text"
                            placeholder={t('authen.last_name_title')}
                            ref={lastNameRef}
                            name='register_l_name'
                            onKeyDown={(e) => e.key === 'Enter' ? usernameRef.current.focus() : null}
                            id='register_l_name'
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className={`p-2 border rounded-lg w-full bg-white bg-opacity-60 ${errNameMsg ? "border-red-600" : ""}`}
                        />
                    </div>
                    <p className={`text-red-600 whitespace-nowrap text-sm text-start w-full mb-5 h-3`}>{errNameMsg}</p>
                    <div className={`gap-1 items-center flex`}>

                        <svg className={`${checkUsernameIsExist ? "flex" : "hidden"} w-5 h-5 animate-spin`} version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ><g id="grid_system" /><g id="_icons"><g><path d="M12,2c-0.6,0-1,0.4-1,1v3c0,0.6,0.4,1,1,1s1-0.4,1-1V3C13,2.4,12.6,2,12,2z" /><path d="M14.5,7.7c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5l1.5-2.6c0.3-0.5,0.1-1.1-0.4-1.4c-0.5-0.3-1.1-0.1-1.4,0.4    l-1.5,2.6C13.9,6.8,14,7.4,14.5,7.7z" /><path d="M16.3,9.5c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1l2.6-1.5c0.5-0.3,0.6-0.9,0.4-1.4c-0.3-0.5-0.9-0.6-1.4-0.4    l-2.6,1.5C16.2,8.4,16.1,9,16.3,9.5z" /><path d="M21,11l-3,0c0,0,0,0,0,0c-0.6,0-1,0.4-1,1c0,0.6,0.4,1,1,1l3,0c0,0,0,0,0,0c0.6,0,1-0.4,1-1C22,11.5,21.6,11,21,11z" /><path d="M20.3,15.7l-2.6-1.5c-0.5-0.3-1.1-0.1-1.4,0.4c-0.3,0.5-0.1,1.1,0.4,1.4l2.6,1.5c0.2,0.1,0.3,0.1,0.5,0.1    c0.3,0,0.7-0.2,0.9-0.5C20.9,16.5,20.8,15.9,20.3,15.7z" /><path d="M15.8,16.7c-0.3-0.5-0.9-0.6-1.4-0.4c-0.5,0.3-0.6,0.9-0.4,1.4l1.5,2.6c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1    c0.5-0.3,0.6-0.9,0.4-1.4L15.8,16.7z" /><path d="M12,17c-0.5,0-1,0.4-1,1l0,3c0,0.6,0.4,1,1,1c0,0,0,0,0,0c0.5,0,1-0.4,1-1l0-3C13,17.5,12.5,17,12,17z" /><path d="M9.5,16.3C9,16,8.4,16.2,8.1,16.7l-1.5,2.6c-0.3,0.5-0.1,1.1,0.4,1.4c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5    l1.5-2.6C10.1,17.2,10,16.6,9.5,16.3z" /><path d="M7.7,14.5c-0.3-0.5-0.9-0.6-1.4-0.4l-2.6,1.5c-0.5,0.3-0.6,0.9-0.4,1.4c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1    l2.6-1.5C7.8,15.6,7.9,15,7.7,14.5z" /><path d="M6,13c0.5,0,1-0.4,1-1c0-0.6-0.4-1-1-1l-3,0c0,0,0,0,0,0c-0.5,0-1,0.4-1,1c0,0.6,0.4,1,1,1L6,13C6,13,6,13,6,13z" /><path d="M3.7,8.3l2.6,1.5C6.5,9.9,6.7,10,6.8,10c0.3,0,0.7-0.2,0.9-0.5C8,9,7.8,8.4,7.3,8.1L4.7,6.6C4.3,6.3,3.7,6.5,3.4,6.9 C3.1,7.4,3.3,8,3.7,8.3z" /></g></g></svg>

                        <svg className={`${checkedDone ? "flex" : "hidden"} ${isUsernameExist && checkedDone ? "flex" : "hidden"} w-5 h-5`} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><polygon fillRule="evenodd" points="8 9.414 3.707 13.707 2.293 12.293 6.586 8 2.293 3.707 3.707 2.293 8 6.586 12.293 2.293 13.707 3.707 9.414 8 13.707 12.293 12.293 13.707 8 9.414" /></svg>
                        <svg className={`${checkedDone ? "flex" : "hidden"} ${isUsernameExist ? "hidden" : "flex"} w-5 h-5 fill-green-500`} version="1.1" viewBox="0 0 18 15" xmlns="http://www.w3.org/2000/svg"><title /><desc /><defs /><g fill="none" fillRule="evenodd" id="Page-1" stroke="none" strokeWidth="1"><g className='fill-green-600' id="Core" transform="translate(-423.000000, -47.000000)"><g id="check" transform="translate(423.000000, 47.500000)"><path d="M6,10.2 L1.8,6 L0.4,7.4 L6,13 L18,1 L16.6,-0.4 L6,10.2 Z" id="Shape" /></g></g></g></svg>

                        <span className={`text-sm ${checkedDone ? "flex" : "hidden"} ${isUsernameExist ? "text-red-500" : "text-green-500"} `}>
                            {isUsernameExist ? t('authen.valid_username_error') : t('authen.valid_username_ok')}
                        </span>
                    </div>
                    <input
                        type="text"
                        placeholder={t('authen.username_title')}
                        value={username}
                        name='username'
                        ref={usernameRef}
                        onKeyDown={(e) => e.key === 'Enter' ? emailRef.current.focus() : null}
                        id='username'
                        onBlur={checkUsernameAvailable}
                        onChange={(e) => setUsername(e.target.value.toLowerCase())}
                        className={`p-2 border rounded-lg w-full bg-white bg-opacity-60 outline-none ${errUnameMsg ? "border-red-600" : ""}`}
                    />
                    <p className={`text-red-600 whitespace-nowrap text-sm text-start w-full mb-5 h-3`}>{errUnameMsg}</p>
                    <div className={`gap-1 items-center flex`}>

                        <svg className={`${checkEmailIsExist ? "flex" : "hidden"} w-5 h-5 animate-spin`} version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ><g id="grid_system" /><g id="_icons"><g><path d="M12,2c-0.6,0-1,0.4-1,1v3c0,0.6,0.4,1,1,1s1-0.4,1-1V3C13,2.4,12.6,2,12,2z" /><path d="M14.5,7.7c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5l1.5-2.6c0.3-0.5,0.1-1.1-0.4-1.4c-0.5-0.3-1.1-0.1-1.4,0.4    l-1.5,2.6C13.9,6.8,14,7.4,14.5,7.7z" /><path d="M16.3,9.5c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1l2.6-1.5c0.5-0.3,0.6-0.9,0.4-1.4c-0.3-0.5-0.9-0.6-1.4-0.4    l-2.6,1.5C16.2,8.4,16.1,9,16.3,9.5z" /><path d="M21,11l-3,0c0,0,0,0,0,0c-0.6,0-1,0.4-1,1c0,0.6,0.4,1,1,1l3,0c0,0,0,0,0,0c0.6,0,1-0.4,1-1C22,11.5,21.6,11,21,11z" /><path d="M20.3,15.7l-2.6-1.5c-0.5-0.3-1.1-0.1-1.4,0.4c-0.3,0.5-0.1,1.1,0.4,1.4l2.6,1.5c0.2,0.1,0.3,0.1,0.5,0.1    c0.3,0,0.7-0.2,0.9-0.5C20.9,16.5,20.8,15.9,20.3,15.7z" /><path d="M15.8,16.7c-0.3-0.5-0.9-0.6-1.4-0.4c-0.5,0.3-0.6,0.9-0.4,1.4l1.5,2.6c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1    c0.5-0.3,0.6-0.9,0.4-1.4L15.8,16.7z" /><path d="M12,17c-0.5,0-1,0.4-1,1l0,3c0,0.6,0.4,1,1,1c0,0,0,0,0,0c0.5,0,1-0.4,1-1l0-3C13,17.5,12.5,17,12,17z" /><path d="M9.5,16.3C9,16,8.4,16.2,8.1,16.7l-1.5,2.6c-0.3,0.5-0.1,1.1,0.4,1.4c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5    l1.5-2.6C10.1,17.2,10,16.6,9.5,16.3z" /><path d="M7.7,14.5c-0.3-0.5-0.9-0.6-1.4-0.4l-2.6,1.5c-0.5,0.3-0.6,0.9-0.4,1.4c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1    l2.6-1.5C7.8,15.6,7.9,15,7.7,14.5z" /><path d="M6,13c0.5,0,1-0.4,1-1c0-0.6-0.4-1-1-1l-3,0c0,0,0,0,0,0c-0.5,0-1,0.4-1,1c0,0.6,0.4,1,1,1L6,13C6,13,6,13,6,13z" /><path d="M3.7,8.3l2.6,1.5C6.5,9.9,6.7,10,6.8,10c0.3,0,0.7-0.2,0.9-0.5C8,9,7.8,8.4,7.3,8.1L4.7,6.6C4.3,6.3,3.7,6.5,3.4,6.9 C3.1,7.4,3.3,8,3.7,8.3z" /></g></g></svg>

                        <svg className={`${checkedEmailDone ? "flex" : "hidden"} ${isEmailExist ? "flex" : "hidden"} w-5 h-5`} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><polygon fillRule="evenodd" points="8 9.414 3.707 13.707 2.293 12.293 6.586 8 2.293 3.707 3.707 2.293 8 6.586 12.293 2.293 13.707 3.707 9.414 8 13.707 12.293 12.293 13.707 8 9.414" /></svg>
                        <svg className={`${checkedEmailDone ? "flex" : "hidden"} ${isEmailExist ? "hidden" : "flex"} w-5 h-5 fill-green-500`} version="1.1" viewBox="0 0 18 15" xmlns="http://www.w3.org/2000/svg"><title /><desc /><defs /><g fill="none" fillRule="evenodd" id="Page-1" stroke="none" strokeWidth="1"><g className='fill-green-600' id="Core" transform="translate(-423.000000, -47.000000)"><g id="check" transform="translate(423.000000, 47.500000)"><path d="M6,10.2 L1.8,6 L0.4,7.4 L6,13 L18,1 L16.6,-0.4 L6,10.2 Z" id="Shape" /></g></g></g></svg>

                        <span className={`text-sm ${checkedEmailDone ? "flex" : "hidden"} ${isEmailExist ? "text-red-500" : "text-green-500"} `}>
                            {isEmailExist ?  t('authen.valid_email_error') : t('authen.valid_email_ok')}
                        </span>
                    </div>
                    <input
                        type="email"
                        placeholder={t('authen.email_title')}
                        value={email}
                        name='email'
                        ref={emailRef}
                        onKeyDown={(e) => e.key === 'Enter' ? passwordRef.current.focus() : null}
                        id='email'
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={checkEmailAvailable}
                        className={`${errEmailMsg ? "border-red-600" : ""} p-2 border rounded-lg w-full bg-white bg-opacity-60 outline-none`}
                    />
                    <p className={`text-red-600  whitespace-nowrap text-sm text-start w-full mb-5 h-3`}>{errEmailMsg}</p>
                    <input
                        type="password"
                        placeholder={t('authen.password_title')}
                        name='password'
                        id='password'
                        onKeyDown={handleKeyPress}
                        ref={passwordRef}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${errPasswordMsg ? "border-red-600" : ""} p-2 border rounded-lg w-full bg-white bg-opacity-60 outline-none`}
                    />
                    <p className={`text-red-600 whitespace-nowrap text-sm text-start w-full mb-5 h-3`}>{errPasswordMsg}</p>

                    <div className="mb-2 w-full flex items-center">
                        <label className='w-full'>{t('authen.gender_title')}</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="p-2 border rounded-lg bg-white bg-opacity-60"
                        >
                            <option value="MALE">{t('authen.male_title')}</option>
                            <option value="FEMALE">{t('authen.female_title')}</option>
                            <option value="UNKNOWN">{t('authen.unknown_gender_title')}</option>
                        </select>
                    </div>
                    <div className="mt-4 flex flex-col w-full">
                        <button onClick={() => checkInputRegister()} className="bg-white font-bold border-2 w-full text-slate-600 px-4 hover:shadow-md transition-shadow py-2 rounded-lg mr-2">
                            {t('authen.register_title')}
                        </button>
                        <Link to="/login" className="text-gray-500 mt-5 mb-3 text-sm hover:text-slate-800 font-bold">{t('authen.back_to_login')}</Link>
                    </div>

                    <p className='text-red-600 text-center w-full my-5 h-3'>{errCommonMsg}</p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage