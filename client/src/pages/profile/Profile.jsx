import { useContext, useEffect, useState } from "react";
import "./Profile.css"
import axios from "axios";
import Post from "../../components/post/Post";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPencil } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import { errorNotify, successNotify, warningNotify } from "../../components/toast/toast";
import CustomMenu from "../../components/customMenu/CustomMenu";
import Header from "../../components/header/Header";
const Profile = () => {
    const [showUpdateDetails, setShowUpdateDetails] = useState(false);
    const [userProfile, setuserProfile] = useState('/img/dummy_user.jpg');
    const [userbg, setuserbg] = useState('/img/prop2.jpg');
    const [user2, setUser] = useState(null);
    const [posts, setPosts] = useState(null);
    const { user, dispatch } = useContext(AuthContext);
    const param = useParams();
    const navigate = useNavigate();
    const getPosts = async () => {
        try {
            let data = await axios.get(`/api/post/Posts/${param.id}`);
            data = data.data;
            setPosts(data);
        } catch (err) {
            if (err.response.data.status === 402)
                navigate('/login');
            else errorNotify(err.response.data.message || "Something went Wrong")
        }
    }
    const loadPointBar = () => {
        let x = Math.ceil(user2.points / 10);
        document.getElementById('inner_bar_move').style.width = `${x}%`;
    }
    const getUser = async () => {
        try {
            let data = await axios.get(`/api/user/User/${param.id}`)
            data = data.data;
            if (data.img) setuserProfile(data.img);
            if (data.bg) setuserbg(data.bg);
            if (!user) navigate('/login');
            setUser(data);
        } catch (err) {
            if (err.response.data.status === 402)
                navigate('/login');
            else errorNotify(err.response.data.message || "Something went Wrong")
        }
    }
    useEffect(() => {
        if (user2 && document.getElementById('inner_bar_move')) {
            loadPointBar();
        }
    }, [user2]);
    useEffect(() => {
        getUser();
        getPosts();
    }, [])
    const uploadProfileImg = async (file, url) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            let data = await axios.post(url, formData);
            data = data.data;
            successNotify("Image Uploaded Successfully!");
            sessionStorage.setItem('user', JSON.stringify(data));
            dispatch({ type: "LOGIN_SUCCESS", payload: data });
            setUser(data);
        } catch (err) {
            if (err.response.data.status === 402)
                navigate('/login');
            else errorNotify(err.response.data.message || "Something went Wrong")
        }
    }
    const handleUserProfileChange = (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            setuserProfile(e.target.result);
            uploadProfileImg(file, '/api/user/updateProfileImg');
        }
    }
    const handleUserBGChange = (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            setuserbg(e.target.result);
            uploadProfileImg(file, '/api/user/updateBGImg')
        }
    }
    const handleBioUpdate = async (e) => {
        e.preventDefault();
        try {
            let data = await axios.post('/api/user/updateBio', {
                "bio": document.getElementById('bio').value
            })
            data = data.data;
            successNotify("Bio Updated Successfully!");
            setShowUpdateDetails(!showUpdateDetails);
            sessionStorage.setItem('user', JSON.stringify(data));
            dispatch({ type: "LOGIN_SUCCESS", payload: data });
            setUser(data);
        } catch (err) {
            if (err.response.data.status === 402)
                navigate('/login');
            else errorNotify(err.response.data.message || "Something went Wrong")
        }
    }
    const handlePublicLockClick = async () => {
        var challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        var options = {
            publicKey: {
                rp: {
                    name: "HOLOGRAM"
                },
                user: {
                    id: new Uint8Array([1, 2, 3, 4]),
                    name: user.username,
                    displayName: user.username
                },
                challenge: challenge,
                pubKeyCredParams: [{
                    type: "public-key",
                    alg: -7
                }],
                authenticatorSelection: {
                    authenticatorAttachment: 'platform',
                    requireResidentKey: false,
                    userVerification: 'required'
                },
                timeout: 60000,
                attestation: 'none'
            }
        };

        navigator.credentials.create(options).then(async (credential) => {
            let key = credential.id;
            try {
                let data = await axios.post('/api/auth/addKey', { key })
                console.log(data);
            } catch (err) {
                errorNotify(err.response.data.message || "Something went Wrong")
            }
        }).catch(function (error) {
            let err = new Error(error.message.split('.')[0])
            warningNotify(err.message || "Something went Wrong")
        });
    }
    return (
        <>
            <Header mode="profile" />
            <CustomMenu />
            {user2 &&
                <div className="profile">
                    <div className="upper_profile">
                        <div className="background">
                            <img src={userbg} alt="BG" />
                            {user.email === param.id && <><label htmlFor="userbgimg"><span><FontAwesomeIcon icon={faPenToSquare} /></span></label>
                                <input type="file" name="userbgimg" id="userbgimg" onChange={handleUserBGChange} hidden /></>}
                        </div>
                        <div className="frontground">
                            <div className="b1">
                                <div className="userProfile">
                                    <img src={userProfile} alt="profile" />
                                </div>
                                {user.email === param.id && <><label htmlFor="userProfileImg">
                                    <span><FontAwesomeIcon icon={faPencil} /></span></label>
                                    <input type="file" name="userProfileImg" id="userProfileImg" onChange={handleUserProfileChange} hidden /></>}

                            </div>
                            <div className="about">
                                {!showUpdateDetails && <><div className="username">{user2.username}</div>
                                    <div className="bio">{user2.bio ? user2.bio : 'Welcome'}</div>
                                    <div className="info">{`From ${user2.area}, ${user2.city}, ${user2.state}, ${user2.country},${user2.pincode}`}</div></>}
                                {showUpdateDetails &&
                                    <div>
                                        <form className="myform">
                                            <div className="row">
                                                <div>
                                                    <label htmlFor="bio">Bio<span>(*something that explains you)</span></label>
                                                    <textarea name="bio" id="bio" cols="30" rows="5" placeholder={user2.bio ? user2.bio : 'Write Here!'}></textarea> <br />
                                                    <button className="update_btn" onClick={handleBioUpdate}>Update</button>
                                                </div>

                                            </div>
                                        </form>
                                    </div>
                                }
                                {
                                    user.email === param.id && (
                                        <div>
                                            <button onClick={() => setShowUpdateDetails(!showUpdateDetails)} className="update_btn">{!showUpdateDetails ? <>Update Details</> : <>Cancel Update</>}</button>
                                        </div>
                                    )
                                }
                                {
                                    (user.email === param.id) && (!showUpdateDetails) && window.PublicKeyCredential && (
                                        <div>
                                            <button onClick={handlePublicLockClick} className="update_btn">Add Public Lock</button>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="user_level_points">
                                <div className="points">
                                    <div className="pointsNumber">{user2.points}/1000</div>
                                    <div className="main_out_bar">
                                        <div className="inner_bar" id="inner_bar_move">
                                        </div>
                                    </div>
                                </div>
                                <div className="levels">
                                    You are on level: <span id="user_level">{user2.level}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        posts &&
                        posts.map(post => (<Post data={post} />))
                    }
                </div >
            }</>)
}

export default Profile;