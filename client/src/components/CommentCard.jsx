import { useEffect } from "react";

export default function CommentCard({comment, userId}) {
    const commentSetting = () => {
        if (comment.User.id === userId) {
            return (
                <>
                    <hr />
                    <div className="row justify-content-end">
                        <div className="col-2">
                            <button className="btn btn-primary w-100">Edit</button>
                        </div>
                        <div className="col-2">
                            <button className="btn btn-danger w-100">Delete</button>
                        </div>
                    </div>
                </>
            )
        }
    }
    return (
        <>
            <div className="col-md-10 border border-secondary p-3 rounded my-3">
                {comment.User.username}
                <hr />
                Rating : <span className="text-warning-emphasis">{comment.rating}</span>
                <br />
                Comments : 
                <br />
                <div className="p-3 border rounded" style={{ backgroundColor: `#fefae0` }}>{comment.comment}</div>
                <br />
                {commentSetting()}
            </div>
        </>
    )
}