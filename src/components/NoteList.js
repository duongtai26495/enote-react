import Cookies from 'js-cookie'
import React, { memo, useEffect, useMemo, useState, useRef } from 'react'
import { SELECTED_SORT, SORT_ITEMS, ACCESS_TOKEN, CURRENT_WS, CURRENT_NOTE_PAGE } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import NoteItem from './NoteItem'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import EmptyList from './EmptyList'
import Pagination from './Pagination'

const NoteList = ({ id }) => {

    const [noteList, setNoteList] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const firstPage = 1
    const token = Cookies.get(ACCESS_TOKEN)
    const isMounted = useRef(false);
    const [sortValues, setSortValues] = useState(JSON.parse(localStorage.getItem(SORT_ITEMS)))
    const [selectedSort, setSelectedSort] = useState(JSON.parse(localStorage.getItem(SELECTED_SORT)) ?? "updated_at_desc")

    const getAllNoteByWs = async () => {
        if (checkToken(token) && id > 0) {
            try {
                let page = Number(currentPage) - 1
                let url = `workspace/get/${id}?page=${page}&size=12&sort=${selectedSort}`
                const result = await fetchApiData(url, token)
                if (result && result.status !== 403) {
                    setMaxPage(result.totalPages)
                    const data = result.content
                    setNoteList(data)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }



    const removeNote = async (note) => {
        if (note.tasks == null || note.tasks?.length < 1) {
            await fetchApiData(`note/remove/${note.id}`, token, "DELETE")
            const updatedItems = noteList.filter(item => item.id !== note.id);
            setNoteList(updatedItems);
        }
    }
    const RenderNote = React.memo(() => {
        return (
            <ResponsiveMasonry className='h-fit masonry-wrapper' columnsCountBreakPoints={{ 350: 2, 767: 3, 960: 3 }}>
                <Masonry>
                    {
                        noteList?.map((item, index) => (
                            <NoteItem removeNote={removeNote} note={item} key={item.id} subclass={``} />
                        ))
                    }
                </Masonry>
            </ResponsiveMasonry>
        )
    })

    const setPage = (TYPE) => {
        switch (TYPE) {
            case "PREV":
                if (currentPage > 1) {
                    let current = Number(currentPage) - 1
                    setCurrentPage(current)
                    localStorage.setItem(CURRENT_NOTE_PAGE, current)
                }
                break;
            case "NEXT":
                if (currentPage < maxPage) {
                    let current = Number(currentPage) + 1
                    setCurrentPage(current)
                    localStorage.setItem(CURRENT_NOTE_PAGE, current)
                }
                break;
        }
    }

    const addNewNote = async () => {
        if (id) {
            const token = Cookies.get(ACCESS_TOKEN)
            if (token !== null && checkToken(token)) {
                const newNote = {}
                newNote.workspace = { id }
                newNote.name = "Unnamed note"
                try {
                    const result = await fetchApiData(`note/add`, token, "POST", newNote)

                    const data = result.content
                    const newList = [data, ...noteList]
                    setNoteList(newList)
                    await getAllNoteByWs()
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }


    useEffect(() => {
        getAllNoteByWs()
    }, [id, currentPage, selectedSort])

    const sortHandle = (value) => {
        setSelectedSort(value.target.value)
        localStorage.setItem(SELECTED_SORT, JSON.stringify(value.target.value))
    }

    const RenderSort = () => {
        return (
            <select className='w-1/2 lg:w-fit bg-white border p-1 rounded-md text-sm' name='sort_note' id='sort_note'
                value={selectedSort} onChange={(e) => sortHandle(e)}>
                {sortValues?.map((item, index) => {
                    const keys = Object.keys(item)[0]; // Lấy key (chỉ có 1 key trong mỗi đối tượng)
                    const value = item[keys]; // Lấy giá trị

                    return (
                        <option key={index} value={value}>{keys}</option>
                    );
                })}

            </select>
        )
    }

    return (
        <>
            <div className={`w-full p-2 gap-2 flex flex-row items-center justify-between bg-slate-100 h-fit`}>
                <span onClick={() => { addNewNote() }}
                    className={`cursor-pointer button_style-1 whitespace-nowrap lg:hover:bg-slate-200 w-1/3 lg:w-fit h-fit font-bold px-2 text-center rounded-md p-1  bg-white text-black transition-all text-sm`}>
                    Add note
                </span>
                <RenderSort />

            </div>
            {
                noteList.length > 0 ?
                    <>
                        <RenderNote />
                        <Pagination
                            className={`${noteList.length > 0 ? "flex" : "hidden"} overflow-hidden justify-center my-5 `}
                            currentPage={currentPage}
                            maxPage={maxPage}
                            firstPage={firstPage}
                            setCurrentPage={setCurrentPage}
                            setPage={setPage}
                        />
                    </>
                    :
                    <EmptyList />
            }
        </>
    )
}

export default React.memo(NoteList)