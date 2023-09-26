import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchApiData } from '../utils/functions';
import { AUTO_SEND_RECOVERY, SUCCESS_RESULT } from '../utils/constants';

const ConfirmRecovery = () => {
    useEffect(() => {
        document.title = "Confirm recovery"
    }, [])
    const navigate = useNavigate()
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const email = params.get("email");
    const [code, setCode] = useState("")
    const [errorMsg, setErrMsg] = useState("")
    const [isSuccess, setSuccess] = useState(false)
    const [isResend, setResend] = useState(false)
    const [newPassword, setNewPassword] = useState("")


    useEffect(() => {
        sendRecoveryMail(email)
    }, [])

    const setPassword = (e) => {
        setNewPassword(e.target.value)
    }

    const sendRecoveryMail = async (email) => {
        let autoSend = JSON.parse(localStorage.getItem(AUTO_SEND_RECOVERY))
        if (!autoSend) {
            const result = await fetchApiData(`public/recovery/${email}`)
            if (result.status === SUCCESS_RESULT) {
                localStorage.setItem(AUTO_SEND_RECOVERY, true)
                setResend(false)
                setSuccess(false)
            }
        }
    }

    const submitCode = async () => {
        if (code.length === 10) {
            let data = JSON.stringify({
                email,
                password:newPassword
            })
            const result = await fetchApiData(`public/recovery-password/${code}`, null, "POST", data)
            if (result.status === SUCCESS_RESULT) {
                setSuccess(true)
            } else {
                setErrMsg(result.data.msg)
                setResend(true)
                setSuccess(false)
            }
        } else {
            setErrMsg("Format of code is incorrect")
        }
    }
  
    return (
        <div className="authen-box authen-form h-fit pb-2 login-form lg:w-96 max-w-sm flex flex-col items-center justify-center absolute border rounded ">
            <div className={`${isSuccess ? "hidden" : "block"}`}>
                <div className={`${isResend ? "hidden" : "block"} px-8 pt-6 text-center`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto h-12 w-12 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                    <p className="text-gray-700 text-lg font-semibold mb-4">
                        Email sent to {email}
                    </p>
                    <p className='text-md'>Check your email to get the code</p>

                    <input
                        type='text'
                        maxLength={10}
                        onChange={e => setCode(e.target.value)}
                        className='text-2xl outline-none p-2 w-full rounded-md border bg-white mt-2 text-center block'
                        placeholder='X XXX XXX XXX'
                    />
                    <input
                        type='password'
                        onChange={e => setPassword(e)}
                        className='text-xl outline-none p-2 w-full rounded-md border bg-white mt-2 text-center block'
                        placeholder='New password'
                    />
                    <button
                        onClick={() => submitCode()}
                        className='bg-white border w-full text-slate-600 px-4 hover:shadow-md transition-shadow py-2 rounded-lg mr-2 mt-2 font-bold'>Update</button>
                    <p className='h-5 block text-center text-red-500 font-bold text-md my-2'>{errorMsg}</p>
                </div>
                <div className={`${isResend ? "block" : "hidden"} my-2`}>

                    <p className='text-md'>Resend the recovery code</p>
                    <button
                        onClick={() => sendRecoveryMail(email)}
                        className='bg-white border w-full text-slate-600 px-4 hover:shadow-md transition-shadow py-2 rounded-lg mr-2 mt-2 font-bold'>Send</button>
                    <p className='h-5 block text-center text-red-500 font-bold text-md my-2'>{errorMsg}</p>
                </div>
            </div>
            <p className={`${isSuccess ? "block" : "hidden"} text-md text-emerald-500 mx-auto my-5`}>Your password is updated</p>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => {
                    navigate("/")
                }}
            >
                Back to login page
            </button>
        </div>
    )
}

export default ConfirmRecovery