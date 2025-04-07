import { Navigate, Outlet } from "react-router";

export default function AuthorizationLayout() {
    if (localStorage.getItem('bearer_token')) {
        return (
            <>
                <Navigate to="/login" />
            </>
        )
    }
    return (
        <>
            <Outlet />
        </>
    )
}