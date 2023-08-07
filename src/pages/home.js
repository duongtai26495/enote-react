import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { access_token, currentWs, localWs } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import NoteList from '../components/NoteList'

const Home = () => {

  const [isVisible, setIsVisible] = useState(false);
  const getWsAll = async () => {
    const token = Cookies.get(access_token)
    if (token && checkToken(token)) {
      const result = await fetchApiData("workspace/all", token)
      const data = result.content
      setWsList(data)
      localStorage.setItem(localWs, JSON.stringify(data))
    }
  }
  const [wsList, setWsList] = useState(JSON.parse(localStorage.getItem(localWs)) && [])
  const [selectedWs, setSelectedWs] = useState(Number(localStorage.getItem(currentWs)))

  const setCurrentWs = (id) => {
    setSelectedWs(id)
    localStorage.setItem(currentWs, id)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 500); // Đợi 1 giây trước khi hiển thị phần tử

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    getWsAll()
  }, [])

  const RenderWsList = () => {
    return (
      wsList &&
      wsList.map(item => (
        <li onClick={() => setCurrentWs(item.id)} className={`${selectedWs === item.id ? "border-b-8 border-slate-800" : ""} whitespace-nowrap hover:border-b-8 py-5 cursor-pointer transition-all w-fit`} key={item.id}>{item.name}</li>
      ))
    )
  }

  return (
    <div className='w-full flex flex-row'>
    <div className='w-full lg:w-2/3 py-2'>
      <p className='font-bold text-xl'>Workspace</p>
      <ul className={`flex flex-row border-b gap-5 w-full overflow-x-auto`}>

        <RenderWsList />
      </ul>
      <div className={`flex flex-col max-h-screen mt-2 pt-2 slide-up ${isVisible ? 'visible' : ''}`}>
        <NoteList id={selectedWs} />
      </div>
    </div>
    <div className='w-1/3 h-screen hidden lg:flex bg-slate-600'>
      Chat
    </div>
    </div>
  )
}

export default Home