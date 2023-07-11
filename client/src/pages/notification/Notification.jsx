import { useEffect, useState } from "react";
import Header from "../../components/header/Header"
import Notify from "../../components/notify/Notify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { errorNotify } from "../../components/toast/toast";
import CustomMenu from "../../components/customMenu/CustomMenu";

const Notification = () => {
    const [notifications, setNotifications] = useState(null);
    const navigate = useNavigate();
    const getNotifications = async () => {
        try {
            let response = await axios.get('/api/notification/getNotifications');
            let data = response.data;
            setNotifications(data);
        } catch (err) {
            if (err.response.data !== 402) errorNotify(err.response.data.message || "Something went Wrong")
            else navigate('/login');
        }
    }
    useEffect(() => {
        getNotifications();
    }, []);
    return (
        <div className="main_notification">
            <Header mode="Notification" />
            <CustomMenu />
            <div>
                {notifications ?
                    notifications.map(notification => {
                        return (<Notify data={notification} />)
                    }) : <div className="mydiv" style={{ display: "flex", justifyContent: "center" }}><div className="Loader_icon"><FontAwesomeIcon icon={faSpinner} /></div></div>
                }
            </div>
        </div>
    )
}

export default Notification;