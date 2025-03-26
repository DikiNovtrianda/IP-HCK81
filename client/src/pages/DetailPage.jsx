import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { phase2IP } from "../../helpers/http-client";
import Navbar from "../components/navbar";
import CommentCard from "../components/CommentCard";
import WriteCommentCard from "../components/writeCommentCard";

export default function DetailPage() {
    const [games, setGames] = useState({})
    const { id } = useParams();
    const navigate = useNavigate();
  
    const getGameData = async () => {
        try {
            const {data} = await phase2IP.get(`/games/${id}`);
            setGames(data);
        } catch (error) {
            console.log(error);
        }
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    }

    const renderBadges = (items) => {
        if (items[0] === 'null') return 'none';
        return items.filter(item => item !== 'null').map((item, index) => (
            <span key={index} className="badge bg-primary me-1">{item}</span>
        ));
    };

    const writeComment = () => {
        if (localStorage.getItem('bearer_token')) {
            return <WriteCommentCard gameId={id}/>
        }
    }

    useEffect(() => {
        getGameData();
    }, [])

    return (
        <>
          <div className="album py-5" style={{ marginTop: '80px' }}>
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="card mb-4 box-shadow" style={{ backgroundColor: `#e9edc9` }}>
                    <img
                      className="card-img-top"
                      data-src="holder.js/100px225?theme=thumb&bg=55595c&fg=eceeef&text=Thumbnail"
                      alt="Thumbnail [100%x225]"
                      style={{ height: 800, width: "100%", display: "block" }}
                      src={ games.image }
                      data-holder-rendered="true"
                    />
                    <div className="card-body">
                      <h3 className="card-text text-center my-3">{ games.name }</h3>
                      <p className="card-text text-secondary">
                      Description : { games.description }
                      </p>
                      <p className="card-text small">
                        Release date : <span className="text-success">{ formatDate(games.releaseDate) }</span>
                      </p>
                      <p className="card-text small">
                        Price : <span className="text-success">{ formatPrice(games.price) }</span>
                      </p>
                      <p className="card-text small">Platform : <span className="text-primary">{renderBadges([games.platform1, games.platform2, games.platform3])}</span></p>
                      <p className="card-text small">Genre : <span className="text-primary">{renderBadges([games.genre1, games.genre2, games.genre3])}</span></p>
                      <p className="card-text small">Developer : <span className="text-primary">{renderBadges([games.developer1, games.developer2, games.developer3])}</span></p>
                      <p className="card-text small">Publisher : <span className="text-primary">{renderBadges([games.publisher1, games.publisher2, games.publisher3])}</span></p>
                      {/* <div className="d-flex justify-content-end align-items-center">
                        <div className="btn-group">
                          <button type="button" className="btn btn-sm btn-outline-primary px-4" onClick={() => { navigate("/") }}>
                            Back{" "}
                          </button>
                        </div>
                      </div> */}
                      <hr />
                        <h3 className="card-text text-center my-3">Comments</h3>
                        <div className="row justify-content-center">
                            {/* fetch all comments */}
                            <CommentCard />
                            {/* need authentication */}
                            {writeComment()}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
    )
}