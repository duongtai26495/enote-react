import React, { useEffect } from 'react'

const Pagination = ({currentPage, firstPage, maxPage, setCurrentPage, setPage, className}) => {

    const current_page = currentPage === 0 ? currentPage = 1 : currentPage

  return (
    <div className={`mx-auto w-1/3 lg:w-full flex-row ${className}`}>
                <p className='text-sm w-full lg:w-1/5 text-center flex flex-row items-center justify-between'>
                    <span className={`cursor-pointer pagingation-num transition-all ${current_page === 1 ? 'fill-slate-300 cursor-default' : 'fill-slate-700'}`} onClick={() => setPage("PREV")}>
                        <svg className='rotate-180' height="20" id="Layer_1" viewBox="0 0 200 200" width="20" xmlns="http://www.w3.org/2000/svg"><title /><path d="M132.72,78.75l-56.5-56.5a9.67,9.67,0,0,0-14,0,9.67,9.67,0,0,0,0,14l56.5,56.5a9.67,9.67,0,0,1,0,14l-57,57a9.9,9.9,0,0,0,14,14l56.5-56.5C144.22,109.25,144.22,90.25,132.72,78.75Z" /></svg>
                    </span>

                    <span className={`first-page w-5 h-5 pagingation-num text-center cursor-pointer transition-all ${current_page === 1 ? "page-active" : ''}`} onClick={() => setCurrentPage(1)}>{firstPage}</span>

                    <span className={`${maxPage > 2 ? "flex" : "hidden"} first-page-next transition-all w-5 h-5 pagingation-num text-center cursor-pointer ${currentPage === firstPage + 1 && "page-active"}`}
                        onClick={() => setPage("NEXT")}>{firstPage + 1}</span>

                    <span className={`${maxPage > 5 ? "flex" : "hidden"} `}>...</span>

                    <span className={`${maxPage > 3 ? "flex" : "hidden"} last-page-previous transition-all w-5 h-5 pagingation-num text-center cursor-pointer ${currentPage === maxPage - 1 ? "page-active" : ""}`}
                        onClick={() => setCurrentPage(maxPage-1)}>{maxPage-1}</span>

                    <span className={`last-page w-5 h-5 pagingation-num text-center cursor-pointer transition-all ${firstPage < maxPage ? "block" : "hidden"} ${currentPage === maxPage ? "page-active" : ""}`} onClick={() => setCurrentPage(maxPage)}>{maxPage}</span>

                    <span className={`cursor-pointer pagingation-num transition-all  ${currentPage === maxPage ? 'fill-slate-300 cursor-default' : 'fill-slate-700'}`} onClick={() => setPage("NEXT")}>
                        <svg className='' height="20" id="Layer_1" viewBox="0 0 200 200" width="20" xmlns="http://www.w3.org/2000/svg"><title /><path d="M132.72,78.75l-56.5-56.5a9.67,9.67,0,0,0-14,0,9.67,9.67,0,0,0,0,14l56.5,56.5a9.67,9.67,0,0,1,0,14l-57,57a9.9,9.9,0,0,0,14,14l56.5-56.5C144.22,109.25,144.22,90.25,132.72,78.75Z" /></svg>
                    </span>
                </p>
            </div>
  )
}

export default React.memo(Pagination)