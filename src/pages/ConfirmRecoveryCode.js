import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchApiData } from '../utils/functions';
import { AUTO_SEND_RECOVERY, SUCCESS_RESULT } from '../utils/constants';
import LoadingComponent from '../components/LoadingComponent';
import { useTranslation } from 'react-i18next';

const ConfirmRecovery = () => {
    useEffect(() => {
        document.title = "Confirm recovery"
    }, [])
    const {t} = useTranslation()
    const navigate = useNavigate()
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const email = params.get("email");
    const [code, setCode] = useState("")
    const [errorMsg, setErrMsg] = useState("")
    const [isSuccess, setSuccess] = useState(false)
    const [isResend, setResend] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [isLoading, setLoading] = useState(false)


    useEffect(() => {
        let autoSend = JSON.parse(localStorage.getItem(AUTO_SEND_RECOVERY))
        if (email) {

            if (!autoSend) {
                sendRecoveryMail(email)
            }
        } else {
            navigate("/login")
        }
    }, [])

    const setPassword = (e) => {
        setNewPassword(e.target.value)
    }

    const sendRecoveryMail = async (email) => {
        setLoading(true)
        const result_check = await fetchApiData(`public/check-email/${email}`)
        if (result_check) {
            const result = await fetchApiData(`public/recovery/${email}`)
            if (result.status === SUCCESS_RESULT) {
                localStorage.setItem(AUTO_SEND_RECOVERY, true)
                setResend(false)
                setSuccess(false)
                setLoading(false)
                setErrMsg("")
            }else{
                setErrMsg(result.msg)
                setLoading(false)
                setSuccess(false)
            }
        } else {
            navigate("/login")
        }
    }

    const submitCode = async () => {
        setLoading(true)
        if (code.length === 10) {
            let data = JSON.stringify({
                email,
                password: newPassword
            })
            const result = await fetchApiData(`public/recovery-password/${code}`, null, "POST", data)
            if (result.status === SUCCESS_RESULT) {
                setSuccess(true)
                setLoading(false)
            } else {
                setErrMsg(result.data.msg)
                setResend(true)
                setSuccess(false)
                setLoading(false)
            }
        } else {
            setErrMsg("Format of code is incorrect")
            setLoading(false)
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
                        {t('authen.recovery.email_sent_to',{email})}
                    </p>
                    <p className='text-md'>{t('authen.check_email_title')}</p>

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
                        placeholder={t('authen.recovery.new_password')}
                    />
                    <button
                        disabled={isLoading}
                        onClick={() => submitCode()}
                        className='bg-white border w-full text-slate-600 px-4 hover:shadow-md transition-shadow py-2 rounded-lg mr-2 mt-2 font-bold'>
                        {
                            isLoading ?
                                <LoadingComponent className={`flex mx-auto justify-center`} size='p-2 h-5 w-5' />
                                :
                                <span>
                                    {t('authen.recovery.update_title')}
                                </span>
                        }
                    </button>
                    <p className='h-5 block text-center text-red-500 font-bold text-md my-2'>{errorMsg}</p>
                </div>
                <div className={`${isResend ? "block" : "hidden"} my-2 px-2`}>
                    <p className='h-fit block text-center text-red-500 font-bold text-md my-2'>{errorMsg}</p>
                    <p className='text-md text-center'>{t('authen.recovery.resend_recovery_code')}</p>
                    <button
                        disabled={isLoading}
                        onClick={() => sendRecoveryMail(email)}
                        className='bg-white border w-full text-slate-600 px-4 hover:shadow-md transition-shadow py-2 rounded-lg mr-2 mt-2 font-bold'>
                        {
                            isLoading ?
                                <LoadingComponent className={`flex mx-auto justify-center`} size='p-2 h-5 w-5' />
                                :
                                <span>
                                    {t('authen.activate.resend_email_title')}
                                </span>
                        }
                    </button>
                </div>
            </div>
            <p className={`${isSuccess ? "block" : "hidden"} text-md text-emerald-500 mx-auto my-5`}>{t('authen.recovery.password_updated')}</p>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mb-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => {
                    navigate("/login")
                }}
            >
                {t('authen.back_to_login')}
            </button>
        </div>
    )
}

export default ConfirmRecovery