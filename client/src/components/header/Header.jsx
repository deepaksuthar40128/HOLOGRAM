import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./Header.css"
import {
    faBell,
    faEnvelope,
    faHouse
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const Header = ({ mode }) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    if (!user) navigate('/login');
    const addClass = (type) => {
        if (type === mode) {
            return "active";
        }
        return 'noactive'
    }
    const [notify, setNotify] = useState(null);
    const getNotifyData = async () => {
        try {
            let data;
            if (mode === "profile")
                data = await axios.get('../api/notification/getUserNotify');
            else
                data = await axios.get('api/notification/getUserNotify');
            data = data.data
            setNotify(data);
        } catch (err) {
            navigate('/login');
        }
    }
    useEffect(() => {
        getNotifyData();
    }, [])
    return (notify &&
        <div className="main_header_div">
            <div className="left_header">
                <div className="logo_img">
                    <img src="https://www.logomaker.com/api/main/images/1j+ojlxEOMkX9Wyqfhe43D6kh...KArhFGmhnOwWJqZ0gWqVAb0nFwkK5p+I5kdENVshVe1wJKLJ98zXF2UIYdjh5n...D+JOQ==" alt="LOGO" />
                </div>
            </div>
            <div className="mid_header">
                <ul>
                    <li className={`nav_link ${addClass('Home')}`}> <Link to='/' > <FontAwesomeIcon icon={faHouse} /></Link></li>
                    <li className={`nav_link ${addClass('Chat')}`}> <Link to='/chat' >{
                        notify.Ismessage && <span className="notify_icon"></span>
                    }
                        <FontAwesomeIcon icon={faEnvelope} /></Link></li>
                    <li className={`nav_link ${addClass('Notification')}`}> <Link to='/notifications' >{
                        notify.IsNotification && <span className="notify_icon"></span>
                    } <FontAwesomeIcon icon={faBell} /></Link></li>
                </ul>
            </div>
            <div className="right_header">
                {
                    user ?
                        (<Link to={`/profile/${user.email}`}><div className="username_header">
                            <p>{user.username}</p>
                        </div>
                            <div className="userProfile_header">
                                <img src={user.img ? user.img : '/img/dummy_user.jpg'} alt="" />
                            </div></Link>) : (
                            <>
                                <Link to='/login'>Login</Link>
                                <Link to='/register'>Register</Link>
                            </>

                        )
                }
            </div>
        </div>
    )
}

export default Header;