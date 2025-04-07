import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux";
// import { phase2IP } from "../../helpers/http-client"
import GameCard from "../components/gameCard"
import PageButton from "../components/PageButton"
import { fetchGames, setSearch } from "../features/game/gameSlice";
import { useNavigate } from "react-router";

export default function FrontPage() {
    const games = useSelector((state) => state.game.list.games);
    const pages = useSelector((state) => state.game.list.pages);
    const search = useSelector((state) => state.game.list.search);
    const count = useSelector((state) => state.game.list.count);
    const limit = useSelector((state) => state.game.list.limit);
    const dispatch = useDispatch()
    const [htmlPages, setHtmlPages] = useState([]);
    const navigate = useNavigate();

    const showPages = () => {
        let pageArray = []
        const lastPage = Math.ceil(count / limit);
        const minPageButton = pages - 2 < 1 ? 1 : pages - 2;
        const maxPageButton = pages + 2 > lastPage ? lastPage : pages + 2;
        if (minPageButton > 1) {
            pageArray.push(<PageButton key={1} pageNumber={1} currentPage={pages}/>)
            pageArray.push(
                <div className="col-md-1 mb-3 px-4 text-center d-flex align-items-end pt-3">
                    <span key="last" className="w-100 h-100">...</span>
                </div>
            )
        }
        for (let i = minPageButton; i <= maxPageButton; i++) {
            pageArray.push(<PageButton key={i} pageNumber={i} currentPage={pages}/>)
        }
        if (maxPageButton < lastPage) {
            pageArray.push(
                <div className="col-md-1 mb-3 px-4 text-center d-flex align-items-end pt-3">
                    <span key="last" className="w-100 h-100">...</span>
                </div>
            )
            pageArray.push(<PageButton key={lastPage} pageNumber={ lastPage} currentPage={pages}/>)
        }
        setHtmlPages(pageArray);
    }

    const showGames = () => {
        if (Math.ceil(count / limit) === 0) {
            return (
                <div className="row mt-5">
                    <h3 className="text-center">Games tidak ditemukan</h3>
                </div>
            )
        } else {
            return (
                <div className="row">
                    {games.map((data) => {
                        return (<GameCard key={data.id} data={data} />)
                    })}
                </div>
            )
        }
    }

    useEffect(() => {
        dispatch(fetchGames({ pages, search }))
    }, [pages, search])
    
    useEffect(() => {
        showPages();
    }, [games])

    return (
        <>
            <div className="jumbotron text-center py-5">
                <h1>Welcome to Gameskuuy</h1>
                <p>Selamat mencari permainan yang anda sukai!</p>
                <p>Atau jika anda bingung, anda bisa bertanya langsung kepada AI <br /><button className="btn btn-outline-dark px-5 mt-3" onClick={() => navigate('/games/recommended')}>disini!</button></p>
            </div>
            <hr />
            <div className="container mt-4">
                <form className="row">
                    <div className="col-md-12 mb-3">
                        <input
                        type="text"
                        className="form-control h-100"
                        id="search"
                        placeholder="Cari dengan nama..."
                        value={search}
                        onChange={(e) => dispatch(setSearch(e.target.value))}
                        />
                    </div>
                </form>
                <div className="row">
                    {showGames()}
                </div>
                <hr />
                <div className="row justify-content-center">
                    {htmlPages}
                </div>
                <hr />
                <div className="row mt-5">
                    <p className="text-center text-body-tertiary" style={{ marginTop: 100 }}>*Created by <span className="text-dark">Diki Novtrianda</span> for Individual Project*</p>
                </div>
            </div>
        </>
    )
}