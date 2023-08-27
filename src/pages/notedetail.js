import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { access_token, baseURL } from '../utils/constants';
import { checkToken, fetchApiData, getTheTime } from '../utils/functions';
import Cookies from 'js-cookie';

const NoteDetail = () => {

    let { id } = useParams();
    const token = Cookies.get(access_token)
    const [item, setItem] = useState({})

    useEffect(() => {
        const getNoteDetail = async () => {
            if (checkToken(token)) {
                const result = await fetchApiData(`note/get/` + id, token)
                if (result.status === "SUCCESS") {
                    const data = result.content
                    setItem(data)
                }
            }
        }
        getNoteDetail()
    }, [])


    return (
        <div className='w-full'>
            <div className='w-full flex flex-row gap-2'>
                <div className='w-full flex flex-col'>
                    <h1 className='text-bold text-2xl'>
                        {item.name}
                    </h1>
                    <span className={`h-5 text-xs text-slate-400 italic`}>{item.updated_at && getTheTime(item.updated_at)}</span>
                </div>
                <div className='w-full h-fit'>

                </div>
            </div>

        </div>
    )
}

export default NoteDetail