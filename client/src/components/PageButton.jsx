import { useDispatch } from "react-redux";
import { setPages } from "../features/game/gameSlice";

export default function PageButton({pageNumber, currentPage}) {
    const dispatch = useDispatch();
    return (
        <div className="col-md-1 mb-3 px-4">
            <button className={`btn btn-${pageNumber === currentPage ? 'primary' : 'warning'} btn-lg btn-block w-100`} onClick={() => dispatch(setPages(pageNumber))}>
                {pageNumber}
            </button>
        </div>
    )
}