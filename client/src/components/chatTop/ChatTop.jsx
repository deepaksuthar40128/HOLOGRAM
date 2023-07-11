import { Link } from "react-router-dom";
import "./ChatTop.css"
const ChatTop = ({ data }) => {
    return (
        <div className="main_top">
            <Link to={`/profile/${data.email}`}>
                <div className="profile_top">
                    <img src={data.img ? data.img : '/img/dummy_user.jpg'} alt="USER" />
                </div>
                <div className="username">
                    <p>{data.username}</p>
                </div>
            </Link>
        </div>
    )
}

export default ChatTop;