import Cookies from 'js-cookie'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { SELECTED_SORT, SORT_ITEMS, access_token, currentWs } from '../utils/constants'
import { checkToken, fetchApiData } from '../utils/functions'
import NoteItem from './NoteItem'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import EmptyList from './EmptyList'

const NoteList = ({ id }) => {

    const [noteList, setNoteList] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const firstPage = 1
    const token = Cookies.get(access_token)
    const [sortValues, setSortValues] = useState(JSON.parse(localStorage.getItem(SORT_ITEMS)))
    const [selectedSort, setSelectedSort] = useState(JSON.parse(localStorage.getItem(SELECTED_SORT)) ?? "updated_at_desc")
    const getAllNoteByWs = async () => {
        if (checkToken(token) && id > 0) {
            try {
                let page = Number(currentPage) - 1
                let url = `workspace/get/${id}?page=${page + ""}&size=20&sort=${selectedSort}`
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
            <ResponsiveMasonry className='min-h-screen masonry-wrapper' columnsCountBreakPoints={{ 350: 2, 767: 3, 960: 3 }}>
                <Masonry>
                    {
                        noteList?.map((item, index) => (
                            <NoteItem removeNote={removeNote} note={item} key={item.id} subclass={``}/>
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
                    localStorage.setItem("currentPage", current)
                }
                break;
            case "NEXT":
                if (currentPage < maxPage) {
                    let current = Number(currentPage) + 1
                    setCurrentPage(current)
                    localStorage.setItem("currentPage", current)
                }
                break;
        }
    }

    const addNewNote = async () => {
        const token = Cookies.get(access_token)
        if (token !== null && checkToken(token) && id) {
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

    useEffect(() => {
        getAllNoteByWs()
    }, [id, currentPage, selectedSort])

    const sortHandle = (value) => {
        setSelectedSort(value.target.value)
        localStorage.setItem(SELECTED_SORT, JSON.stringify(value.target.value))
    }

    const RenderSort = () => {
        return (
            <select className='w-1/3 lg:w-fit bg-white border p-1 rounded-md text-sm' name='sort_note' id='sort_note' 
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


    const Pagination = () => {
        return (
            <div className='w-1/3 lg:w-full flex flex-row justify-end'>
                <p className='text-sm w-full lg:w-1/5 text-center flex flex-row items-center justify-between'>
                    <span className={`cursor-pointer pagingation-num transition-all ${currentPage === firstPage && 'fill-slate-300'}`} onClick={() => setPage("PREV")}>
                        <svg className='rotate-180' height="20" id="Layer_1" viewBox="0 0 200 200" width="20" xmlns="http://www.w3.org/2000/svg"><title /><path d="M132.72,78.75l-56.5-56.5a9.67,9.67,0,0,0-14,0,9.67,9.67,0,0,0,0,14l56.5,56.5a9.67,9.67,0,0,1,0,14l-57,57a9.9,9.9,0,0,0,14,14l56.5-56.5C144.22,109.25,144.22,90.25,132.72,78.75Z" /></svg>
                    </span>

                    <span className={`w-5 h-5 pagingation-num text-center cursor-pointer transition-all ${currentPage === 1 ? "page-active" : 'pagingation-num '}`} onClick={() => setCurrentPage(1)}>1</span>

                    <span className={`${maxPage > 2 ? "flex" : "hidden"} transition-all w-5 h-5 pagingation-num text-center cursor-pointer ${currentPage === firstPage + 1 && "page-active"}`}
                        onClick={() => setPage("NEXT")}>{firstPage + 1}</span>

                    <span className={`${maxPage > 5 ? "flex" : "hidden"} `}>...</span>

                    <span className={`${maxPage > 3 ? "flex" : "hidden"} transition-all w-5 h-5 pagingation-num text-center cursor-pointer ${currentPage === maxPage - 1 && "page-active"}`}
                        onClick={() => setCurrentPage(maxPage - 1)}>{maxPage - 1}</span>

                    <span className={`w-5 h-5 pagingation-num text-center cursor-pointer transition-all ${firstPage === maxPage && "hidden"} ${currentPage === maxPage && "page-active"}`} onClick={() => setCurrentPage(maxPage)}>{maxPage}</span>

                    <span className={`cursor-pointer transition-all  ${currentPage === maxPage ? 'fill-slate-300' : 'pagingation-num '}`} onClick={() => setPage("NEXT")}>
                        <svg className='' height="20" id="Layer_1" viewBox="0 0 200 200" width="20" xmlns="http://www.w3.org/2000/svg"><title /><path d="M132.72,78.75l-56.5-56.5a9.67,9.67,0,0,0-14,0,9.67,9.67,0,0,0,0,14l56.5,56.5a9.67,9.67,0,0,1,0,14l-57,57a9.9,9.9,0,0,0,14,14l56.5-56.5C144.22,109.25,144.22,90.25,132.72,78.75Z" /></svg>
                    </span>
                </p>
            </div>
        )
    }

    return (
        <>
            <div className={`w-full p-2 gap-2 flex flex-row items-center justify-between bg-slate-100 h-fit`}>
                <span onClick={() => { addNewNote() }}
                    className={`cursor-pointer button_style-1 whitespace-nowrap lg:hover:bg-slate-200 w-1/3 lg:w-fit h-fit font-bold px-2 text-center rounded-lg p-1  bg-white text-black transition-all text-sm`}>
                    Add note
                </span>
                <RenderSort />
                <Pagination />
            </div>
            {
                noteList.length > 0 ?
                    <RenderNote />
                    :
                    <EmptyList />
            }
        </>
    )
}

export default React.memo(NoteList)