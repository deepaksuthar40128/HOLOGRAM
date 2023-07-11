import "./Forgot.css"
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useState } from "react";
import { errorNotify, successNotify } from "../../../components/toast/toast";
const Forgot = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifyOTP, setVerifyOTP] = useState(false);
    const [newPassword, setNewPassword] = useState(false);
    const handleSubmit = async () => {
        setLoading(true);
        try {
            await axios.post('/api/auth/sendOTP', { 'email': email });
            successNotify("OTP Sent!")
            setVerifyOTP(true);
        } catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong")
        }
        setLoading(false);
    }
    const handleOTP = async () => {
        setLoading(true);
        try {
            await axios.post('/api/auth/verifyOTP', { email, 'otp': document.getElementById('otp').value })
            document.getElementById('otp').value = '';
            successNotify("Email Verified!")
            setNewPassword(true);
        } catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong")
        }
        setLoading(false);
    }
    const navigate = useNavigate();
    const handlePassword = async () => {
        setLoading(true);
        try {
           await axios.post('/api/auth/newPassword', { email, 'password': document.getElementById('password').value });
            navigate('/login');
        } catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong")
        }
    }
    return (
        <div className="main_login">
            <div className="login">
                <div className="heading_login">Forgot Password</div>
                {
                    verifyOTP ? (newPassword ?
                        <div className="form">
                            <input type="password" name="password" id="password" placeholder="New Password" />
                            {
                                (<button onClick={handlePassword} className="btn" disabled={loading}>{loading ? <div className="loading_icon"> <FontAwesomeIcon className="rotate_loading_icon" icon={faSpinner} /></div> : <span>Change Password</span>}</button>)
                            }
                        </div>
                        :
                        <div className="form">
                            <input type="number" name="otp" id="otp" placeholder="One Time Password" />
                            {
                                (<button onClick={handleOTP} className="btn" disabled={loading}>{loading ? <div className="loading_icon"> <FontAwesomeIcon className="rotate_loading_icon" icon={faSpinner} /></div> : <span>Verify OTP</span>}</button>)
                            }
                            {
                                (<button onClick={handleSubmit} className="btn" disabled={loading}>{loading ? <div className="loading_icon"> <FontAwesomeIcon className="rotate_loading_icon" icon={faSpinner} /></div> : <span>Resend OTP</span>}</button>)
                            }
                        </div>
                    )
                        :
                        <div className="form">
                            <input type="email" name="email" id="email" onChange={(e) => { setEmail(e.target.value) }} placeholder="example@example.com" />
                            {
                                (<button onClick={handleSubmit} className="btn" disabled={loading}>{loading ? <div className="loading_icon"> <FontAwesomeIcon className="rotate_loading_icon" icon={faSpinner} /></div> : <span>OTP</span>}</button>)
                            }
                        </div>
                }
                <div className="other">
                    <div className="redirect">
                        <Link to='/login'>
                            <button className="btn">Back</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Forgot;