import { Navigate, Outlet } from "react-router";

export default function AuthenticationLayout() {
    if (localStorage.getItem('bearer_token')) {
        return (
            <>
                <Outlet />
            </>
        )
    }
    return (
        <>
            <Navigate to="/login" />
        </>
    )
}