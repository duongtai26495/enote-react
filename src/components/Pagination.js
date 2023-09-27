import React from 'react'

const Pagination = ({currentPage, firstPage, maxPage, setCurrentPage, setPage, className}) => {


  return (
    <div className={`mx-auto w-1/3 lg:w-full flex-row ${className}`}>
                <p className='text-sm w-full lg:w-1/5 text-center flex flex-row items-center justify-between'>
                    <span className={`cursor-pointer pagingation-num transition-all ${currentPage === firstPage && 'fill-slate-200'}`} onClick={() => setPage("PREV")}>
                        <svg className='rotate-180' height="20" id="Layer_1" viewBox="0 0 200 200" width="20" xmlns="http://www.w3.org/2000/svg"><title /><path d="M132.72,78.75l-56.5-56.5a9.67,9.67,0,0,0-14,0,9.67,9.67,0,0,0,0,14l56.5,56.5a9.67,9.67,0,0,1,0,14l-57,57a9.9,9.9,0,0,0,14,14l56.5-56.5C144.22,109.25,144.22,90.25,132.72,78.75Z" /></svg>
                    </span>

                    <span className={`w-5 h-5 pagingation-num text-center cursor-pointer transition-all ${currentPage === 1 ? "page-active" : 'pagingation-num '}`} onClick={() => setCurrentPage(1)}>1</span>

                    <span className={`${maxPage > 2 ? "flex" : "hidden"} transition-all w-5 h-5 pagingation-num text-center cursor-pointer ${currentPage === firstPage + 1 && "page-active"}`}
                        onClick={() => setPage("NEXT")}>{firstPage + 1}</span>

                    <span className={`${maxPage > 5 ? "flex" : "hidden"} `}>...</span>

                    <span className={`${maxPage > 3 ? "flex" : "hidden"} transition-all w-5 h-5 pagingation-num text-center cursor-pointer ${currentPage === maxPage - 1 && "page-active"}`}
                        onClick={() => setCurrentPage(maxPage - 1)}>{maxPage - 1}</span>

                    <span className={`w-5 h-5 pagingation-num text-center cursor-pointer transition-all ${firstPage === maxPage && "hidden"} ${currentPage === maxPage && "page-active"}`} onClick={() => setCurrentPage(maxPage)}>{maxPage}</span>

                    <span className={`cursor-pointer transition-all  ${currentPage === maxPage ? 'fill-slate-200' : 'pagingation-num '}`} onClick={() => setPage("NEXT")}>
                        <svg className='' height="20" id="Layer_1" viewBox="0 0 200 200" width="20" xmlns="http://www.w3.org/2000/svg"><title /><path d="M132.72,78.75l-56.5-56.5a9.67,9.67,0,0,0-14,0,9.67,9.67,0,0,0,0,14l56.5,56.5a9.67,9.67,0,0,1,0,14l-57,57a9.9,9.9,0,0,0,14,14l56.5-56.5C144.22,109.25,144.22,90.25,132.72,78.75Z" /></svg>
                    </span>
                </p>
            </div>
  )
}

export default Pagination