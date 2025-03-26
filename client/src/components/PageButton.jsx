export default function PageButton({pageNumber, currentPage, setPages}) {
    return (
        <div className="col-md-1 mb-3 px-4">
            <button className={`btn btn-${pageNumber === currentPage ? 'primary' : 'warning'} btn-lg btn-block w-100`} onClick={() => setPages(pageNumber)}>
                {pageNumber}
            </button>
        </div>
    )
}