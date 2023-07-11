import axios from "axios";
import "./ChatUser.css"
import { errorNotify } from "../toast/toast";
const ChatUser = ({ data }) => {
    const handleClick = async (e) => {
        let id = document.getElementById(data.email).getAttribute('datatype');
        try {
            await axios.get(`/api/chat/markMszRead/${id}`);
        } catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong")
        }
    }
    return (
        <div onClick={handleClick} className={data.readed ? 'main_box readed' : 'main_box'} id={data.email} datatype={data._id}>
            <div className="profile_img">
                <img src={data.userprofile ? data.userprofile : '/img/dummy_user.jpg'} alt="USER" />
            </div>
            <div className="information">
                <h2>{data.username}</h2>
                <p>{data.email}</p>
                <p>{data.createdAt}</p>
            </div>
        </div>
    )
}

export default ChatUser;