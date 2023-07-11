import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import "./Comment.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
const Comment = ({ data }) => {
    return (
        <div className="main_comment">
            <div className="commentUser">
                <div className="commentUserprofile">
                    <img src={data.user.userProfile} alt="" />
                </div>
                <div className="name_time">
                    <div className="commentUserName">
                        <Link to={`/profile/${data.user.email}`}>
                            <span>{data.user.username}</span>
                        </Link>
                    </div>
                    <div className="comment_time">
                        {data.time}
                    </div>
                </div>
                <div className="post_menu"><FontAwesomeIcon icon={faEllipsis} /></div>
            </div>
            <hr className="comment_hr" />
            <div className="comment_text">
                {data.text}
            </div>
        </div>
    )
}

export default Comment;