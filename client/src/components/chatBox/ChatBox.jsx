import { useContext, useEffect, useState } from "react";
import "./ChatBox.css"
import axios from "axios";
import Post from "../post/Post";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { errorNotify } from "../toast/toast";
const ChatBox = ({ data }) => {
    console.log(data);
    const { user } = useContext(AuthContext);
    const [postData, setpostData] = useState(null);
    const navigate = useNavigate();
    const getPostData = async () => {
        if (data.Post_id) {
            try {
                let response = await axios.get(`/api/chat/sharedPost/${data.Post_id}`);
                setpostData(response.data);
            } catch (err) {
                if (err.response.data.status === 402)
                    navigate('/login');
                else errorNotify(err.response.data.message || "Something went Wrong")
            }
        }
    }
    const setClass = () => {
        if (data.Toemail === user.email) return 'fleft';
        else return 'fright';
    }
    useEffect(() => {
        getPostData();
    }, [])
    return (
        <div className={`chatbox ${setClass()}`}>
            <div className="chattext">
                {
                    data.text
                }
            </div>
            {data.Post_id&& <div>{postData ?
                <Post data={postData} /> :<div className="Loader_icon"><FontAwesomeIcon icon={faSpinner} /></div>
            }</div>}
            <div className="mszTime">
                {data.createdAt}
            </div>
        </div>
    )
}
export default ChatBox;