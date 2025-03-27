import { useState } from "react";
import { phase2IP } from "../../helpers/http-client";

export default function WriteCommentCard({gameId, getGameData}) {
    const [startComment, setStartComment] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isComment, setIsComment] = useState(false);

    const selectRating = () => {
        const html = []
        for (let i = 1; i <= 10; i++) {
            html.push(
                <li className="nav-item" role="presentation">
                    <button 
                    className={ rating === i ? "nav-link bg-primary active rounded-5 fw-bold" : "nav-link bg-secondary active rounded-5 fw-bold"} 
                    data-bs-toggle="tab" 
                    type="button"
                    aria-selected="true"
                    onClick={() => setRating(i)}
                    >
                    {i}
                    </button>
                </li>
            )
        }
        return html   
    }

    const commentContainer = () => {
        if (!startComment) {
            return (
                <>
                    <div className="col-md-10 p-0 my-3">
                        <button className="btn btn-primary w-100" onClick={() => setStartComment(true)}>Write a comment</button>
                    </div>
                </>
            )
        } else {
            return (
                <div className="col-md-10 border border-secondary p-3 rounded my-3">
                    Name
                    <hr />
                    <h5 className="text-center">Rating</h5>
                    <ul className="nav nav-pills nav-fill gap-2 p-1 small bg-secondary rounded-5 shadow-sm" id="pillNav2">
                        {selectRating()}
                    </ul>
                    <br />
                    <h5 className="text-center">Comment</h5>
                    <textarea className="form-control my-3" placeholder="Write your comment here" rows="10" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                    <button className="btn btn-primary justify-content-end w-100" onClick={() => postComment()}>Submit</button>
                </div>
            )
        }
    }

    const postComment = async () => {
        try {
            const result = await phase2IP.post(`/games/${gameId}/comment`, {
                rating,
                comment
            }, {
                headers: {
                    Authorization: localStorage.getItem('bearer_token')
                }
            });
            console.log(result.data);
            getGameData()
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {commentContainer()} 
        </>
    )
}