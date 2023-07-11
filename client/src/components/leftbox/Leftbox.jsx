import { useEffect, useState } from "react";
import "./Leftbox.css"
import { useNavigate } from "react-router-dom";
const Leftbox = ({ data, changeURL, postsCount }) => {
    let b1 = true, b2 = true;
    const classRemover = (className, tag) => {
        Array.from(document.getElementsByClassName(className)).forEach(ele => {
            if (ele !== tag) {
                if (ele.classList.contains('selected')) ele.classList.remove('selected');
            }
        })
    }
    const navigate = useNavigate();
    const [finalTag, setfinalTag] = useState('');
    const [locationTag, setlocationTag] = useState('');
    useEffect(() => {
        if (!data) {
            navigate('/login');
        }
        if (document.getElementsByClassName('tag2') && b1) {
            b1 = false;
            Array.from(document.getElementsByClassName('tag2')).forEach(tag => {
                tag.addEventListener('click', () => {
                    classRemover('tag2', tag);
                    if (Array.from(tag.classList).includes('selected')) {
                        tag.classList.remove('selected');
                        setfinalTag('');
                    }
                    else {
                        tag.classList.add('selected');
                        setfinalTag(tag.innerHTML);
                    }
                })
            })
        }
        if (document.getElementsByClassName('tag3') && b2) {
            b2 = false;
            Array.from(document.getElementsByClassName('tag3')).forEach(tag => {
                tag.addEventListener('click', () => {
                    classRemover('tag3', tag);
                    if (Array.from(tag.classList).includes('selected')) {
                        tag.classList.remove('selected');
                        setlocationTag('');
                    }
                    else {
                        tag.classList.add('selected');
                        setlocationTag(tag.innerHTML);
                    }
                })
            })
        }
    }, []);

    useEffect(() => {
        let baseURL = '/api/post/allPost';
        if (finalTag !== '' || locationTag) baseURL += '?'
        if (finalTag !== '') baseURL += `tag=${finalTag}`;
        if (finalTag !== '' && locationTag) baseURL += '&';
        if (locationTag) baseURL += `location=${locationTag}`;
        if (baseURL.includes('?')) {
            baseURL += `&count=${postsCount}` 
        }
        else {
            baseURL += `?count=${postsCount}`
        }
        changeURL(baseURL);
    }, [{ finalTag, locationTag, postsCount }])
    return (
        <div className="main_left_box">
            <h3>Show Feed By Tags:</h3>
            <div className="tags_container">
                <div className="tags">
                    <div className="tag2">Outdoor</div>
                    <div className="tag2">Indoor</div>
                    <div className="tag2">Old-Age</div>
                    <div className="tag2">Money</div>
                    <div className="tag2">Used-Things</div>
                    <div className="tag2">Donation</div>
                    <div className="tag2">Paid</div>
                    <div className="tag2">Urgent</div>
                    <div className="tag2">Child-Care</div>
                    <div className="tag2">Women</div>
                </div>
            </div>
            <h3>Show Feed By Location: </h3>
            <div className="tags_container">
                {data && <div className="tags">
                    {data.area !== '' && <div className="tag3" id="data_area">{data.area}</div>}
                    {data.city !== '' && <div className="tag3" id="data_city">{data.city}</div>}
                    {data.state !== '' && <div className="tag3" id="data_state">{data.state}</div>}
                    {data.country !== '' && <div className="tag3" id="data_country">{data.country}</div>}
                    {data.pincode !== '' && <div className="tag3" id="data_pincode">{data.pincode}</div>}
                    <div className="tag3" id="data_origin">World</div>
                </div>}
            </div>
        </div>
    )
}

export default Leftbox;