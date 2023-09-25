import React, { useEffect, useState } from 'react'
import LoadingComponent from '../components/LoadingComponent'
import { ACTIVATE_EMAIL, AUTO_SEND, SUCCESS_RESULT } from '../utils/constants'
import { Link, useNavigate } from 'react-router-dom'
import { fetchApiData } from '../utils/functions'

const ActivateAccount = () => {

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
      if(email)
      {
        setActivateEmail(email)
        let isSend = JSON.parse(localStorage.getItem(AUTO_SEND))
        if(!isSend){
          await sendActivateMail(email)
        }
      }
      else{
        navigate("/login")
      }
    }

    checkEmail()
  }, [])

  const sendActivateMail = async (email) => {
    await fetchApiData(`public/send-activate-mail?email=${email}`)
    localStorage.setItem(AUTO_SEND, true)
    setResend(false)
    setSuccess(false)
  }

  const checkKeyPress = async (e) => {
    if (e.key === "Enter") {
      await submitCode()
    }
  }

  const submitCode = async () => {
    if (activateCode.length === 10) {
      let data = JSON.stringify({
        email: activateEmail,
        code : activateCode
      })
      const result = await fetchApiData("public/activate-account", null, "POST", data)
      if (result.status === SUCCESS_RESULT) {
        setSuccess(true)
        localStorage.removeItem(AUTO_SEND)
        localStorage.removeItem(ACTIVATE_EMAIL)
      } else {
        setErrMsg(result.data.msg)
        setSuccess(false)
        setResend(true)
      }
    } else {
      setErrMsg("Format of code is incorrect")
    }
  }

  return (
      <div className="register-form authen-box h-fit register-form lg:w-96 max-w-sm flex items-center justify-center absolute">
        <div className="p-6">
          <div className={`${isLoading ? "flex" : "hidden"} transition-all absolute top-0 left-0 z-40 items-center justify-center  w-full h-full bg-white bg-opacity-70`}>
            <LoadingComponent />
          </div>

          <div className=" mx-2">
          <p className={`${isSuccess ? "block" : "hidden"} text-md font-bold text-green-600 text-center`}>Your account is activated</p>
          <div className={`${isSuccess || isResend ? "hidden" : "block" }`}>
            <h1 className='font-bold text-center block text-xl'>Activate your account</h1>
            <p className='text-md'>Check your email to get the code</p>

            <input
              type='text'
              maxLength={10}
              onChange={e => setActivateCode(e.target.value)}
              onKeyDown={checkKeyPress}
              className='text-2xl outline-none p-2 w-full rounded-md border bg-white mt-2 text-center block'
              placeholder='X XXX XXX XXX'
            />
            <button
              onClick={() => submitCode()}
              className='bg-white border w-full text-slate-600 px-4 hover:shadow-md transition-shadow py-2 rounded-lg mr-2 mt-2'>Send</button>
            <p className='h-5 block text-center text-red-500 font-bold text-md my-2'>{errorMsg}</p>
          </div>
          <button
              onClick={() => sendActivateMail(activateEmail)}
              className={`${isResend ? "block" : "hidden"} bg-white border w-full text-slate-600 px-4 hover:shadow-md transition-shadow py-2 rounded-lg mr-2`}>Re-Send email</button>
          </div>
          <Link to={"/login"} className='text-center block mt-3'>Back to login</Link>
        </div>
      </div>
  )
}

export default ActivateAccount