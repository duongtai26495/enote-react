
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import { checkToken, fetchApiData } from '../utils/functions'
import { Link, useNavigate } from 'react-router-dom';
import UserLogin from '../utils/UserLogin';
import { USERNAME_LOCAL, access_token, baseURL, localUser, refresh_token } from '../utils/constants';
import AuthenLogo from '../components/AuthenLogo';
import LoadingAnimation from '../components/LoadingAnimation';
import { IS_REMEMBER } from '../utils/constants';
import LoadingComponent from '../components/LoadingComponent';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(Boolean(localStorage.getItem(IS_REMEMBER)) ?? false);
  const passwordRef = useRef(null)
  const [isLoading, setLoading] = useState(false)
  const [err, setErr] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    const checkLogin = () => {
      const token = Cookies.get(access_token)
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

  const handleLogin = async (e) => {
    setLoading(true)
    if (rememberMe) {
      localStorage.setItem(IS_REMEMBER, rememberMe)
      localStorage.setItem(USERNAME_LOCAL, username)
    }
    else {
      localStorage.removeItem(IS_REMEMBER)
      localStorage.removeItem(USERNAME_LOCAL)
    }
    if (username.length >= 5 && password.length >= 6) {

      setErr(false)
      e.preventDefault()
      const user = new UserLogin()

      user.username = username
      user.password = password
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
            if (userInfo.status === "SUCCESS") {
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
      finally{
        setLoading(false)
      }
    } else {
      setErr(true)
    }
  }
  return (
    <div className="min-h-screen flex">
      <div style={{ backgroundImage: `url(https://source.unsplash.com/random)` }} className="bg-page hidden md:block md:w-2/3 bg-cover bg-center bg-indigo-600">

      </div>

      <div className="w-full md:w-1/3 bg-white flex items-center justify-center relative">
        <div className={`${isLoading ? "flex" : "hidden"} transition-all absolute top-0 left-0 z-40 items-center justify-center  w-full h-full bg-white bg-opacity-70`}>
          <LoadingComponent />
        </div>
        <div className="p-6">
          <AuthenLogo />
          <h2 className="text-2xl font-semibold my-4 text-center">Đăng nhập</h2>
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold">Tên đăng nhập</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onKeyDown={(e) => e.key === 'Enter' ? passwordRef.current.focus() : null}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold">Mật khẩu</label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              placeholder="Nhập mật khẩu"
              value={password}
              ref={passwordRef}
              onKeyDown={handleKeyPress}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              id='rememberme'
              type="checkbox"
              className="mr-2"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor='rememberme' className="cursor-pointer text-gray-600">Ghi nhớ tên đăng nhập</label>
          </div>
          <button className=" bg-blue-500 w-full text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleLogin}>
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
          <div className="mt-4 flex">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2">Đăng nhập với Facebook</button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg">Đăng nhập với Google</button>
          </div>

          {err && <p className='text-red-600 text-center w-full my-5'>Something went wrong !</p>}
        </div>
      </div>
    </div>
  );
}

export default LoginPage