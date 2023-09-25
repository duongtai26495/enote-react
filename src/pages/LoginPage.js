
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import { checkToken, fetchApiData } from '../utils/functions'
import { Link, useNavigate } from 'react-router-dom';
import UserLogin from '../utils/UserLogin';
import { SUCCESS_RESULT, USERNAME_LOCAL, ACCESS_TOKEN, URL_PREFIX, LOCAL_USER, REFRESH_TOKEN } from '../utils/constants';
import AuthenLogo from '../components/AuthenLogo';
import { IS_REMEMBER } from '../utils/constants';
import LoadingComponent from '../components/LoadingComponent';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(localStorage.getItem(IS_REMEMBER) ?? false);
  const passwordRef = useRef(null)
  const [isLoading, setLoading] = useState(false)

  const [usernameErrorMsg, setUsernameErrMsg] = useState("")
  const [passwordErrorMsg, setPasswordErrMsg] = useState("")
  const [commonErrorMsg, setCommonErrMsg] = useState("")

  const navigate = useNavigate()
  useEffect(() => {
    const checkLogin = () => {
      const token = Cookies.get(ACCESS_TOKEN)
      checkToken(token) ? navigate("/") : navigate("/login?unlogin")
    }

    checkLogin()
    document.title = "User login - Ememo Application"
    rememberMe ? setUsername(localStorage.getItem(USERNAME_LOCAL)) : setUsername("")
  }, [])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  const checkInputLogin = async () => {
    setCommonErrMsg("")
    setUsername("")
    setPassword("")
    let error = false
    if (username.length < 5) {
      error = true
      setUsernameErrMsg("Username must have more than 5 characters")
    }
    if (password.length < 5) {
      error = true
      setPasswordErrMsg("Password must have more than 5 characters")
    }

    if (error) {
      setCommonErrMsg("Something went wrong ! Please check again")
    } else {
      await handleLogin()
    }
  }

  const handleLogin = async () => {
    setLoading(true)
    if (rememberMe) {
      localStorage.setItem(IS_REMEMBER, rememberMe)
      localStorage.setItem(USERNAME_LOCAL, username)
    }
    else {
      localStorage.removeItem(IS_REMEMBER)
      localStorage.removeItem(USERNAME_LOCAL)
    }
    const user = new UserLogin()

    user.username = username
    user.password = password

    const result = await fetchApiData("public/sign-in", null, "POST", user)
    if (result.status === SUCCESS_RESULT) {
      const data = result.content
      const ac_token = data.access_token
      const rf_token = data.refresh_token
      if (ac_token) {
        Cookies.set(ACCESS_TOKEN, ac_token, { expires: 1 })
        localStorage.setItem(REFRESH_TOKEN, rf_token)
        const username = user.username
        const userInfo = await fetchApiData(`user/info/${username}`, ac_token)
        if (userInfo.status === "SUCCESS") {
          localStorage.setItem(LOCAL_USER, JSON.stringify(userInfo.content))
          checkToken(ac_token) ? navigate("/?success") : navigate("login?fail")
          setLoading(false)
        }
      }
    } else {
      setCommonErrMsg(result.data.msg)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex relative justify-center items-center">
      <div className="bg-page w-full h-full absolute top-0 left-0 z-0 bg-cover bg-center bg-gray-100">

      </div>
      <div className="authen-box authen-form h-fit login-form lg:w-96 max-w-sm flex items-center justify-center absolute">
        <div className={`${isLoading ? "flex" : "hidden"} transition-all absolute top-0 left-0 z-40 items-center justify-center  w-full h-full bg-white bg-opacity-70`}>
          <LoadingComponent />
        </div>
        <div className="p-6 w-full">
          <AuthenLogo />
          <h2 className="text-2xl font-semibold my-4 text-center">Đăng nhập</h2>
          <div className="mb-4">
            {/* <label className="block text-gray-600 text-sm font-semibold">Tên đăng nhập</label> */}
            <input
              type="text"
              className={`${usernameErrorMsg ? "border-red-500" : ""} mb-2 p-2 border rounded-lg w-full bg-white bg-opacity-60 outline-none`}
              placeholder="Nhập tên đăng nhập"
              value={username}
              onKeyDown={(e) => e.key === 'Enter' ? passwordRef.current.focus() : null}
              onChange={(e) => setUsername(e.target.value)}
            />
            
          <p className={`text-red-600 text-sm text-center w-full mb-2 h-5`}>{usernameErrorMsg}</p>
          </div>
          <div className="mb-4">
            {/* <label className="block text-gray-600 text-sm font-semibold">Mật khẩu</label> */}
            <input
              type="password"
              className={`${passwordErrorMsg ? "border-red-500" :"" } mb-2 p-2 border rounded-lg w-full bg-white bg-opacity-60 outline-none`}
              placeholder="Nhập mật khẩu"
              value={password}
              ref={passwordRef}
              onKeyDown={handleKeyPress}
              onChange={(e) => setPassword(e.target.value)}
            />
          <p className={`text-red-600 text-sm text-center w-full mb-2 h-5`}>{passwordErrorMsg}</p>
          </div>
          <div className="mb-4 flex gap-2 items-center">
            {/* <input
              id='rememberme'
              type="checkbox"
              className="mr-2"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            /> */}
            <div onClick={() => setRememberMe(prevState => !prevState)} className={`remember_switch ${rememberMe ? "bg-green-700" : "bg-gray-100 border-gray-300 border"}`}>
              <span className={`remember_button border ${rememberMe ? "remember_true" : "remember_false"}`}></span>

            </div>
            <label htmlFor='rememberme' className="cursor-pointer font-bold text-sm text-gray-600">Ghi nhớ tên đăng nhập</label>
          </div>
          <button className="bg-white border w-full  font-bold text-slate-600 px-4 hover:shadow-md transition-shadow py-2 rounded-lg mr-2"
            onClick={checkInputLogin}>
            Đăng nhập
          </button>
          <div className="mt-4">
            <p className="text-sm text-blue-600 my-2">
              <Link to={"/recovery"}>Quên mật khẩu?</Link>
            </p>
            <p className="text-sm text-gray-600">
              Chưa có tài khoản? <Link className='font-bold' to="/register">Đăng ký ngay</Link>
            </p>
          </div>

          <p className={`text-red-600 text-sm font-bold text-center w-full my-5 h-3`}>{commonErrorMsg}</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage