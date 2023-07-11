import { Link } from "react-router-dom";
import "./Post.css"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faEllipsis, faHeart, faMessage, faPaperPlane, faShare, faSpinner, faThumbTack, faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { errorNotify, successNotify, warningNotify } from "../toast/toast";
import Comment from "../comment/Comment";
import { createAndDownloadFile, imgDownload, newWindowPost } from "../../utils/fileDownload";
const Post = ({ data }) => {
    const { user } = useContext(AuthContext);
    const [openContact, setContact] = useState(null);
    const [taskComplete, setTaskComplete] = useState(null);
    const handleClick = () => {
        setContact({
            email: data.email,
            postId: data._id,
            text: '',
        })
    }
    const handleSubmit = async () => {
        try {
            await axios.post('/api/chat/sharePost', openContact);
            successNotify("Shared Successfully!");
            setContact(null);
        } catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong")
        }
    }
    const [post_like, setPost_like] = useState(data.user_like);
    const handle_like = async () => {
        setPost_like(!post_like);
        await axios.get(`/api/post/like/${data._id}`);
    }
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(null);
    const fetchComments = async () => {
        try {
            let res = await axios.get(`/api/post/comments/${data._id}`);
            setComments(res.data);
        } catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong")
        }
    }
    useEffect(() => {
        if (showComments) {
            fetchComments();
        }
    }, [showComments])
    const [newComment, setNewComment] = useState('');
    const addComment = async () => {
        if (newComment != '') {
            console.log(newComment);
            try {
                await axios.post(`/api/post/addComment/${data._id}`, { comment: newComment })
                setNewComment('');
                successNotify("Commented Successfully!");
            } catch (err) {
                console.log(err);
                errorNotify(err.response.data.message || "Something went Wrong")
            }
        } else {
            warningNotify("Write Something to Comment!");
        }
    }
    const [viewStyle, changeViewStyle] = useState("contain");
    const downloadJson = () => {
        createAndDownloadFile(data, `${data.email}-postData.json`);
        // imgDownload(document.getElementById(data._id), "hello.jpg");
    }
    const deletePost = async (id) => {
        let ele = document.getElementById(id);
        try {
            await axios.get(`/api/post/deletePost/${id}`);
            ele.remove();
            successNotify("Post Deleted!");
        } catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong")
        }
    }
    return (
        <div className="mydiv">
            <div id={data._id} >
                <div className="post">
                    <div className="postWrapper">
                        <div className="postTop">
                            <Link to={`/profile/${data.email}`}>
                                <div className="postTopLeft"><img className="postProfileImg"
                                    src={data.userprofile ? data.userprofile : '/img/dummy_user.jpg'}
                                    alt={data.username} />
                                    <div className="div_post_left">
                                        <span className="postUsername">{data.email === user.email ? "You" : data.username}</span>
                                        <div className="time">{data.createdAt}</div>
                                    </div>
                                </div>
                            </Link>
                            <div className="post_menu">
                                <FontAwesomeIcon icon={faEllipsis} />
                                <div className="menu">
                                    <ul className="menu-list">
                                        <Link to={`/profile/${data.email}`}>
                                            <li className="menu-item"><button className="menu-button">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke-width="0.5" class="bi bi-person" viewBox="0 0 16 16">
                                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                                                </svg>
                                                <span>User Profile</span>

                                            </button></li>
                                        </Link>
                                    </ul>


                                    <ul className="menu-list">
                                        <li className="menu-item"><button onClick={() => { window.location.reload() }} className="menu-button">
                                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" className="css-i6dzq1"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>

                                            <span>Reload tab </span>
                                            <span>CTRL+R</span>
                                        </button></li>

                                        <li className="menu-item"><button onClick={() => { viewStyle === "cover" ? changeViewStyle('contain') : changeViewStyle("cover") }} className="menu-button">
                                            <svg xmlns="http://www.w3.org/2000/svg" stroke-width="0.5" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                            </svg>
                                            <span>Change View Style </span>

                                        </button></li>
                                        <li className="menu-item"><button onClick={downloadJson} className="menu-button">
                                            <svg xmlns="http://www.w3.org/2000/svg" stroke-width="0.5" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
                                            </svg>
                                            <span>Download Post Data</span>

                                        </button></li>

                                    </ul>
                                    <ul className="menu-list">
                                        <li className="menu-item"><button onClick={() => { newWindowPost(data._id) }} className="menu-button">
                                            <svg ></svg>
                                            <span>Open In new tab</span>
                                        </button></li>
                                        {data.email === user.email && <li className="menu-item"><button className="menu-button" onClick={() => { deletePost(data._id) }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" stroke-width="0.5" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                            </svg>

                                            <span>Delete Post</span>
                                        </button></li>}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="postCenter"><span className="postText">{data.text} </span><img style={{ objectFit: viewStyle }} className="postImg"
                            src={data.photo}
                            alt="" />
                        </div>
                        <hr />
                        <div className="like_comments">
                            <div className="like_number" ><FontAwesomeIcon icon={faHeart} />{(data.likes ? data.likes : 0) - data.user_like + post_like} Likes</div>
                            <div className="comment_number">{data.comments} Comments</div>
                        </div>
                        <hr className="post_hr" />
                        <div className="postBottom">
                            <div className={post_like ? "btns liked" : "btns disliked"}> <FontAwesomeIcon icon={faHeart} /> <span onClick={handle_like} >Like</span> </div>
                            <div className="btns" onClick={() => { setShowComments(!showComments) }}><FontAwesomeIcon icon={faComments} />Comment</div>
                            <div className="btns">
                                {openContact ? (
                                    <div>
                                        <button >
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                        <div className="share_input_box">
                                            <input onChange={(e) => { setContact({ ...openContact, email: e.target.value }) }} type="email" name="email" id="email" placeholder="Enter Email of recevier" />
                                            <br />
                                            <input onChange={(e) => { setContact({ ...openContact, "text": e.target.value }) }} type="text" name="text_msz" id="text_msz" placeholder="Enter Message..." />
                                        </div>
                                        <button type="submit" onClick={handleSubmit}>
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                        </button>
                                    </div>) : (
                                    <div onClick={handleClick}>
                                        < FontAwesomeIcon icon={faShare} />Share
                                    </div>)}
                            </div>
                        </div>
                    </div>
                    {showComments &&
                        <div className="comments">
                            <div>
                                {
                                    comments ?
                                        (
                                            comments.map(comment => (
                                                <Comment data={comment} />
                                            ))
                                        ) : <div className="Loader_icon" style={{ margin: "auto", width: "max-content" }}><FontAwesomeIcon icon={faSpinner} /></div>
                                }
                            </div>
                            <div className="addComment">
                                <Link to={`/profile/${data.email}`}>
                                    <img className="postProfileImg"
                                        src={user.img ? user.img : '/img/dummy_user.jpg'}
                                        alt="img" />
                                </Link>
                                <input type="text" value={newComment} onChange={(e) => { setNewComment(e.target.value) }} name="comment" placeholder="Write Comment..." />
                                <button onClick={addComment} className="addCommentBtn">Add</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div >
    );
}

export default Post;