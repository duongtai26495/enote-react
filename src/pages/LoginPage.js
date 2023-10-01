
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import { checkToken, fetchApiData } from '../utils/functions'
import { Link, useNavigate } from 'react-router-dom';
import UserLogin from '../utils/UserLogin';
import { SUCCESS_RESULT, USERNAME_LOCAL, ACCESS_TOKEN, URL_PREFIX, LOCAL_USER, REFRESH_TOKEN, ACTIVATE_EMAIL, AUTO_SEND } from '../utils/constants';
import AuthenLogo from '../components/AuthenLogo';
import { IS_REMEMBER } from '../utils/constants';
import LoadingComponent from '../components/LoadingComponent';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const {t , i18n} = useTranslation()
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
    document.title = "User login - Space Application"
    rememberMe ? setUsername(localStorage.getItem(USERNAME_LOCAL)) : setUsername("")
  }, [])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  const checkInputLogin = async () => {
    setCommonErrMsg("")
    setUsernameErrMsg("")
    setPasswordErrMsg("")
    let error = false
    if (username.length < 5) {
      error = true
      setUsernameErrMsg(t('authen.validate_username',{value:5}))
    }
    if (password.length < 5) {
      error = true
      setPasswordErrMsg(t('authen.validate_password',{value:5}))
    }

    if (error) {
      setCommonErrMsg(t('authen.common_error'))
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
          if (userInfo.status === SUCCESS_RESULT) {
            let userData = userInfo.content
            localStorage.setItem(LOCAL_USER, JSON.stringify(userData))
            if (userData.activate) {
              checkToken(ac_token) ? navigate("/?success") : navigate("login?fail")
              setLoading(false)
            } else {
              setLoading(false)
              localStorage.setItem(ACTIVATE_EMAIL, userData.email)
              localStorage.setItem(AUTO_SEND, true)
              navigate("/activate-account")
            }
          }
        }
      } else {
        setCommonErrMsg(result.data.msg)
        setLoading(false)
      }
  }


  return (
    <div className="authen-box authen-form h-fit login-form lg:w-96 max-w-sm flex items-center justify-center absolute">
      <div className={`${isLoading ? "flex" : "hidden"} transition-all absolute top-0 left-0 z-40 items-center justify-center  w-full h-full bg-white bg-opacity-70`}>
        <LoadingComponent />
      </div>
      <div className="p-6 w-full">
        <AuthenLogo />
        <h2 className="text-2xl font-semibold my-4 text-left">{t('authen.login_greeting')}</h2>
        <div className="mb-4">
          <input
            type="text"
            className={`${usernameErrorMsg ? "border-red-500" : ""} mb-2 p-2 border rounded-lg w-full bg-white bg-opacity-60 outline-none`}
            placeholder={t('authen.username')}
            value={username}
            onKeyDown={(e) => e.key === 'Enter' ? passwordRef.current.focus() : null}
            onChange={(e) => setUsername(e.target.value)}
          />

          <p className={`text-red-600 text-sm text-center w-full mb-2 h-5`}>{usernameErrorMsg}</p>
        </div>
        <div className="mb-4">
          <input
            type="password"
            className={`${passwordErrorMsg ? "border-red-500" : ""} mb-2 p-2 border rounded-lg w-full bg-white bg-opacity-60 outline-none`}
            placeholder={t('authen.password')}
            value={password}
            ref={passwordRef}
            onKeyDown={handleKeyPress}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className={`text-red-600 text-sm text-center w-full mb-2 h-5`}>{passwordErrorMsg}</p>
        </div>
        <div className="mb-4 flex gap-2 items-center">

          <div onClick={() => setRememberMe(prevState => !prevState)} className={`remember_switch ${rememberMe ? "bg-green-700" : "bg-gray-100 border-gray-300 border"}`}>
            <span className={`remember_button border ${rememberMe ? "remember_true" : "remember_false"}`}></span>

          </div>
          <label htmlFor='rememberme' className="cursor-pointer text-sm text-gray-600">{t('authen.remember_me')}</label>
        </div>
        <button className="bg-white border-2 w-full  font-bold text-slate-600 px-4 hover:shadow-md transition-shadow py-2 rounded-lg mr-2"
          onClick={checkInputLogin}>
          {t('authen.login')}
        </button>
        <div className="mt-4">
          <p className="text-sm text-blue-600 my-2">
            <Link to={"/forgot-password"}>{t('authen.forgot_password')}</Link>
          </p>
          <p className="text-sm text-gray-600">
           {t('authen.donot_have_account')} <Link className='font-bold' to="/register">{t('authen.register')}</Link>
          </p>
        </div>

        <p className={`text-red-600 text-sm font-bold text-center w-full my-5 h-3`}>{commonErrorMsg}</p>
      </div>
    </div>
  );
}

export default LoginPage