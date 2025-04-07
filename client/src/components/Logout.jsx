import { useNavigate } from "react-router";

export default function Logout() {
    const navigate = useNavigate();

    const logoutUser = () => {
        localStorage.removeItem('bearer_token');
        navigate('/login');
    }
    
    return (
        <>
            <li className="nav-item">
                <a onClick={() => logoutUser()} className="nav-link text-danger bg-gradient btn btn-lg ms-4">Logout</a>
            </li>
        </>
    )
}