import { Link } from "react-router-dom";
import "./Notify.css"
import axios from "axios";
import { errorNotify } from "../toast/toast";
const Notify = ({ data }) => {
    const handleClick = async () => {
        try {
            await axios.get(`/api/notification/updateReadNotification/${data._id}`);
        } catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong")
        }
    }
    return (
        <Link to={data.link} >
            <div className={data.readed ? 'mydiv readed' : 'mydiv'} onClick={handleClick}>
                <div className="notify_main">
                    <div className="notify_user_profile">
                        <div>
                            <img src={data.img ? data.img : "/img/dummy_user.jpg"} alt="" />
                        </div>
                    </div>
                    <div className="notify_text">
                        <b>{data.username}</b> {data.text}
                        <div className="notify_time">{data.createdAt}</div>
                    </div>
                </div>
            </div>
        </Link >
    )
}

export default Notify;