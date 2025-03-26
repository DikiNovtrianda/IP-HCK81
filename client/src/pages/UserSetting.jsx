export default function UserSetting() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [preferedCategory, setPreferedCategory] = useState('')
    const [hatedCategory, setHatedCategory] = useState('')

    return (
        <>
            <div className="container h-custom">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-12">
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
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
        </>
    )
}