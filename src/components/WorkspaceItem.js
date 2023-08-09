import Cookies from 'js-cookie'
import React, { useEffect, useRef, useState } from 'react'
import { access_token, currentWs } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'

const WorkspaceItem = ({ wsItem, editState, setUpdateWs }) => {
    const [newNameWs, setNewNameWs] = useState(wsItem.name)
    const [currentWssItem, setCurrentWsItem] = useState(wsItem)

    const updateWsName = async () => {
        const token = Cookies.get(access_token)
        if (token !== null && checkToken(token)) {
            let newWs = currentWssItem
            newWs.name = newNameWs
            try {
                const resultUpdate = await fetchApiData(`workspace/update`, token, "PUT", newWs)
                if (resultUpdate.status === "SUCCESS") {
                    setCurrentWsItem(resultUpdate.content)
                    setUpdateWs(false)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (

        (editState && Number(localStorage.getItem(currentWs)) === currentWssItem.id)
            ?
            <input
                onBlur={() => { updateWsName() }}
                autoFocus
                className='m-w-fit ws-item bg-transparent px-2 py-1'
                type='text'
                defaultValue={newNameWs}
                onChange={(e) => { setNewNameWs(e.target.value) }} />
            :
            <span className='w-fit ws-item bg-transparent px-2 py-1'>
                {currentWssItem.name}
            </span>
    )
}

export default WorkspaceItem