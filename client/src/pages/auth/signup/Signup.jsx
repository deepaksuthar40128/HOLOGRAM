import axios from "axios";
import "./Signup.css"
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { errorNotify, successNotify } from "../../../components/toast/toast";
const Signup = () => {
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState(null);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedPincode, setSelectedPinCode] = useState(0);
    const [verifyPincode, setVerifyPinCode] = useState(null);
    const [regions, setRegions] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [citites, setCities] = useState(null);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let data = {
            "username": document.getElementById('username').value,
            email,
            "password": document.getElementById('password').value,
            "pincode": selectedPincode,
            "country": verifyPincode.Status !== 'Error' ? verifyPincode.PostOffice[0]?.Country : selectedCountry,
            "state": verifyPincode.Status !== 'Error' ? verifyPincode.PostOffice[0]?.State : selectedRegion,
            "city": verifyPincode.Status !== 'Error' ? verifyPincode.PostOffice[0]?.District : selectedCity,
            "area": selectedArea
        }
        try {
            data = await axios.post('/api/auth/register', data);
            navigate('/login');
        }
        catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong")
        }
        setLoading(false);
    }
    const getCountries = async () => {
        try {
            let data = await axios.post('/api/post/fetchApis', {
                url: 'http://battuta.medunes.net/api/country/all/?key=00000000000000000000000000000000'
            });
            data = data.data;
            setCountries(data);
        } catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong")
        }
    };
    const getCities = async () => {
        try {
            let data = await axios.post('/api/post/fetchApis', {
                url: `https://battuta.medunes.net/api/city/${selectedCountry}/search/?region=${selectedRegion}&key=00000000000000000000000000000000`
            });
            data = data.data;
            setCities(data);
        } catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong")
        }
    };
    const handleVerify = () => {
        let pincode = document.getElementById('pincode').value;
        setSelectedPinCode(pincode);
    }
    useEffect(() => {
        if (selectedPincode !== 0) {
            getPincodeInfo();
        }
    }, [selectedPincode])
    const getPincodeInfo = async () => {
        setLoading(true);
        try {
            let data = await axios.post('/api/post/fetchApis', {
                url: `https://api.postalpincode.in/pincode/${selectedPincode}`
            });
            data = data.data;
            data = data[0];
            setVerifyPinCode(data);
        } catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong")
        }
        setLoading(false);
    };
    const handleCountrySelect = (e) => {
        let country = e.target.value;
        setSelectedCountry(country);
    }
    useEffect(() => {
        if (selectedCountry !== '') getRegions();
    }, [selectedCountry]);
    const getRegions = async () => {
        try {
            let data = await axios.post('/api/post/fetchApis', {
                url: `http://battuta.medunes.net/api/region/${selectedCountry}/all/?key=00000000000000000000000000000000`
            });
            data = data.data;
            setRegions(data);
        } catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong")
        }
    };
    useEffect(() => {
        if (selectedRegion !== '') getCities();
    }, [selectedRegion]);
    const handleRegionSelect = (e) => {
        let region = e.target.value;
        setSelectedRegion(region);
    }
    const handleCitySelect = (e) => {
        setSelectedCity(e.target.value);
    }
    const handleAreaSelect = (e) => {
        setSelectedArea(e.target.value);
    }
    useEffect(() => {
        getCountries()
    }, []);
    const [showOTP, setshowOTP] = useState(false);
    const [showVerifyEmail, setShowVerifyEmail] = useState(true);
    const handleVerifyEmail = async () => {
        setLoading(true);
        try {
            await axios.post('/api/auth/verifyEmail', { email });
            successNotify("OTP sent!");
            setshowOTP(true);
        } catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong")
        }
        setLoading(false);
    }
    const handleVerifyOTP = async () => {
        setLoading(true);
        try {
             await axios.post('/api/auth/verifyOTP', { email, 'otp': document.getElementById('otp').value });
             successNotify("Email verification Successfully Complete!")
            setshowOTP(false);
            setShowVerifyEmail(false);
        } catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong")
        }
        setLoading(false);
    }

    return (
        <div className="main_login">
            <div className="login">
                <div className="heading_login">SignUp</div>
                <div className="form">
                    <input type="text" name="username" id="username" placeholder="Name" />
                    <input type="email" disabled={!showVerifyEmail} onChange={(e) => {setEmail(e.target.value) }} name="email" id="email" placeholder="example@example.com" />
                    {
                        showOTP ? <> <input type="number" name="otp" id="otp" placeholder="OTP" /> < button onClick={handleVerifyOTP} disabled={loading} className="btn">{loading ? <div className="loading_icon"> <FontAwesomeIcon className="rotate_loading_icon" icon={faSpinner} /></div> : <span>Verify OTP</span>}</button></> :
                            showVerifyEmail ? < button onClick={handleVerifyEmail} disabled={loading} className="btn">{loading ? <div className="loading_icon"> <FontAwesomeIcon className="rotate_loading_icon" icon={faSpinner} /></div> : <span>Verify Email</span>}</button> : <span style={{ color: "#40c51f", margin: "auto", display: "block", maxWidth: "fit-content" }}>Email Verification Completed!</span>
                    }
                    {!showVerifyEmail && <><input type="password" name="password" id="password" placeholder="Create Password" />
                        <input type="number" name="pincode" id="pincode" placeholder="PinCode" />
                        <button onClick={handleVerify} disabled={loading} className="btn">{loading ? <div className="loading_icon"> <FontAwesomeIcon className="rotate_loading_icon" icon={faSpinner} /></div> : <span>Verify Pincode</span>}</button></>}
                    {verifyPincode && (verifyPincode.Status === 'Error' ? <>
                        <select onChange={handleCountrySelect} name="country" id="country">
                            <option value="">-- Country --</option>
                            {countries && countries.map(country => {
                                return (
                                    <option value={country.code}>{country.name}</option>
                                )
                            })
                            }
                        </select>
                        <select onChange={handleRegionSelect} name="region" id="region">
                            <option value="">-- Region --</option>
                            {regions && regions.map(region => {
                                return (
                                    <option value={region.region}>{region.region}</option>
                                )
                            })
                            }
                        </select>

                        <select name="city" id="city" onChange={handleCitySelect}>
                            <option value="">-- City --</option>
                            {citites && citites.map(city => {
                                return (
                                    <option value={city.city}>{city.city}</option>
                                )
                            })
                            }
                        </select>
                    </> :
                        <>
                            <select onChange={handleAreaSelect} name="area" id="area">
                                <option value="">-- Area --</option>
                                {verifyPincode && verifyPincode?.PostOffice.map(area => {
                                    return (
                                        <option value={area.Name}>{area.Name}</option>
                                    )
                                })
                                }
                            </select>

                        </>)
                    }
                    {verifyPincode &&
                        <button className="btn" disabled={loading} onClick={handleSubmit}>{loading ? <div className="loading_icon"> <FontAwesomeIcon className="rotate_loading_icon" icon={faSpinner} /></div> : <span>SignUp</span>}</button>
                    }
                </div>
                <div className="other">
                    <div className="social_login">

                    </div>
                    <div className="redirect">
                        <Link to='/login'>
                            <button className="btn">Already Account</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Signup;