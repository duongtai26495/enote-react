import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { fetchApiData } from '../utils/functions';
import LoadingComponent from '../components/LoadingComponent';
import { AUTO_SEND_RECOVERY, SUCCESS_RESULT } from '../utils/constants';
import LoadingAnimation from '../components/LoadingAnimation';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
  const {t, i18n} = useTranslation()
  const [isLoading, setLoading] = useState(false)
  const [isSending, setSending] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const [email, setEmail] = useState("");
  const emailRef = useRef(null)

  const navigate = useNavigate()

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleConfirmClick = async () => {
    setSending(true)
    if (email.length > 5) {
      const result = await fetchApiData(`public/check-email/${email}`, "")
      if (result) {
        localStorage.removeItem(AUTO_SEND_RECOVERY)
        localStorage.setItem(AUTO_SEND_RECOVERY, false)
        setSending(false)
        navigate("/confirm-recovery?email=" + email)
      }
      else {
        setErrMsg(t('authen.email_donot_exist_error'))
        setSending(false)
      }
    } else {
      setErrMsg(t('authen.format_email_wrong_error_title'))
      emailRef.current.focus()
      setSending(false)
    }
  };

  useEffect(() => {
    document.title = "Recovery email"
  }, [])

  return (
    <div className="authen-box authen-form h-fit login-form lg:w-96 max-w-sm flex items-center justify-center absolute">
      <div className={`${isLoading ? "flex" : "hidden"} transition-all absolute top-0 left-0 z-40 items-center justify-center  w-full h-full bg-white bg-opacity-70`}>
        <LoadingComponent />
      </div>
      <div className="p-6 w-full">
        <p className='text-base my-5'>{t('authen.recovery.forgot_password')}</p>
        <div className="mb-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t('authen.email_title')}
          </label>
          <input
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errMsg ? "border-red-500" : ""}`}
            id="email"
            type="text"
            ref={emailRef}
            placeholder="johnsmith_2023@gmail.com"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <p className='h-3 block text-center text-red-500 font-bold text-md mb-5'>{errMsg}</p>

        <div className="flex items-center gap-3 justify-between">
          <button
            disabled={isLoading}
            className="w-full bg-slate-50 hover:shadow-lg text-black border font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleConfirmClick}
          >
            {
              isSending ?
                <LoadingComponent className={`flex mx-auto justify-center`} size='p-2 h-5 w-5' />
                :
                <span>{t('common.confirm_title')}</span>
            }
          </button>
          <button
            className="w-full bg-slate-50 hover:shadow-lg text-black border font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => navigate(-1)}
          >
            {t('common.back_title')}
          </button>

        </div>
      </div>
    </div>
  )
}

export default ForgotPassword