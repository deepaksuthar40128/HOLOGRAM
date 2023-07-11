import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { formatRelativeTime } from "../../utils/timeFormat";

const CustomMenu = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    if (!user) navigate('/login');
    let loginTime = sessionStorage.getItem('loginTime');
    if (loginTime) loginTime = JSON.parse(loginTime);
    document.addEventListener('click', function (event) {
        var contextMenu = document.getElementById('contextMenu');
        if (contextMenu) {
            var isClickedOutsideMenu = !contextMenu.contains(event.target);

            if (isClickedOutsideMenu) {
                hideMenu();
            }
        }
    });

    document.oncontextmenu = function (e) {
        e.preventDefault();
        if (user) {
            var menu = document.getElementById("contextMenu");
            menu.style.display = 'block';

            var x = e.clientX;
            var y = e.clientY;
            var menuWidth = menu.offsetWidth;
            var menuHeight = menu.offsetHeight;
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;

            if (x + menuWidth > windowWidth) {
                x = windowWidth - menuWidth - 10;
            }

            if (y + menuHeight > windowHeight) {
                y = windowHeight - menuHeight - 10;
            }

            menu.style.left = x + "px";
            menu.style.top = y + "px";
        }
    };

    function hideMenu() {
        document.getElementById("contextMenu").style.display = "none";
    }

    const [allUsers, setAllUsers] = useState(null);
    const loadData = () => {
        let allUsersdata = localStorage.getItem('allUsers');
        if (allUsersdata) {
            allUsersdata = JSON.parse(allUsersdata);
            delete allUsersdata[user.email];
            console.log(allUsersdata)
            setAllUsers(allUsersdata);
        }
    }
    useEffect(() => {
        if (user)
            loadData();
    }, [])
    const [onlineTime, setOnlineTime] = useState("Just Now");
    const getLoginTime = () => {
        if (loginTime)
            setOnlineTime(formatRelativeTime(Date.now() - loginTime));
        else setOnlineTime("Just Now");
    }
    let interval = 0;
    useEffect(() => {
        clearInterval(interval);
        if (interval == 0) getLoginTime();
        interval = setInterval(() => {
            getLoginTime();
        }, 60000);
    }, []);
    return (<>
        {user &&
            < div className="menu settings" style={{ zIndex: 2, position: "fixed" }} id="contextMenu" >
                <ul className="menu-list">
                    <Link to={`/profile/${user.email}`}>
                        <li id="dark-mode" className="menu-item context-buttons">
                            <button className="context-button" style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                <img src={user.img ? user.img : '/img/dummy_user.jpg'} alt="" />
                                <div className="status_info">
                                    <p style={{ fontSize: "20px" }}>{user.username}</p>
                                    <p style={{ color: "grey" }} >Login : {onlineTime}</p>
                                </div>
                            </button>
                        </li>
                    </Link>
                    <li id="dark-mode" className="menu-item ">
                        <button disabled className="menu-button">
                            <span className="  center is-black"> Hello <b>{user.username}</b>, How are You Today! </span>
                        </button>
                    </li>
                </ul>
                <ul className="menu-list">
                    <li className="menu-item"><button className="menu-button  menu-button--orange">
                        <img src={user.img ? user.img : '/img/dummy_user.jpg'} alt="" />
                        {user.username} <span className="second">(Logged in) </span>
                    </button></li>
                    {
                        allUsers ? Object.values(allUsers).map(user2 => (<li className="menu-item"><button className="menu-button">
                            <img src={user2.img ? user2.img : '/img/dummy_user.jpg'} alt="" />
                            <span className="second">{user2.username} </span>
                        </button></li>)
                        ) : <div>Hello</div>

                    }
                    <li className="menu-item">
                        <Link to={"/login"} >
                            <button className="menu-button">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" className="css-i6dzq1"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Add
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    className="feather feather-chevron-right">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button></Link>
                    </li>
                </ul>
            </div >
        }</>
    )
}

export default CustomMenu;