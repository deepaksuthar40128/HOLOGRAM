import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./Login.css"
import { AuthContext } from "../../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { errorNotify, warningNotify } from "../../../components/toast/toast";
const Login = () => {
    const { loading, dispatch } = useContext(AuthContext);
    const [localLoading, setLocalLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" })
        let data = {
            "email": document.getElementById('email').value,
            "password": document.getElementById('password').value
        }
        try {
            data = await axios.post('/api/auth/login', data);
            sessionStorage.setItem('user', JSON.stringify(data.data));
            sessionStorage.setItem('loginTime', JSON.stringify(Date.now()));
            let allUser = localStorage.getItem('allUsers');
            if (allUser) {
                allUser = JSON.parse(allUser);
                if (!(data.data.email in allUser)) {
                    let key = data.data.email;
                    console.log(key);
                    allUser = {
                        [key]: {
                            "email": key,
                            "username": data.data.username,
                            "img": data.data.img
                        },
                        ...allUser
                    }
                    localStorage.removeItem('allUsers');
                    localStorage.setItem("allUsers", JSON.stringify(allUser));
                }
            }
            else {
                let key = data.data.email;
                allUser = {
                    [key]: {
                        "email": key,
                        "username": data.data.username,
                        "img": data.data.img
                    }
                }
                localStorage.setItem("allUsers", JSON.stringify(allUser));
            }
            dispatch({ type: "LOGIN_SUCCESS", payload: data.data });
            navigate('/');
        }
        catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong")
            dispatch({ type: "LOGIN_FAILURE", payload: err.response.data })
        }
    }
    useEffect(() => {
        if (localLoading) {
            let challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);
            let options = {
                publicKey: {
                    challenge: challenge,
                    userVerification: 'required',
                    authenticatorSelection: {
                        authenticatorAttachment: 'platform',
                        requireResidentKey: false,
                        userVerification: 'required'
                    }
                }
            };
            navigator.credentials.get(options).then(async (credential) => {
                let key = credential.id;
                try {
                    let data = await axios.post('/api/auth/verifyKey', { key });
                    console.log(data.data);
                    sessionStorage.setItem('user', JSON.stringify(data.data));
                    dispatch({ type: "LOGIN_SUCCESS", payload: data.data });
                    navigate('/');
                } catch (err) {
                    errorNotify(err.response.data.message || "Something went Wrong")
                    dispatch({ type: "LOGIN_FAILURE", payload: err.response.data })
                    setLocalLoading(false);
                }
            }).catch(function (error) {
                let err = new Error(error.message.split('.')[0]);
                warningNotify(err.message || "Something went Wrong")
                dispatch({ type: "LOGIN_FAILURE", payload: err })
                setLocalLoading(false);
            });
        }
    }, [localLoading])
    const handlePublicLogin = () => {
        setLocalLoading(true);
    }
    return (
        <div className="main_login">
            <div className="login">
                <div className="heading_login">Login</div>
                <div className="form">
                    <input type="email" name="email" id="email" placeholder="example@example.com" />
                    <input type="password" name="password" id="password" placeholder="Password" />
                    {
                        (<button onClick={handleSubmit} className="btn" disabled={loading}>{loading ? <div className="loading_icon"> <FontAwesomeIcon className="rotate_loading_icon" icon={faSpinner} /></div> : <span>Login</span>}</button>)
                    }
                </div>
                <div className="other">
                    <div className="forgot_password">
                        <Link to='/forgotPassword'>
                            <p>Forgot Password?</p>
                        </Link>
                    </div>
                    <div className="social_login">

                    </div>
                    {window.PublicKeyCredential && <div className="redirect">
                        <button disabled={localLoading} onClick={handlePublicLogin} className="btn">
                            {localLoading ?
                                <div className="loading_icon">
                                    <FontAwesomeIcon className="rotate_loading_icon" icon={faSpinner} />
                                </div>
                                : <div>Public Key</div>
                            }
                        </button>
                    </div>}
                    <div className="redirect">
                        <Link to='/register'>
                            <button className="btn">Create Account</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;