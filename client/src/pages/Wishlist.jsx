import { useEffect, useState } from "react"
import { phase2IP } from "../../helpers/http-client"
import { useNavigate } from "react-router"

export default function Wishlist() {
    const [allWishlist, setAllWishlist] = useState([])
    const [wishlist, setWishlist] = useState([])
    const [bought, setBought] = useState([])
    const navigate = useNavigate()

    const getWishlist = async () => {
        try {
            const {data} = await phase2IP.get(`/wishlist`, {
                headers: {
                    Authorization: localStorage.getItem('bearer_token')
                }
            });
            setAllWishlist(data);
        } catch (error) {
            console.log(error);
        }
    }

    const divideWishes = () => {
        let wish = [];
        let bought = [];
        allWishlist.map((game) => {
            if (game.status === 'Wishlist') {
                wish.push(game);
            } else {
                bought.push(game);
            }
        })
        setWishlist(wish);
        setBought(bought);
    }

    const wishlistItem = () => {
        let wishCard = [];
        wishlist.map((game, i) => {
            wishCard.push(
                <tr key={i}>
                    <td>{i+1}</td>
                    <td>{game.Game.name}</td>
                    <td>{game.status}</td>
                    <td>
                        <button className="btn btn-primary mx-1" onClick={() => navigate(`/game/${game.gameId}`)}>Go to games</button>
                        <button className="btn btn-success mx-1" onClick={() => boughtGames(game.gameId)}>I bought it!</button>
                        <button className="btn btn-danger mx-1" onClick={() => eraseWishlist(game.gameId)}>Erase</button>
                    </td>
                </tr>
            )
        })
        return wishCard;
    }

    const boughtItem = () => {
        let boughtCard = [];
        bought.map((game, i) => {
            boughtCard.push(
                <tr key={i}>
                    <td>{i+1}</td>
                    <td>{game.Game.name}</td>
                    <td>{game.status}</td>
                    <td>{game.rating}</td>
                    <td>{game.comment}</td>
                    <td>
                        <button className="btn btn-primary mx-1" onClick={() => navigate(`/game/${game.gameId}`)}>Go to games</button>
                        <button className="btn btn-danger mx-1" onClick={() => eraseWishlist(game.gameId)}>Erase</button>
                    </td>
                </tr>
            )
        })
        return boughtCard;
    }

    const showWishlist = () => {
        if (wishlist.length > 0) {
            return (
                <>
                    <h3 className="my-5">Wishlist games</h3>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Game</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wishlistItem()}
                        </tbody>
                    </table>
                </>
            )
        } else {
            return (
                <>
                    <h3 className="my-5">No wishlisted games yet</h3>
                </>
            )
        }
    }

    const showBought = () => {
        if (bought.length > 0) {
            return (
                <>
                    <h3 className="mt-5">Bought games</h3>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Game</th>
                                <th>Status</th>
                                <th>Rating</th>
                                <th>Comment</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {boughtItem()}
                        </tbody>
                    </table>
                </>
            )
        } else {
            return (
                <>
                    <h3 className="my-5">No bought games yet</h3>
                </>
            )
        }
    }

    const showAllWishlist = () => {
        if (wishlist.length > 0 || bought.length > 0) {
            return (
                <>
                    {showWishlist()}
                    {showBought()}
                </>
            )
        } else {
            return (
                <>
                    <h3 className="my-5">Nothing to show here...</h3>
                    <h4 className="my-5">Start adding list by wishlisting items</h4>
                </>
            )
        }
    }

    const eraseWishlist = async (gameId) => {
        try {
            await phase2IP.delete(`/games/${gameId}/wishlist`, {
                headers: {
                    Authorization: localStorage.getItem('bearer_token')
                }
            });
            getWishlist();
        } catch (error) {
            console.log(error);
        }
    }

    const boughtGames = async (gameId) => {
        try {
            await phase2IP.patch(`/wishlist/${gameId}/bought`, {}, {
                headers: {
                    Authorization: localStorage.getItem('bearer_token')
                }
            });
            getWishlist();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getWishlist()
    }, [])

    useEffect(() => {
        divideWishes()
    }, [allWishlist])

    return (
        <>
            <div className="container">
                <div className="row text-center">
                    {showAllWishlist()}
                </div>
            </div>
        </>
    )
}