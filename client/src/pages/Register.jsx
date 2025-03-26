import { useState } from "react";
import { phase2IP } from "../../helpers/http-client";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const postRegister = async () => {
        try {
            const {data} = await phase2IP.post(`/register`, {
                username: username,
                password: password,
                email: email
            });
            console.log(data);
            
            navigate('/login');
            
            // localStorage.setItem('bearer_token', data.token);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <section className="vh-100">
                <div className="container-fluid h-custom">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-9 col-lg-6 col-xl-5 mt-5 rounded">
                            <img
                                src="https://media.wired.com/photos/5ba2ba6b2d096346a42d32e0/master/w_2560%2Cc_limit/D2_Forsaken_Gamescom_Super_TitanHammer_01.jpg"
                                className="img-fluid rounded"
                                alt="Sample image"
                            />
                        </div>
                        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                            <form>
                                <h2 className="fw-bold mb-3 pb-3">Register</h2>
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
                                <div className="form-outline mb-4">
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
                                <div className="form-outline mb-4">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-control form-control-lg"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="text-center text-lg-start mt-4 pt-2">
                                    <p className="small fw-bold mt-2 pt-1 mb-0">
                                        Already have an account?{" "}
                                        <a onClick={() => navigate('/login')} className="link-primary">
                                            Login
                                        </a>
                                    </p>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg"
                                        style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                                        onClick={postRegister}
                                    >
                                        Register
                                    </button>
                                    <br />
                                    <p className="small fw-bolder mt-2 pt-1 mb-0">
                                        Or sign in with:
                                    </p>
                                    <button
                                        className="btn btn-lg btn-block btn-primary"
                                        style={{ backgroundColor: "#dd4b39" }}
                                        type="button"
                                    >
                                        <i className="fab fa-google me-2" /> Sign in with Google
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}