import { useContext, useEffect, useState } from "react";
import "./Feed.css"
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faImage, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { errorNotify } from "../toast/toast";
const Feed = () => {
    const navigate = useNavigate();
    const [show, changeShow] = useState(null);
    const [showlocation, setshowLocation] = useState(false)
    const [defaulLocation, setDefaulLocation] = useState(true);
    const [countries, setCountries] = useState(null);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedPincode, setSelectedPinCode] = useState(0);
    const [verifyPincode, setVerifyPinCode] = useState(null);
    const [regions, setRegions] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [citites, setCities] = useState(null);
    const handleChange = (e) => {
        let file = e.target.files[0];
        changeShow(null);
        if (file) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                changeShow({
                    "file": file,
                    "url": e.target.result
                });
            }
        }
    }
    const handleclick = () => {
        changeShow(null);
    }
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        if (defaulLocation) {
            formData.append('defaultLocation', true)
        }
        else {
            let location = [
                verifyPincode.Status !== 'Error' ? verifyPincode.PostOffice[0]?.Country : selectedCountry,
                verifyPincode.Status !== 'Error' ? verifyPincode.PostOffice[0]?.State : selectedRegion,
                verifyPincode.Status !== 'Error' ? verifyPincode.PostOffice[0]?.District : selectedCity,
                selectedPincode,
                "World"
            ]
            if (selectedArea !== '') location.push(selectedArea);
            formData.append('location', location)
        }
        let allTags = '';
        let tags = document.getElementsByClassName('selected');
        if (tags.length > 0) {
            Array.from(tags).forEach(tag => {
                allTags += tag.innerHTML;
                allTags += '/';
            })
        }
        formData.append('file', show?.file);
        formData.append('text', document.getElementById('text').value);
        formData.append('tags', allTags);
        changeShow(null);
        try {
            await axios.post('api/post/feedPost', formData);
        }
        catch (err) {
            if (err.response.data.status === 402) {
                navigate('/login');
            }
            else
                errorNotify(err.response.data.message || "Something went Wrong")
        }
        setLoading(false);
    }
    const [tagVisible, setTagsVisible] = useState(false);
    useEffect(() => {
        if (tagVisible) {
            Array.from(document.getElementsByClassName('tag')).forEach(tag => {
                tag.addEventListener('click', (e) => {
                    e.target.classList.toggle('selected');
                })
            })
        }
    }, [tagVisible])
    const { user } = useContext(AuthContext);
    const handleLocationClick = () => {
        setshowLocation(!showlocation);
    }
    const getCountries = async () => {
        try {
            let data = await axios.post('/api/post/fetchApis', {
                url: 'http://battuta.medunes.net/api/country/all/?key=00000000000000000000000000000000'
            });
            data = data.data;
            setCountries(data);
        } catch (err) {
            if (err.response.data.status === 402) {
                navigate('/login');
            }
            else
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
            if (err.response.data.status === 402) {
                navigate('/login');
            }
            else
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
        try {
            let data = await axios.post('/api/post/fetchApis', {
                url: `https://api.postalpincode.in/pincode/${selectedPincode}`
            });
            data = data.data;
            data = data[0];
            setVerifyPinCode(data);
        } catch (err) {
            if (err.response.data.status === 402) {
                navigate('/login');
            }
            else
                errorNotify(err.response.data.message || "Something went Wrong")
        }
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
            if (err.response.data.status === 402) {
                navigate('/login');
            }
            else
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
    return (user &&
        <div className="mydiv">
            <div className="feed">
                <div className="feedWrapper" id="alluserimg">
                    <div className="share">
                        <div className="shareWrapper">
                            <div className="shareTop">
                                <img className="shareProfileImg"
                                    src={user.img ? user.img : '/img/dummy_user.jpg'}
                                    id="myimg" alt="" />
                                <input type="text" name="text" id="text" placeholder={`${user.username} Write Your Need...`} />
                            </div>
                            <hr className="shareHr" />
                            <form className="shareBottom">
                                <div className="shareOptions">
                                    <label htmlFor="file"><FontAwesomeIcon icon={faImage} /></label>
                                    <input onChange={handleChange} type="file" name="file" id="file" accept=".png,.jpeg,.jpg" />
                                    <FontAwesomeIcon onClick={handleLocationClick} icon={faLocationDot} className="location_icon" />
                                    {
                                        defaulLocation ? <span className="current_location">{`${user?.area},${user.city},${user.state},${user.country},${user.pincode}`}</span> : <span className="current_location">
                                            {`${selectedCity},${selectedRegion},${selectedCountry},${selectedPincode}`}
                                        </span>
                                    }
                                </div>
                                <div>
                                    {!tagVisible && <button onClick={(e) => { e.preventDefault(); setTagsVisible(!tagVisible) }} className="shareButton tagbtn">Add Tags</button>}
                                    <button className="shareButton" onClick={handleSubmit} >{loading ? <span>Loading</span> : <span>Post</span>}</button>
                                </div>
                            </form>
                            {tagVisible && <div className="tags_container">
                                <div className="tags">
                                    <div className="tag">Outdoor</div>
                                    <div className="tag">Indoor</div>
                                    <div className="tag">Old-Age</div>
                                    <div className="tag">Money</div>
                                    <div className="tag">Used-Things</div>
                                    <div className="tag">Donation</div>
                                    <div className="tag">Paid</div>
                                    <div className="tag">Urgent</div>
                                    <div className="tag">Child-Care</div>
                                    <div className="tag">Women</div>
                                </div>
                            </div>}
                        </div>
                        <div id="temp">
                            {show && <div className="postCenter">
                                <span className='cancel_icon'><FontAwesomeIcon onClick={handleclick} icon={faCircleXmark} /></span>
                                <img className="postImg" src={show.url} alt="" />
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
            {
                showlocation &&
                <div className="location_popup">
                    <div className="cancel_popup" onClick={handleLocationClick}>X</div>
                    <div className="popup_content">
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <input type="checkbox" id="switch" defaultChecked={defaulLocation} onChange={() => { setDefaulLocation(!defaulLocation) }} /><label for="switch">Toggle</label>
                            <div className="userLocation">Use Default Location</div>
                        </div>
                        <div className="form">
                            {!defaulLocation &&
                                <>
                                    <input type="number" name="pincode" id="pincode" placeholder="PinCode" />
                                    <button onClick={handleVerify} className="btn">Verify Pincode</button>
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
                                    <button onClick={handleLocationClick} className="btn">Done</button>
                                </>}
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Feed;