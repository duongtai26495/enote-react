import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { access_token, currentWs, localWs } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import NoteList from '../components/NoteList'

const Home = () => {

  const getWsAll = async () => {
    const token = Cookies.get(access_token)
    if (token && checkToken(token)) {
      const result = await fetchApiData("workspace/all", token)
      const data = result.content
      setWsList(data)
      localStorage.setItem(localWs,JSON.stringify(data))
    }
  }
  const [wsList, setWsList] = useState(JSON.parse(localStorage.getItem(localWs)) && [])
  const [selectedWs, setSelectedWs] = useState(Number(localStorage.getItem(currentWs)))

  const setCurrentWs = (id) => {
    setSelectedWs(id)
    localStorage.setItem(currentWs, id)
  }

  useEffect(() => {
    getWsAll()
  }, [])

  const RenderWsList = () => {
    return (
      wsList &&
      wsList.map(item => (
        <li onClick={() =>setCurrentWs(item.id)} className={`${selectedWs === item.id ? "border-b-8 border-slate-800" : ""} hover:border-b-8 py-5 cursor-pointer transition-all w-fit`} key={item.id}>{item.name}</li>
      ))
    )
  }

  return (
    <div className='w-full lg:w-2/3 py-2'>
      <p className='font-bold text-xl'>Workspace</p>
      <ul className='flex flex-row border-b gap-5'>
      <RenderWsList />
      </ul>
      <div className='w-full columns-1 md:columns-3 xl:columns-4 mt-5 pt-3'>
        <NoteList id={selectedWs} />
      </div>
    </div>
  )
}

export default Home