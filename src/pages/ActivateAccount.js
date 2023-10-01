import React, { useEffect, useState } from 'react'
import LoadingComponent from '../components/LoadingComponent'
import { ACTIVATE_EMAIL, AUTO_SEND, SUCCESS_RESULT } from '../utils/constants'
import { Link, useNavigate } from 'react-router-dom'
import { fetchApiData, logoutAccount } from '../utils/functions'
import { useTranslation } from 'react-i18next'

const ActivateAccount = () => {
  const {t, i18n} = useTranslation()
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false)
  const [activateEmail, setActivateEmail] = useState("")
  const [activateCode, setActivateCode] = useState("")
  const [errorMsg, setErrMsg] = useState("")
  const [isSuccess, setSuccess] = useState(false)
  const [isResend, setResend] = useState(false)
  useEffect(() => {
    const checkEmail = async () => {
      const email = localStorage.getItem(ACTIVATE_EMAIL)
      if (email) {
        setActivateEmail(email)
        let isSend = JSON.parse(localStorage.getItem(AUTO_SEND))
        if (!isSend) {
          await sendActivateMail(email)
        }
      }
      else {
        navigate("/login")
      }
    }

    checkEmail()
  }, [])

  const sendActivateMail = async (email) => {
    setLoading(true)
    const result_check = await fetchApiData(`public/check-email/${email}`)
    if (result_check) {
      const result = await fetchApiData(`public/send-activate-mail?email=${email}`)
      if (result.status === SUCCESS_RESULT) {

        localStorage.setItem(AUTO_SEND, true)
        setResend(false)
        setSuccess(false)
        setErrMsg("")
        setLoading(false)
      } else {
        setErrMsg(result.msg)
        setLoading(false)
        setSuccess(false)
      }
    } else {
      setErrMsg(t('authen.activate.email_donot_exist_error'))
      setLoading(false)
    }
  }

  const checkKeyPress = async (e) => {
    if (e.key === "Enter") {
      await submitCode()
    }
  }

  const submitCode = async () => {
    setLoading(true)
    if (activateCode.length === 10) {
      let data = JSON.stringify({
        email: activateEmail,
        code: activateCode
      })
      const result = await fetchApiData("public/activate-account", null, "POST", data)

      if (result.status === SUCCESS_RESULT) {
        setSuccess(true)
        localStorage.removeItem(AUTO_SEND)
        localStorage.removeItem(ACTIVATE_EMAIL)
        setLoading(false)
      } else {
        setErrMsg(result.data.msg)
        setSuccess(false)
        setResend(true)
        setLoading(false)
      }
    } else {
      setErrMsg(t('authen.activate.code_format_wrong_error'))
      setLoading(false)
    }
  }

  const backToLogin = () => {
    logoutAccount()
    navigate("/login")
  }

  return (
    <div className="register-form authen-box h-fit register-form lg:w-96 max-w-sm flex items-center justify-center absolute">
      <div className="p-6">
        <div className=" mx-2">
          <p className={`${isSuccess ? "block" : "hidden"} text-md font-bold text-green-600 text-center`}>{t('authen.activate.account_activated_title')}</p>
          <div className={`${isSuccess || isResend ? "hidden" : "block"}`}>
            <h1 className='font-bold text-center block text-xl'>{t('authen.activate.activate_account_title')}</h1>
            <p className='text-md'>{t('authen.activate.check_email_title')}</p>

            <input
              type='text'
              maxLength={10}
              onChange={e => setActivateCode(e.target.value)}
              onKeyDown={checkKeyPress}
              className='text-2xl outline-none p-2 w-full rounded-md border bg-white mt-2 text-center block'
              placeholder='X XXX XXX XXX'
            />
            <button
              disabled={isLoading}
              onClick={() => submitCode()}
              className='bg-white border w-full text-slate-600 px-4 hover:shadow-md transition-shadow py-2 font-bold rounded-lg mr-2 mt-2'>
              {
                isLoading ?
                  <LoadingComponent className={`flex mx-auto justify-center`} size='p-2 h-5 w-5' />
                  :
                  <span>
                    {t('authen.activate.submit_title')}
                  </span>
              }
            </button>
          </div>
          <button
            disabled={isLoading}
            onClick={() => sendActivateMail(activateEmail)}
            className={`${isResend ? "block" : "hidden"} bg-white border font-bold w-full text-slate-600 px-4 hover:shadow-md transition-shadow py-2 rounded-lg mr-2`}>
            {
              isLoading ?
                <LoadingComponent className={`flex mx-auto justify-center`} size='p-2 h-5 w-5' />
                :
                <span>
                  {t('authen.activate.resend_email_title')}
                </span>
            }
          </button>
          <p className='h-5 block text-center text-red-500 font-bold text-md my-2'>{errorMsg}</p>
          <button onClick={() => backToLogin()} className='w-full text-center block mx-auto mt-7 p-2 rounded-md border lg:hover:shadow-lg transition-all'>{t('authen.back_to_login')}</button>
        </div>
      </div>
    </div>
  )
}

export default ActivateAccount