import React, { useEffect, useState } from 'react'
import ProgressBar from './ProgressBar'
import Cookies from 'js-cookie'
import { access_token } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
const ProfileAnalytics = () => {

  const [noteCount, setNoteCount] = useState(0)
  const [taskCount, setTaskCount] = useState(0)
  const [finishTaskCount, setFinishTaskCount] = useState(0)
  const [workspaceCount, setWorkspaceCount] = useState(0)
  const [percentageFinishTask, setPercentageFinishTask] = useState(0)
  const [percentageFinishNote, setPercentageFinishNote] = useState(0)
    const token = Cookies.get(access_token)
    
  useEffect(()=>{
    const getAnalytics = async () => {
        if(checkToken(token)){
            const result = await fetchApiData("user/analytics", token)
            if(result.status === "SUCCESS"){
                const data = result.content
                setWorkspaceCount(Number(data.workspaces))
                setNoteCount(Number(data.notes))
                setTaskCount(Number(data.tasks))
                setFinishTaskCount(Number(data.tasksDone))
                setPercentageFinishTask(Math.round(data.percentageTasks))
                setPercentageFinishNote(Math.round(data.percentageNotes))
            }
        }
    }
    getAnalytics()
  },[])


  return (
    <div className='w-full flex flex-wrap flex-row'>
      <div className='count-view w-full flex flex-row flex-wrap'>

        <div className='flex h-fit w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4'>
          <div className='flex h-full w-full flex-col justify-between gap-6 bg-white shadow-lg rounded-xl border p-2'>
            <span className='p-4 rounded-md bg-slate-100 w-fit'>
              <svg className="fill-blue-600" height="30" width="30" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H4Zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" /><path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.373 5.373 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2H2Z" /></svg>
            </span>
            <p className='flex flex-col px-4 pl-1 text-blue-600'>
              <span className='text-base analy-text'>
                Workspaces
              </span>
              <span className='text-3xl font-bold'>
                {workspaceCount}
              </span>
            </p>
          </div>
        </div>

        <div className='flex h-fit w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4'>
          <div className='flex h-full w-full flex-col p-2 justify-between gap-6 text-lg bg-white shadow-lg rounded-xl border'>
            <span className='p-4 rounded-md bg-slate-100 w-fit'>
              <svg height="30" className='fill-teal-600' id="Layer_1" version="1.1" viewBox="0 0 512 512" width="30" xmlns="http://www.w3.org/2000/svg"><path d="M449.441,393.818V178.852c0-31.555-27.967-57.236-62.365-57.236H369.99v-3.434c0-31.566-27.967-57.236-62.365-57.236  h-23.034H152.586h-27.661c-34.388,0-62.365,25.67-62.365,57.236v214.965c0,31.555,27.978,57.236,62.365,57.236h17.084v3.435  c0,31.565,27.978,57.235,62.366,57.235h27.661h132.005h11.867h11.167C421.474,451.053,449.441,425.384,449.441,393.818z   M364.041,432.318H232.036h-27.661c-23.177,0-41.956-17.237-41.956-38.5v-3.435v-18.736V178.852c0-21.263,18.779-38.5,41.956-38.5  h27.661h117.545h14.46h5.949h17.085c23.177,0,41.956,17.237,41.956,38.5v214.966c0,21.263-18.779,38.5-41.956,38.5h-11.167H364.041z  " /><path d="M197.397,214.935h162.334c4.484,0,8.115-3.632,8.115-8.116s-3.631-8.115-8.115-8.115H197.397  c-4.484,0-8.116,3.631-8.116,8.115S192.913,214.935,197.397,214.935z" /><path d="M223.046,261.967c0,4.484,3.642,8.115,8.126,8.115h152.119c4.484,0,8.126-3.631,8.126-8.115s-3.642-8.127-8.126-8.127  H231.172C226.688,253.84,223.046,257.482,223.046,261.967z" /><path d="M348.083,317.102c0-4.484-3.632-8.116-8.116-8.116h-142.57c-4.484,0-8.116,3.632-8.116,8.116s3.631,8.126,8.116,8.126  h142.57C344.451,325.228,348.083,321.587,348.083,317.102z" /><path d="M391.417,372.249c0-4.484-3.642-8.115-8.126-8.115H249.689c-4.484,0-8.116,3.631-8.116,8.115s3.631,8.116,8.116,8.116  h133.602C387.776,380.365,391.417,376.733,391.417,372.249z" /></svg>
            </span>
            <p className='flex flex-col px-4 pl-1 text-teal-600'>
              <span className='text-base analy-text'>
                Notes
              </span>
              <span className='text-3xl font-bold'>
                {noteCount}
              </span>
            </p>
          </div>
        </div>

        <div className='flex h-fit w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4'>
          <div className='flex h-full w-full flex-col p-2 justify-between gap-6 text-lg bg-white shadow-lg rounded-xl border'>
            <span className='p-4 rounded-md bg-slate-100 w-fit'>
              <svg width={30} height={30} className='fill-violet-600' version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g><path d="M20,5h-1c0-1.654-1.346-3-3-3s-3,1.346-3,3h-1c-0.552,0-1,0.447-1,1v1H8.821C7.266,7,6,8.266,6,9.821v17.357   C6,28.734,7.266,30,8.821,30h14.357C24.734,30,26,28.734,26,27.179V9.821C26,8.266,24.734,7,23.179,7H21V6C21,5.447,20.552,5,20,5z    M16,4c0.551,0,1,0.448,1,1h-2C15,4.448,15.449,4,16,4z M13,7h6v2h-6V7z M23.179,9C23.631,9,24,9.368,24,9.821v17.357   C24,27.632,23.631,28,23.179,28H8.821C8.369,28,8,27.632,8,27.179V9.821C8,9.368,8.369,9,8.821,9H11v1c0,0.553,0.448,1,1,1h8   c0.552,0,1-0.447,1-1V9H23.179z" /><path d="M13,13h-3c-0.552,0-1,0.447-1,1v3c0,0.553,0.448,1,1,1h3c0.552,0,1-0.447,1-1v-3C14,13.447,13.552,13,13,13z M12,16h-1v-1   h1V16z" /><path d="M15,15.5c0,0.553,0.448,1,1,1h6c0.552,0,1-0.447,1-1s-0.448-1-1-1h-6C15.448,14.5,15,14.947,15,15.5z" /><path d="M13,20h-3c-0.552,0-1,0.447-1,1v3c0,0.553,0.448,1,1,1h3c0.552,0,1-0.447,1-1v-3C14,20.447,13.552,20,13,20z M12,23h-1v-1   h1V23z" /><path d="M22,21.5h-6c-0.552,0-1,0.447-1,1s0.448,1,1,1h6c0.552,0,1-0.447,1-1S22.552,21.5,22,21.5z" /></g></svg>
            </span>
            <p className='flex flex-col px-4 pl-1 text-violet-600'>
              <span className='text-base analy-text'>
                Tasks
              </span>
              <span className='text-3xl font-bold'>
                {taskCount}
              </span>
            </p>
          </div>
        </div>

        <div className='flex h-fit w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4'>
          <div className='flex h-full w-full flex-col p-2 justify-between gap-6 text-lg bg-white shadow-lg rounded-xl border'>
            <span className='p-4 rounded-md bg-slate-100 w-fit'>
              <svg className='fill-pink-600' width={30} height={30} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M139.61 35.5a12 12 0 0 0-17 0L58.93 98.81l-22.7-22.12a12 12 0 0 0-17 0L3.53 92.41a12 12 0 0 0 0 17l47.59 47.4a12.78 12.78 0 0 0 17.61 0l15.59-15.62L156.52 69a12.09 12.09 0 0 0 .09-17zm0 159.19a12 12 0 0 0-17 0l-63.68 63.72-22.7-22.1a12 12 0 0 0-17 0L3.53 252a12 12 0 0 0 0 17L51 316.5a12.77 12.77 0 0 0 17.6 0l15.7-15.69 72.2-72.22a12 12 0 0 0 .09-16.9zM64 368c-26.49 0-48.59 21.5-48.59 48S37.53 464 64 464a48 48 0 0 0 0-96zm432 16H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z" /></svg>
            </span>
            <p className='flex flex-col px-4 pl-1 text-pink-600'>
              <span className='text-base analy-text'>
                Finished Tasks
              </span>
              <span className='text-3xl font-bold'>
                {finishTaskCount}
              </span>
            </p>
          </div>
        </div>

        <div className='flex h-fit w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4'>
          <div className='flex h-full w-full flex-col p-2 justify-between gap-6 text-lg bg-white shadow-lg rounded-xl border'>
            <span className='p-4 rounded-md bg-slate-100 w-fit'>
            <svg height="30" id="icon" className='fill-lime-600' viewBox="0 0 32 32" width="30" xmlns="http://www.w3.org/2000/svg"><defs></defs><path d="M30,20A6,6,0,1,0,20,24.46V32l4-1.8936L28,32V24.46A5.98,5.98,0,0,0,30,20Zm-4,8.84-2-.9467L22,28.84V25.65a5.8877,5.8877,0,0,0,4,0ZM24,24a4,4,0,1,1,4-4A4.0045,4.0045,0,0,1,24,24Z"/><path d="M25,5H22V4a2.0058,2.0058,0,0,0-2-2H12a2.0058,2.0058,0,0,0-2,2V5H7A2.0058,2.0058,0,0,0,5,7V28a2.0058,2.0058,0,0,0,2,2h9V28H7V7h3v3H22V7h3v5h2V7A2.0058,2.0058,0,0,0,25,5ZM20,8H12V4h8Z"/><rect className="cls-1" height="30" id="_Transparent_Rectangle_" width="30"/></svg>
            </span>
            <p className='flex flex-col px-4 pl-1 text-lime-600'>
              <span className='text-base xl:whitespace-nowrap analy-text'>
                Finished Notes
              </span>
              <span className='text-2xl font-bold'>
                {percentageFinishNote}
              </span>
            </p>
          </div>
        </div>

        <div className='flex h-fit w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4'>
          <div className='flex h-full w-full flex-col p-2 justify-between gap-6 text-lg bg-white shadow-lg rounded-xl border'>
            <span className='p-4 rounded-md bg-slate-100 w-fit'>
            <svg height="30" className='fill-fuchsia-600' viewBox="0 0 24 24" width="30" xmlns="http://www.w3.org/2000/svg"><path d="M5 22h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2h-2a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1H5c-1.103 0-2 .897-2 2v15c0 1.103.897 2 2 2zM5 5h2v2h10V5h2v15H5V5z"/><path d="m11 13.586-1.793-1.793-1.414 1.414L11 16.414l5.207-5.207-1.414-1.414z"/></svg>
            </span>
            <p className='flex flex-col px-4 pl-1 text-fuchsia-600'>
              <span className='text-base xl:whitespace-nowrap analy-text'>
                Tasks Progress
              </span>
              <span className='text-2xl font-bold'>
                {percentageFinishTask}%
              </span>
            </p>
          </div>
        </div>

        
      </div>
    </div>
  )
}

export default ProfileAnalytics