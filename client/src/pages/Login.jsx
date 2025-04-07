import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { phase2IP } from "../../helpers/http-client";
import { useNavigate } from "react-router";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const postLogin = async () => {
        try {
            const { data } = await phase2IP.post(`/login`, {
                username,
                password
            });
            localStorage.setItem('bearer_token', 'Bearer ' + data.token);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    async function handleCredentialResponse(response) {
        try {
            console.log('response :', response);
            console.log('start handle credential response');
            const { data } = await phase2IP.post(`/google-login`, {
                googleToken: response.credential
            });
            console.log('turn data into bearer token');
            localStorage.setItem('bearer_token', 'Bearer ' + data.token);
            console.log('login complete');
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        // window.onload = function () {
            google.accounts.id.initialize({
              client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
              callback: handleCredentialResponse
            });
            google.accounts.id.renderButton(
              document.getElementById("google-btn"),
              { theme: "outline", size: "large" }  // customization attributes
            );
            // google.accounts.id.prompt(); // also display the One Tap dialog
        //   }
    }, []);

    return (
        <>
            <section className="vh-100">
                <div className="container-fluid h-custom">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-9 col-lg-6 col-xl-5 mt-5 rounded">
                            <img
                                src="https://nnc-media.netralnews.com/IMG-Netral-News-User-6919-MGENK7LCVQ.jpg"
                                className="img-fluid"
                                alt="Sample image"
                            />
                        </div>
                        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                            <form>
                                <h2 className="fw-bold mb-3 pb-3">Login</h2>
                                <div className="form-outline mb-4">
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        className="form-control form-control-lg"
                                        placeholder="Enter a valid email address"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="form-outline mb-3">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-control form-control-lg"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="text-center text-lg-start mt-4 pt-2">
                                    <p className="small fw-bold mt-2 pt-1 mb-0">
                                        Don't have an account?{" "}
                                        <a onClick={() => navigate('/register')} className="link-danger">
                                            Register
                                        </a>
                                    </p>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg"
                                        style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                                        onClick={postLogin}
                                    >
                                        Login
                                    </button>
                                    <br />
                                    <p className="small fw-bolder mt-2 pt-1 mb-0">
                                        Or sign in with:
                                    </p>
                                        {/* <button className="btn btn-lg btn-primary" style={{ backgroundColor: "#dd4b39" }} type="button" > */}
                                        {/* </button> */}
                                    <div id="google-btn">
                                            Sign in with Google
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}