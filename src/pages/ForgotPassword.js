import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { fetchApiData } from '../utils/functions';
import LoadingComponent from '../components/LoadingComponent';
import { AUTO_SEND_RECOVERY, SUCCESS_RESULT } from '../utils/constants';

const ForgotPassword = () => {
    
  const [isLoading, setLoading] = useState(false)
    const [errMsg, setErrMsg] = useState("")
const [email, setEmail] = useState("");
const navigate = useNavigate()

const handleEmailChange = (event) => {
  setEmail(event.target.value);
};

const handleConfirmClick = async () => {
    const result = await fetchApiData(`public/check-email/${email}`,"")
    if(result){
        localStorage.removeItem(AUTO_SEND_RECOVERY)
        localStorage.setItem(AUTO_SEND_RECOVERY, false)
        navigate("/confirm-recovery?email="+email)
    }
    else{
        setErrMsg("Email do not exist")
    }
};

useEffect(()=>{
    document.title = "Recovery email"
},[])

  return (
    <div className="authen-box authen-form h-fit login-form lg:w-96 max-w-sm flex items-center justify-center absolute">
    <div className={`${isLoading ? "flex" : "hidden"} transition-all absolute top-0 left-0 z-40 items-center justify-center  w-full h-full bg-white bg-opacity-70`}>
      <LoadingComponent />
    </div>
    <div className="p-6 w-full">
    <p className='text-base my-5'>Please enter your registered email to recovery your account.</p>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <p className='h-5 block text-center text-red-500 font-bold text-md mb-5'>{errMsg}</p>

          <div className="flex items-center gap-3 justify-between">
            <button
              className="w-full bg-slate-50 hover:shadow-lg text-black border font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleConfirmClick}
            >
              Confirm
            </button>
            <button
              className="w-full bg-slate-50 hover:shadow-lg text-black border font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={()=>navigate(-1)}
            >
              Back
            </button>
            
          </div>
  </div>
  </div>
  )
}

export default ForgotPassword