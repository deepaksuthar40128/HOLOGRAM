import { useContext, useEffect, useRef, useState } from "react";
import Header from "../../components/header/Header";
import Feed from "../../components/feed/Feed";
import Post from "../../components/post/Post";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Leftbox from "../../components/leftbox/Leftbox";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSpinner } from "@fortawesome/free-solid-svg-icons";
import CustomMenu from "../../components/customMenu/CustomMenu";
import './Home.css'
import RightBox from "../../components/rightBox/RightBox";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [searchURL, setSearchURL] = useState('')
    const [postsCount, setPostCount] = useState(1);
    const flag = useRef(false);
    const navigate = useNavigate();
    const getPosts = async () => {
        try {
            let data = await axios.get(searchURL);
            data = data.data;
            if (data.length) {
                flag.current = false;
                let nposts = [...posts, ...data];
                setPosts(nposts);
            }
            else {
                document.getElementById('lbtn').innerHTML = ` <div >
                    <div class = "post">
                        <div className="postWrapper"> 
                            <div style="text-align:center" className="postCenter">
                            <div style="font-size:20px; padding-top:10px" className="postText">No More Posts </div>
                            <img  className="postImg" src='./img/postend.jpg' alt="" />
                        </div>
                            <hr />
                            <div className="like_comments">
                                <div className="like_number" ><FontAwesomeIcon icon={faHeart} /> <span className="animated-background" ><div class="background-masker btn-divide-left"></div></span></div>
                                <div className="comment_number"><span className="animated-background" ><div class="background-masker btn-divide-left"></div></span></div>
                            </div>
                        </div>
                                                    </div >
                                                </div >
                                            </div> `
            }
        } catch (err) {
            navigate('/login');
        }
    }
    const { user } = useContext(AuthContext);
    useEffect(() => {
        if (searchURL !== '') {
            if (postsCount == 1) {
                setPosts([]);
            }
            getPosts();
        }
    }, [searchURL])

    const loadMore = () => { console.log("me"); setPostCount(postsCount => postsCount + 1) }

    const isElementInView = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
    }, [])


    const handleScroll = () => {
        console.log("hello");
        let ele = document.getElementById('lbtn');
        if (!flag.current && ele && isElementInView(document.getElementById('lbtn'))) {
            flag.current = true;
            loadMore();
        }
    };

    // const handleScroll = () => {
    //     if (!flag && isElementInView(document.getElementById('llbtn'))) {
    //         setflag(flag => !flag);
    //         loadMore();
    //     }
    // }





    return (
        <div>
            <Header mode={"Home"} />
            <CustomMenu />
            <Feed />
            {user && <Leftbox data={user} changeURL={setSearchURL} postsCount={postsCount} />}
            <RightBox />
            {
                posts ?
                    (
                        <>
                            {
                                posts.length > 0 ?
                                    (<>
                                        {
                                            posts.map(post => (<Post data={post} />))
                                        }

                                        <div>
                                            {/* <button style={{ margin: "10px" }} onClick={loadMore}>hello</button> */}
                                            <div id="lbtn" className="mydiv">
                                                <div >
                                                    <div className="post">
                                                        <div className="postWrapper">
                                                            <div className="postTop">
                                                                <div className="postTopLeft">
                                                                    <span className="animated-background"><div class="background-masker btn-divide-left"></div></span>
                                                                    <div className="div_post_left">
                                                                        <span style={{ marginBottom: "5px" }} className="postUsername animated-background"><div class="background-masker btn-divide-left"></div> </span>
                                                                        <span style={{ marginTop: "5px" }} className="animated-background"> <div class="background-masker btn-divide-left"></div></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="postCenter">
                                                                <span className="postText animated-background"><div class="background-masker btn-divide-left"></div> </span>
                                                                <span style={{ height: "400px", display: "block" }} className="animated-background" ><div class="background-masker btn-divide-left"></div></span>
                                                            </div>
                                                            <hr />
                                                            <div className="like_comments">
                                                                <div className="like_number" ><FontAwesomeIcon icon={faHeart} /> <span className="animated-background" ><div class="background-masker btn-divide-left"></div></span></div>
                                                                <div className="comment_number"><span className="animated-background" ><div class="background-masker btn-divide-left"></div></span></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div >
                                        </div>
                                    </>
                                    )
                                    : (<div>No Posts</div>)
                            }
                        </>

                    )
                    : (<div className="mydiv" style={{ display: "flex", justifyContent: "center" }}><div className="Loader_icon"><FontAwesomeIcon icon={faSpinner} /></div></div>)
            }
        </div>
    )
}

export default Home;