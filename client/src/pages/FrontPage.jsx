import { useEffect, useState } from "react"
import { phase2IP } from "../../helpers/http-client"
import GameCard from "../components/gameCard"
import PageButton from "../components/PageButton"
import Navbar from "../components/navbar"

export default function FrontPage() {
    const [games, setGames] = useState([])
    const [htmlPages, setHtmlPages] = useState([]);
    const [search, setSearch] = useState("")
    const [pages, setPages] = useState(1)
    const [limit, setLimit] = useState(0)
    const [length, setLength] = useState(0)
    const [count, setCount] = useState(0)

    const getGameData = async () => {
        try {
            const {data} = await phase2IP.get('/public/games', {
                params: {
                    page: pages,
                    search: search  
                }
            })
            setGames(data.rows)
            setCount(data.count)
            setLimit(data.limit)
            setLength(data.length)
        } catch (error) {
            console.log(error);
        }
    }

    const showPages = () => {
        let pageArray = []
        for (let i = 1; i <= Math.ceil(count / limit); i++) {
            pageArray.push(<PageButton key={i} pageNumber={i} currentPage={pages} setPages={setPages}/>)
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
        setPages(1);
        getGameData();
    }, [search])

    useEffect(() => {
        getGameData();
    }, [pages])
    
    useEffect(() => {
        showPages();
    }, [games])

    return (
        <>
            <div className="jumbotron text-center py-5">
                <h1>Welcome to Gameskuuy</h1>
                <p>Selamat mencari permainan yang anda sukai!</p>
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
                        onChange={(e) => setSearch(e.target.value)}
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
            </div>
        </>
    )
}