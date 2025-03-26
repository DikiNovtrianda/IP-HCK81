import { useNavigate } from "react-router"

export default function GameCard({ data }) {
    const showGenre = (data) => {
        if (data.genre2 == 'null') {
            return (
                <span className="badge bg-primary me-1">{data.genre1}</span>
            )
        } else if (data.genre3 == 'null') {
            return (
                <>
                    <span className="badge bg-primary me-1">{data.genre1}</span>
                    <span className="badge bg-primary me-1">{data.genre2}</span>
                </>
            )
        } else {
            return (
                <>
                    <span className="badge bg-primary me-1">{data.genre1}</span>
                    <span className="badge bg-primary me-1">{data.genre2}</span>
                    <span className="badge bg-primary me-1">{data.genre3}</span>
                </>
            )
        }
    }

    const navigate = useNavigate();
    return (
        <div key={data.id} className="col-md-4 mb-4">
            <a onClick={() => {navigate(`/game/${data.id}`)}} style={{ textDecoration: 'none'}} className="btn w-100 h-100">
                <div className="card h-100" style={{ backgroundColor: `#e9edc9` }}>
                    <img src={data.image} className="card-img-top" height={280} alt={data.name} />
                    <div className="card-body">
                        <h5 className="card-title">{data.name}</h5>
                        <p className="card-text my-3">
                            {data.description.length > 100 ? data.description.slice(0, 80) + '...' : data.description}
                        </p>
                    </div>
                    <div className="card-footer">
                        <div className="d-flex justify-content-center align-items-center">
                            {showGenre(data)}
                        </div>
                    </div>
                </div>
            </a>
        </div>
    )
}