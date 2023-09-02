import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../components/Breadcrumbs'
import Cookies from 'js-cookie'
import { access_token, baseURL, localUser } from '../utils/constants'
import { checkToken, fetchApiData, getTheTime } from '../utils/functions'
import { useNavigate } from 'react-router-dom'
import CustomLazyLoadedImage from '../components/CustomLazyLoadedImage'

const UserProfile = () => {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem(localUser)) ?? {})
  const token = Cookies.get(access_token)
  const [isUpdateName, setUpdateNameState] = useState(false)
  const [newFname, setNewFname] = useState(user.f_name)
  const [newLname, setNewLname] = useState(user.l_name)
  
  const navigate = useNavigate()
  const getUserProfile = async () => {
    if (checkToken(token)) {
      const result = await fetchApiData(`user/info/${user.username}`, token)
      if (result.status === "SUCCESS") {
        setUser(result.content)
        localStorage.setItem(localUser, JSON.stringify(result.content))
      } else {
        navigate("/login?unlogin=true")
      }
    }
  }

  useEffect(() => {
    getUserProfile()
  }, [])

  const updateUserInfo = async (newUser) => {
    if (checkToken(token)) {
      const result = await fetchApiData(`user/update`, token, "PUT", JSON.stringify(newUser))
      if (result.status === "SUCCESS") {
        let updatedUser = result.content
        console.log(updatedUser)
        setUser(updatedUser)
        localStorage.removeItem(localUser)
        localStorage.setItem(localUser, JSON.stringify(updatedUser))
        setUpdateNameState(false)
      }
    }
  }

  const updateUserHandle = async () => {
    if (newLname !== "" && newFname !== "") {
      let newUser = {
        l_name: newLname,
        f_name: newFname,
        username: user.username,
        gender: user.gender
      }

      await updateUserInfo(newUser)
    }
  }

  const toggleUpdateName = () => {setUpdateNameState(prevState => !prevState)}

  return (
    <div className={`w-full`}>
      <div className='w-full flex flex-col'>
        <Breadcrumbs />
      </div>
      <div className='w-full flex flex-row'>
        <div className={`w-1/5`}>
          <div className='w-full h-full flex flex-row border-r px-2'>
            <div className='w-full flex flex-col gap-2 mt-5 border-b pb-3'>
              <CustomLazyLoadedImage
                style={`w-full h-full aspect-square object-cover rounded-full mb-3 border-8 border-gray-300`}
                src={`${user.profile_image ? baseURL + "public/image/" + user.profile_image : "https://source.unsplash.com/random"}`}
              />
              <h3 onClick={toggleUpdateName} className={`${isUpdateName ? "hidden" : "flex"} text-2xl font-bold mb-3 w-full text-center`}>{user.f_name} {user.l_name}</h3>
              <div className={`${isUpdateName ? "flex" : "hidden"} w-full flex-col gap-3`}>
                <div className={`w-full transition-all flex flex-row gap-3`}>
                  <input
                    type='text'
                    className='w-full px-2 py-1 rounded text-black bg-slate-100 border'
                    placeholder='First name'
                    id='profile_f_name'
                    name='profile_f_name'
                    onChange={(e)=>setNewFname(e.target.value)}
                    defaultValue={newFname}
                  />
                  <input
                    type='text'
                    className='w-full px-2 py-1 rounded text-black bg-slate-100 border'
                    placeholder='Last name'
                    id='profile_l_name'
                    name='profile_l_name'
                    onChange={(e)=>setNewLname(e.target.value)}
                    defaultValue={newLname}
                  />
                </div>
                <div className={`flex transition-all flex-row gap-3`}>
                  <span className='w-full text-center rounded border bg-emerald-700 text-white' onClick={() => { updateUserHandle() }}>Done</span>
                  <span className='w-full text-center rounded border bg-amber-500 text-white' onClick={() => { setUpdateNameState(false) }}>Cancel</span>
                </div>
              </div>
              <p className='text-sm text-gray-600'><strong>Username:</strong> {user.username}</p>
              <p className='text-sm text-gray-600'><strong>Email:</strong> {user.email}</p>
              <p className='text-sm text-gray-600'><strong>Joined at:</strong> {getTheTime(user.joined_at)}</p>
              <p className='text-sm text-gray-600'><strong>Last edited:</strong> {getTheTime(user.updated_at)}</p>
            </div>
          </div>
        </div>
        <div className={`w-4/5`}>

        </div>
      </div>
    </div >
  )
}

export default UserProfile