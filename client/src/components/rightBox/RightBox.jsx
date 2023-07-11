import { useEffect, useState } from "react";
import './RightBox.css'
import axios from "axios";
import { errorNotify } from "../toast/toast";
import { Link } from "react-router-dom";

const RightBox = () => {
    useEffect(() => {
        let body = document.getElementById('rightBox');
        document.querySelector('.field').addEventListener('focus', () => {
            body.classList.add('is-focus');
        })
        document.querySelector('.field').addEventListener('blur', () => {
            if (document.getElementsByClassName('search-item')[0].innerHTML === '') {
                body.classList.remove('is-type');
                body.classList.remove('is-focus');
            }
        })
    }, [])
    const [searchText, setSearchText] = useState('');
    const [searchedPeople, setSearchedPeople] = useState([]);
    const fetchResult = async () => {
        try {
            if (searchText !== '') {
                let response = await axios.get(`api/user/search?q=${searchText}`);
                let data = response.data; 
                document.getElementById('rightBox').classList.remove('is-type');
                setSearchedPeople(data);
            }
        } catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong");
        }
    }
    const [id, setid] = useState(0);
    const loader = () => {
        clearTimeout(id);
        setid(setTimeout(fetchResult, 2000))
    }

    useEffect(() => {
        document.getElementById('rightBox').classList.add('is-type');
        if (searchText === '') {
            document.getElementById('rightBox').classList.remove('is-type');
        }
        loader();
    }, [searchText]);

    return (
        <div id="rightBox">
            <div className="searchInput">
                <fieldset className="field-container">
                    <input type="text" onKeyUp={(e) => { setSearchText(e.target.value) }} placeholder="Search..." className="field" />
                    <div className="icons-container">
                        <div className="icon-search"></div>
                        <div className="icon-close">
                            <div className="x-up"></div>
                            <div className="x-down"></div>
                        </div>
                    </div>
                    <div className="search-item">
                        {
                            (searchedPeople.map(people => (
                                <Link to={`/profile/${people.email}`}>
                                    <img src={people.img} alt="" />
                                    {people.username}
                                </Link>
                            )))
                        }

                    </div>
                </fieldset>
            </div >
            <div className="title-container">
                <h1 className="title">Type to Search...</h1>
                <h1 className="title-down">Searching...</h1>
            </div>
        </div >
    )
}
export default RightBox