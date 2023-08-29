
import axios from 'axios'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { checkToken, fetchApiData } from '../utils/functions'
import { Link, useNavigate } from 'react-router-dom';
import UserLogin from '../utils/UserLogin';
import { access_token, baseURL, localUser, refresh_token } from '../utils/constants';
import AuthenLogo from '../components/AuthenLogo';

const Login = () => {
    const [err, setErr] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        const checkLogin = () => {
            const token = Cookies.get(access_token)
            checkToken(token) ? navigate("/") : navigate("/login?unlogin")
        }

        checkLogin()
    }, [])

    useEffect(()=>{
        document.title = "User login - Ememo Application"
      },[])

    const handleSubmit = async (e) => {

        setErr(false)
        e.preventDefault()
        const user = new UserLogin()

        user.username = e.target[0].value
        user.password = e.target[1].value
        const data = JSON.stringify(user)
        const url = baseURL + "public/sign-in"
        let config = {
            method: 'POST',
            maxBodyLength: Infinity,
            url,
            headers: {
                'Content-Type': 'application/json'
            },
            data
        };
        try {
            const result = await axios.request(config)
            if (result.status === 200) {
                const data = result.data.content
                const ac_token = data.access_token
                const rf_token = data.refresh_token
                if (ac_token) {
                    Cookies.set(access_token, ac_token, { expires: 1 })
                    localStorage.setItem(refresh_token, rf_token)
                    const username = user.username
                    const userInfo = await fetchApiData(`user/info/${username}`, ac_token)
                    if(userInfo.status === "SUCCESS"){
                        localStorage.setItem(localUser, JSON.stringify(userInfo.content))
                        checkToken(ac_token) ? navigate("/?success") : navigate("login?fail")
                    }
                   
                }

            }
            else {
                console.log("Login Error")
                setErr(true)
            }
        } catch (error) {
            setErr(true)
        }


    }
    return (
        <section className="flex flex-col md:flex-row h-screen items-center">

            <div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
                <img src="https://source.unsplash.com/random" alt="" className="w-full h-full object-cover" />
            </div>

            <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
          flex items-center justify-center">

                <div className="w-full h-100">
                    <AuthenLogo />
                    <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12 m-auto w-fit">Log in to your account</h1>
                    <form className="mt-6" onSubmit={handleSubmit}>
                        <div className="flex items-center border-2 py-2 px-3 rounded-lg mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                            </svg>
                            <input className="w-full pl-2 outline-none border-none" type="text" name="" id="username" placeholder="Username" />
                        </div>
                        <div className="flex items-center border-2 py-2 px-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fillRule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clipRule="evenodd" />
                            </svg>
                            <input className="w-full pl-2 outline-none border-none" type="password" name="" id="password" placeholder="Password" />
                        </div>

                        <div className="text-right mt-2">
                            <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700">Forgot Password?</a>
                        </div>

                        <button type="submit" className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg
                px-4 py-2 mt-6">Log In</button>
                    </form>

                    <hr className="my-6 border-gray-300 w-full" />

                    <button type="submit" className="w-full block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-2 border border-gray-300">
                        <div className="flex items-center justify-center">
                            <span className="ml-4">
                                Log in
                                with
                                Google</span>
                        </div>
                    </button>

                    <p className="mt-8">Need an account? <Link to="/register" className="text-blue-500 hover:text-blue-700 font-semibold">Create an
                        account</Link></p>

                    {err && <p className='text-red-600 text-center w-full my-5'>Something went wrong !</p>}
                </div>

            </div>

        </section>
    )
}

export default Login