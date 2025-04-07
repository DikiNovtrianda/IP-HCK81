import { useEffect, useState } from "react"
import { phase2IP } from "../../helpers/http-client"
import { useNavigate } from "react-router"

export default function UserSetting() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [preferedCategory, setPreferedCategory] = useState('')
    const [hatedCategory, setHatedCategory] = useState('')
    const navigate = useNavigate();

    const callUserData = async () => {
        try {
            const { data } = await phase2IP.get(`/user/detail`, {
                headers: {
                    Authorization: localStorage.getItem('bearer_token')
                }
            })
            setUsername(data.username)
            setEmail(data.email)
            setPreferedCategory(data.preferedCategory)
            setHatedCategory(data.hatedCategory)
        } catch (error) {
            console.log(error)
        }
    }

    const postEditUser = async () => {
        try {
            const { data } = await phase2IP.post(`/user/addPreferences`, {
                preferedCategory,
                hatedCategory
            }, {
                headers: {
                    Authorization: localStorage.getItem('bearer_token')
                }
            })
            console.log(data.message)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteUser = async () => {
        try {
            await phase2IP.delete(`/user/delete`, {
                headers: {
                    Authorization: localStorage.getItem('bearer_token')
                }
            })
            localStorage.removeItem('bearer_token');
            navigate('/login');
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        callUserData()
    }, [])

    return (
        <>
            <div className="container h-custom border rounded-3 py-5 mt-5">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-12">
                        <form>
                            <h2 className="fw-bold mb-3 pb-3">Login</h2>
                            <label htmlFor="username" className="form-label">
                                Username
                            </label>
                            <div className="form-outline mb-4">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="form-control form-control-lg"
                                    disabled
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <label htmlFor="username" className="form-label">
                                Email
                            </label>
                            <div className="form-outline mb-4">
                                <input
                                    type="email"
                                    id="username"
                                    name="username"
                                    className="form-control form-control-lg"
                                    disabled
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <label htmlFor="username" className="form-label">
                                Jenis permainan yang anda sukai :
                            </label>
                            <div className="form-outline mb-4">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="form-control form-control-lg"
                                    placeholder="Tulis jenis permainan yang anda sukai"
                                    value={preferedCategory}
                                    onChange={(e) => setPreferedCategory(e.target.value)}
                                />
                            </div>
                            <label htmlFor="username" className="form-label">
                                Jenis permainan yang anda kurang sukai :
                            </label>
                            <div className="form-outline mb-4">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="form-control form-control-lg"
                                    placeholder="Tulis jenis permainan yang anda kurang sukai"
                                    value={hatedCategory}
                                    onChange={(e) => setHatedCategory(e.target.value)}
                                />
                            </div>
                            <div className="text-center text-lg-start my-4 pt-2">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-lg"
                                    style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                                    onClick={postEditUser}
                                >
                                    Simpan
                                </button>
                            </div>
                            <div className="text-center text-lg-start mt-4 pt-2">
                                <p className="small fw-bold mt-2 pt-1 mb-0">atau mau berhenti?</p>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-lg"
                                    style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                                    onClick={deleteUser}
                                >
                                    Hapus akun
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}