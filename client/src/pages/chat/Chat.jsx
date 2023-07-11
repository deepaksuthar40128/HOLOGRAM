import { useEffect, useState } from "react";
import ChatUser from "../../components/chatUser/ChatUser"
import Header from "../../components/header/Header";
import "./Chat.css"
import axios from "axios";
import ChatTop from "../../components/chatTop/ChatTop";
import ChatBox from "../../components/chatBox/ChatBox";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faPaperPlane, faPlane, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { errorNotify } from "../../components/toast/toast";
import CustomMenu from "../../components/customMenu/CustomMenu";
const Chat = () => {
    const [users, setUsers] = useState(null);
    const [feedUser, setFeedUser] = useState(null);
    const [Chats, setChats] = useState(null);
    const navigate = useNavigate();
    const urlManage = () => {
        const url = window.location.href;
        let useURL = url.split('#');
        if (useURL.length > 1) {
            let email = useURL[1];
            document.getElementById(email).classList.add('highlight_user');
            setTimeout(() => {
                document.getElementById(email).classList.remove('highlight_user');
            }, 500);
            setTimeout(() => {
                document.getElementById(email).classList.add('highlight_user');
            }, 700);
            setTimeout(() => {
                document.getElementById(email).classList.remove('highlight_user');
            }, 900);
        }
    }
    const getUsers = async () => {
        try {
            let data = await axios.get('/api/chat/getUsers');
            data = data.data;
            setUsers(data);
            setTimeout(() => {
                urlManage();
            }, 500);
        } catch (err) {
            if (err.response.data.status === 402)
                navigate('/login');
            else
                errorNotify(err.response.data.message || "Something went Wrong")
        }
    }
    useEffect(() => {
        getUsers();
    }, [])
    const [loading, setLoading] = useState(false);
    const handleClick = async (email) => {
        setLoading(true);
        try {
            setChats(null);
            setFeedUser(null);
            let user = await axios.get(`/api/user/User/${email}`);
            setFeedUser(user.data);
            let data = await axios.get(`/api/chat/chatdata/${email}`);
            setChats(data.data);
        } catch (err) {
            if (err.response.data.status === 402)
                navigate('/login');
            else
                errorNotify(err.response.data.message || "Something went Wrong")
        }
        setLoading(false);
    }
    const sendMsz = async () => {
        let msz = document.getElementById('msz').value;
        document.getElementById('msz').value = '';
        msz = msz.trim();
        if (msz !== '') {
            try {
                await axios.post('/api/chat/sendMsz', {
                    email: feedUser.email,
                    msz
                })
            } catch (err) {
                errorNotify(err.response.data.message || "Something went Wrong")
            }
        }
    }
    return (
        <div className="main">
            <Header mode="Chat" />
            <CustomMenu />
            <div className="main_chat">
                <div className="left">
                    <h4>Chats:</h4>
                    <div className="flow_div">
                        {users ?
                            users.map(user => (
                                <div onClick={() => {
                                    handleClick(user.email);
                                }}>
                                    <ChatUser data={user} />
                                </div>
                            )
                            ) : <div className="Loader_icon"><FontAwesomeIcon icon={faSpinner} /></div>
                        }
                    </div>
                </div>
                <div className="right">
                    <div>{
                        feedUser &&
                        <ChatTop data={feedUser} />
                    }
                    </div>
                    <div>
                        {
                            Chats ? (Chats.map(chat2 => {
                                return (<>
                                    <ChatBox data={chat2} /> <br />
                                </>
                                )
                            })) : (loading ? <div className="Loader_icon" ><FontAwesomeIcon icon={faSpinner} /></div> : <div>Click on Users!</div>)

                        }
                    </div>
                    {feedUser && <div className="send_msz">
                        <input type="text" name="msz" id="msz" />
                        <FontAwesomeIcon onClick={sendMsz} icon={faPaperPlane} />
                    </div>}
                </div>
            </div>
        </div >
    )
}
export default Chat;