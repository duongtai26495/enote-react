
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthenLogo from '../components/AuthenLogo';
import { fetchApiData } from '../utils/functions';

const RecoveryPassword = () => {
    useEffect(()=>{
        document.title = "Recovery email"
    },[])
    const [email, setEmail] = useState("");
    const navigate = useNavigate()
    
    const handleEmailChange = (event) => {
      setEmail(event.target.value);
    };
  
    const handleConfirmClick = async () => {
        const result = await fetchApiData(`public/recovery/${email}`,"")
        if(result.status === "SUCCESS"){
            navigate("/confirm-recovery?email="+email)
        }
        else{
            console.log("Email do not exist")
        }
    };
  

    return (
      <div className="flex items-center justify-center">
        <div className="bg-white shadow-xl border rounded px-8 pt-6 pb-8 mb-4">
            <AuthenLogo />
            <p className='text-base my-5'>Please enter your registered email to recovery your account.</p>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="flex items-center gap-3 justify-between">
            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleConfirmClick}
            >
              Confirm
            </button>
            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={()=>navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
}

export default RecoveryPassword