import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { checkToken, fetchApiData, getTheTime } from '../utils/functions'
import { ACCESS_TOKEN, SUCCESS_RESULT } from '../utils/constants'
import Cookies from 'js-cookie'

const PlanCard = ({ item, removeWs }) => {
    const { t } = useTranslation()
    const [isConfirm, setConfirm] = useState(false)
    const [workspace, setWorkspace] = useState(item)
    const isMounted = useRef(false);
    const [newFavorite, setFavorite] = useState(workspace.favorite)

    useEffect(() => {
        if (isMounted.current) {
            updateWsById()
        } else {
            isMounted.current = true;
        }
    }, [newFavorite])

    const remove_workspace = async () => {
        removeWs(workspace.id)
    }

    const toggleFavorite = () => {
        setFavorite(prevState => !prevState)
    }
    const toggleConfirm = () => {
        setConfirm(prevState => !prevState)
    }

    const updateWsById = async () => {
        let newFav = newFavorite
        const token = Cookies.get(ACCESS_TOKEN)
        let newWs = workspace
        newWs.favorite = newFav
        if (checkToken(token)) {
            const result = await fetchApiData(`workspace/update`, token, "PUT", newWs)
            if (result.status === SUCCESS_RESULT) {
                setWorkspace(result.content)
            }
        } else {

        }
    }

    return (
        <div className='w-full bg-white relative flex items-center justify-between py-2 px-1 lg:hover:bg-opacity-0 border border-white transition-all'>
            <div className={`${isConfirm ? "flex" : "hidden"} transition-all items-center justify-center absolute top-0 left-0 bg-black bg-opacity-50 w-full h-full z-10 gap-2`}>
                <p className='text-white font-bold'>
                    {t('workspace.confirm_delete', { value: workspace.name })}
                </p>
                <div className='flex items-center gap-2'>

                    <button onClick={() => remove_workspace()} className='p-2 h-fit my-1 rounded-md bg-green-600 text-white font-bold text-sm'>
                        {t('workspace.delete')}
                    </button>
                    <button className='p-2 h-fit my-1 rounded-md bg-yellow-600 text-white font-bold text-sm' onClick={() => setConfirm(false)}>
                        {t('workspace.cancel')}
                    </button>
                </div>
            </div>
            <Link to={`/workspace/${workspace.id}`} className='w-4/6 lg:w-5/6 flex items-center relative'>

                <div className='w-4/6'>
                    <h3 className='font-bold text-md'>{workspace.name}</h3>
                    <p className='text-xs italic'>{workspace.description}</p>
                </div>

                <div className='w-2/6 items-center flex justify-center'>
                    <p>{workspace.note_count}</p>
                </div>
            </Link>
            <div className='w-2/6 lg:w-1/6 items-end flex flex-col justify-center gap-2'>
                <div className='items-center flex justify-start gap-2'>
                    <svg className='w-3 h-3 hidden lg:block' viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs></defs><title />
                        <g dataname="Layer 15" id="Layer_15">
                            <path className="cls-1" d="M16,31A15,15,0,1,1,31,16,15,15,0,0,1,16,31ZM16,3A13,13,0,1,0,29,16,13,13,0,0,0,16,3Z" />
                            <path className="cls-1" d="M20.24,21.66l-4.95-4.95A1,1,0,0,1,15,16V8h2v7.59l4.66,4.65Z" />
                        </g>
                    </svg>
                    <span className='text-xs flex items-center gap-1'>
                        {getTheTime(workspace.created_at)}
                    </span>
                </div>
                <div className='flex items-center gap-2 justify-start'>
                    <button className={`${workspace.note_count > 0 ? "invisible" : "visible"} w-8 h-8 p-2 rounded-sm bg-red-100`} onClick={toggleConfirm}>
                        <svg className='w-full h-full fill-red-600 lg:hover:fill-red-700' viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M53.21 467c1.562 24.84 23.02 45 47.9 45h245.8c24.88 0 46.33-20.16 47.9-45L416 128H32L53.21 467zM432 32H320l-11.58-23.16c-2.709-5.42-8.25-8.844-14.31-8.844H153.9c-6.061 0-11.6 3.424-14.31 8.844L128 32H16c-8.836 0-16 7.162-16 16V80c0 8.836 7.164 16 16 16h416c8.838 0 16-7.164 16-16V48C448 39.16 440.8 32 432 32z" /></svg>
                    </button>
                    <button onClick={toggleFavorite} className={`${workspace.favorite ? "bg-amber-200" : "bg-slate-400"} w-8 h-8 rounded-sm transition-all`}>
                        <svg className={`mx-auto w-5 h-5 ${workspace.favorite ? "fill-amber-500" : "fill-slate-600"} lg:hover:fill-amber-500`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 10.132v-6c0-1.103-.897-2-2-2H7c-1.103 0-2 .897-2 2V22l7-4.666L19 22V10.132z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PlanCard