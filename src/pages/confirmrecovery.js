import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import AuthenLogo from '../components/AuthenLogo';

const ConfirmRecovery = () => {
    useEffect(()=>{
        document.title = "Confirm recovery"
    },[])
    const navigate = useNavigate()
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const email = params.get("email");
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white shadow-xl border rounded px-8 pt-6 pb-8 mb-4 text-center">
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
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => {
                        // Xử lý chuyển về trang login ở đây
                        navigate("/")
                    }}
                >
                    Back to login page
                </button>
            </div>
        </div>
    )
}

export default ConfirmRecovery