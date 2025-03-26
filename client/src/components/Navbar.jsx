import { useNavigate } from "react-router";
import Logout from "./Logout"

export default function Navbar() {
    const navigate = useNavigate();
    const switchNavbar = () => {
        if (localStorage.getItem('bearer_token')) {
            return (
                <>
                    <li className="nav-item">
                        <a onClick={() => navigate('/wishlist')} className="nav-link text-white bg-gradient btn btn-lg">Wishlist</a>
                    </li>
                    <Logout />
                </>
            )
        }
        return (
            <li className="nav-item">
                <a onClick={() => navigate('/login')} className="nav-link text-white bg-gradient btn btn-lg">Login</a>
            </li>
        )
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                <a className="navbar-brand" href="#" onClick={() => navigate('/')}>
                    Gameskuuy
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                    { switchNavbar() }
                    </ul>
                </div>
                </div>
            </nav>
        </>
    )
}