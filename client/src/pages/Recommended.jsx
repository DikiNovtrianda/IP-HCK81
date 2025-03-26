import { useEffect, useState } from "react"
import { phase2IP } from "../../helpers/http-client"
import GameCard from "../components/gameCard"

export default function Recommended() {
    const [games, setGames] = useState([])
    const [comment, setComment] = useState('')

    const callsAIRecommendation = async () => {
        try {
            let genre = 'action'
            let degenre = 'ghost'
            const { data } = await phase2IP.post(`/recommendation`, {
                genre,
                degenre
            });
            setGames(data.games)
            setComment(data.comment)
        } catch (error) {
            console.log(error)
        }
    }

    const showGames = () => {
        if (games.length === 0) {
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
        callsAIRecommendation()
    }, [])

    return (
        <>
            <div className="container text-center py-5">
                <h3>Berikut kata AI :</h3>
                <p className="p-3 border rounded" style={{ backgroundColor: `#e9edc9` }}>{comment}</p>
            </div>
            <div className="container">
                <div className="row text-center">
                    <h3>Rekomendasi :</h3>
                    {showGames()}
                </div>
            </div>
        </>
    )
}