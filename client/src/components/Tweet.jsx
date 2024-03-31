import "../css/tweet.css";
import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useSelector } from "react-redux";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./Spinner";
import Base_URL from "../utils";

const Tweet = ({ tweet, setData }) => {
  //to deal with reply modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //state to handle spinner
  const [loading, setLoading] = useState(false);

  //delete tweet modal
  const [showDelete, setShowDelete] = useState(false);

  const handleCloseDelete = () => setShowDelete(false);

  const handleShowDelete = (e) => {
    e.preventDefault();
    setShowDelete(true);
  };

  const { currentUser } = useSelector((state) => state.user);

  const [userData, setUserData] = useState(null);

  const config = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };

  const [PictureToShow, setPictureToShow] = useState(null);
  //now get the profile picture of the tweet authors
  const getProfilePicture = async () => {
    if (
      userData &&
      !userData.Profile_Picture.includes(
        "https://1fid.com/wp-content/uploads/2022/06/no-profile-picture-4-1024x1024.jpg"
      )
    ) {
      const picture = `https://res.cloudinary.com/dvjyewvk5/image/upload/v1708415521/${userData.Profile_Picture}.jpg`;
      setPictureToShow(picture);
    }
  };
  useEffect(() => {
    if (userData && userData.Profile_Picture) {
      getProfilePicture();
    }
  }, [userData]);

  //logic to show the tweet images if they have

  const [TweetImage, setTweetImage] = useState(null);

  const getTweetImage = async () => {
    if (tweet.Image) {
      const picture = `https://res.cloudinary.com/dvjyewvk5/image/upload/v1708415521/${tweet.Image}.jpg`;
      setTweetImage(picture);
    }
  };

  useEffect(() => {
    if (tweet.Image) {
      getTweetImage();
    }
  }, [tweet.Image]);

  //initialize useNavigate hook
  const navigate = useNavigate();

  //state to handle the reply
  const [Content, setContent] = useState("");

  //initiate useLocation hook
  const location = useLocation().pathname;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (tweet && tweet.TweetedBy._id) {
          const findUser = await axios.get(
            `${Base_URL}/api/user/${tweet?.TweetedBy?._id}`,
            {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }
          );
          setUserData(findUser.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [tweet.TweetedBy._id, tweet.Replies, tweet.RetweetBy, tweet.Image]);

  const handleLikeUnlike = async (e) => {
    e.preventDefault();

    //if likes have user's like , we will unlike it
    if (tweet.Likes.includes(currentUser._id)) {
      try {
        setLoading(true);
        const unlike = await axios.post(
          `${Base_URL}/api/tweet/${tweet._id}/dislike`,
          {},
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        notifyTweetUnliked();

        //now get the tweets again according to the page
        if (location.includes("/home")) {
          const newData = await axios.get(`${Base_URL}/api/tweet`, config);

          setData(newData.data);
        } else if (location.includes("/my-profile")) {
          const newData = await axios.get(
            `${Base_URL}/api/tweet/tweets/user/${currentUser._id}`,
            config
          );

          setData(newData.data);
        } else if (location.includes("/user-profile/")) {
          const newData = await axios.get(
            `${Base_URL}/api/tweet/tweets/user/${tweet.TweetedBy._id}`,
            config
          );

          setData(newData.data);
        } else if (location.includes("/tweet")) {
          const newData = await axios.get(
            `${Base_URL}/api/tweet/${tweet._id}`,
            config
          );

          setData([newData.data]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const like = await axios.post(
          `${Base_URL}/api/tweet/${tweet._id}/like`,
          {},
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        notifyTweetLiked();

        //now get the tweets again according to the page
        if (location.includes("/home")) {
          const newData = await axios.get(`${Base_URL}/api/tweet`, config);

          setData(newData.data);
        } else if (location.includes("/my-profile")) {
          const newData = await axios.get(
            `${Base_URL}/api/tweet/tweets/user/${currentUser._id}`,
            config
          );

          setData(newData.data);
        } else if (location.includes("/user-profile/")) {
          const newData = await axios.get(
            `${Base_URL}/api/tweet/tweets/user/${tweet.TweetedBy._id}`,
            config
          );

          setData(newData.data);
        } else if (location.includes("/tweet")) {
          const newData = await axios.get(
            `${Base_URL}/api/tweet/${tweet._id}`,
            config
          );

          setData([newData.data]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteTweet = async (e) => {
    handleCloseDelete();

    try {
      setLoading(true);
      const deleteTweet = await axios.delete(
        `${Base_URL}/api/tweet/${tweet._id}`,
        config
      );

      notifyTweetDeleted();
      //now get the tweets again according to the page

      if (location.includes("/home")) {
        const newData = await axios.get(`${Base_URL}/api/tweet`, config);

        setData(newData.data);
      } else if (location.includes("/my-profile")) {
        const newData = await axios.get(
          `${Base_URL}/api/tweet/tweets/user/${currentUser._id}`,
          config
        );

        setData(newData.data);
      } else if (location.includes("/tweet")) {
        const newData = await axios.get(
          `${Base_URL}/api/tweet/${tweet._id}`,
          config
        );

        setData([newData.data]);
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //function to retweet a tweet and also undo it

  const handleRetweet = async (e) => {
    e.preventDefault();

    try {
      if (!tweet.RetweetBy.includes(currentUser._id)) {
        const retweetTweet = await axios.post(
          `${Base_URL}/api/tweet/${tweet._id}/retweet`,
          {},
          config
        );
        notifyTweetRetweeted();

        //now get the tweets again according to the page
        if (location.includes("/home")) {
          const newData = await axios.get(`${Base_URL}/api/tweet`, config);

          setData(newData.data);
        } else if (location.includes("/my-profile")) {
          const newData = await axios.get(
            `${Base_URL}/api/tweet/tweets/user/${currentUser._id}`,
            config
          );

          setData(newData.data);
        } else if (location.includes("/user-profile/")) {
          const newData = await axios.get(
            `${Base_URL}/api/tweet/tweets/user/${tweet.TweetedBy._id}`,
            config
          );

          setData(newData.data);
        } else if (location.includes("/tweet")) {
          const newData = await axios.get(
            `${Base_URL}/api/tweet/${tweet._id}`,
            config
          );

          setData([newData.data]);
        }
      } else {
        const undoretweetTweet = await axios.post(
          `${Base_URL}/api/tweet/${tweet._id}/undort`,
          {},
          config
        );

        notifyTweetUndoRetweeted();
        //now get the tweets again according to the page
        if (location.includes("/home")) {
          const newData = await axios.get(`${Base_URL}/api/tweet`, config);

          setData(newData.data);
        } else if (location.includes("/my-profile")) {
          const newData = await axios.get(
            `${Base_URL}/api/tweet/tweets/user/${currentUser._id}`,
            config
          );

          setData(newData.data);
        } else if (location.includes("/user-profile/")) {
          const newData = await axios.get(
            `${Base_URL}/api/tweet/tweets/user/${tweet.TweetedBy._id}`,
            config
          );

          setData(newData.data);
        } else if (location.includes("/tweet")) {
          const newData = await axios.get(
            `${Base_URL}/api/tweet/${tweet._id}`,
            config
          );

          setData([newData.data]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleRetweet;
  }, [tweet.RetweetBy]);

  //logic to find the Name of user who retweeted the tweet, to keep things simple, we will only just return the information of first user who has retweeted the tweet

  const [userRetweeted, setuserRetweeted] = useState(null);

  useEffect(() => {
    if (tweet.RetweetBy.length > 0) {
      const userIDRT = tweet.RetweetBy[0];

      //now get the information from server
      const getUserWhoRted = async (e) => {
        try {
          const findUser = await axios.get(
            `${Base_URL}/api/user/${userIDRT}`,
            config
          );

          setuserRetweeted(findUser.data);
        } catch (error) {
          console.log(error);
        }
      };
      getUserWhoRted();
    }
  }, [tweet.RetweetBy]);

  //notification if tweet gets deleted
  const notifyTweetDeleted = () =>
    toast.success("Tweet Deleted Successfully!", {
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  //notification if user RT a tweet
  const notifyTweetRetweeted = () =>
    toast.success("Tweet Retweeted Successfully!", {
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  //notofication if user undo RT a tweet
  const notifyTweetUndoRetweeted = () =>
    toast.success("Undo Retweet Successful!", {
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  //notification if user likes a tweet
  const notifyTweetLiked = () =>
    toast.success("Liked tweet", {
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  //notification if user unlikes a tweet
  const notifyTweetUnliked = () =>
    toast.success("Unliked tweet", {
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  //notification if user replies
  const notifyReply = () =>
    toast.success("Replied successfully", {
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  //function to reply to a tweet
  const handleReply = async (e) => {
    e.preventDefault();
    setLoading(true);
    const reply = await axios.post(
      `${Base_URL}/api/tweet/${tweet._id}/reply`,
      { Content },
      config
    );
    notifyReply();
    setContent("");

    //now get the tweets again according to the page
    if (location.includes("/home")) {
      const newData = await axios.get(`${Base_URL}/api/tweet`, config);

      setData(newData.data);
    } else if (location.includes("/my-profile")) {
      const newData = await axios.get(
        `${Base_URL}/api/tweet/tweets/user/${currentUser._id}`,
        config
      );

      setData(newData.data);
    } else if (location.includes("/user-profile/")) {
      const newData = await axios.get(
        `${Base_URL}/api/tweet/tweets/user/${tweet.TweetedBy._id}`,
        config
      );

      setData(newData.data);
    } else if (location.includes("/tweet")) {
      const newData = await axios.get(
        `${Base_URL}/api/tweet/${tweet._id}`,
        config
      );

      setData([newData.data]);
    }
    setLoading(false);
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {userData && (
        <>
          <>
            <div className="card tweet-card p-1">
              <div className="card-body">
                {/* for showing who has retweeted the tweet */}

                {tweet.RetweetBy.length > 0 && userRetweeted && (
                  <div className="row">
                    <div className="col-12">
                      <span className="text-muted d-flex justify-content-center">
                        <span>
                          <i className="fa-solid fa-retweet text-muted"></i>
                        </span>{" "}
                        {`Retweeted by ${userRetweeted.Name}`}
                      </span>
                    </div>
                  </div>
                )}

                {/* for displaying username */}
                <div className="row mt-2">
                  <div className="col-12">
                    <span className="ms-1">
                      {PictureToShow ? (
                        <img
                          src={PictureToShow}
                          className="img-fluid tweet-profile-pic "
                        />
                      ) : (
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR82DN9JU-hbIhhkPR-AX8KiYzA4fBMVwjLAG82fz7GLg&s"
                          className="img-fluid tweet-profile-pic "
                        />
                      )}
                    </span>

                    <span className="ms-2">
                      {tweet.TweetedBy._id !== currentUser._id ? (
                        <span>
                          <Link
                            to={`/user-profile/${tweet.TweetedBy._id}`}
                            className="username-mentioned"
                          >
                            <span>@{userData.Username}</span>
                          </Link>
                        </span>
                      ) : (
                        <span>
                          <Link to="/my-profile" className="username-mentioned">
                            <span>@{userData.Username}</span>
                          </Link>
                        </span>
                      )}
                    </span>
                    <span className="ms-2">
                      -
                      <span className="text-muted ms-1">
                        {format(new Date(tweet.createdAt), "EE MMM dd yyyy")}
                      </span>
                    </span>
                    {/* for deleting the tweet */}
                    {tweet.TweetedBy._id == currentUser._id && (
                      <span>
                        <button
                          className="btn btn-light float-end me-2"
                          onClick={handleShowDelete}
                        >
                          <i
                            className="fa-solid fa-trash-can"
                            onClick={handleShowDelete}
                          />
                        </button>
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  to={`/tweet/${tweet._id}`}
                  className="text-decoration-none text-black"
                >
                  {/* for showing tweetcontent */}
                  <div className="row p-0">
                    <div className="col-12 d-flex justify-content-start p-0 align-items-end">
                      <p className="tweet-content">{tweet.Content}</p>
                    </div>
                  </div>

                  {/* for image */}
                  {TweetImage && (
                    <div className="row mb-3">
                      <div className="col-12 d-flex justify-content-center">
                        <img src={TweetImage} className="img-fluid p-2" />
                      </div>
                    </div>
                  )}
                </Link>

                {/* for like,rt buttons */}
                <div className="row">
                  <div className="col-12">
                    <div className="ms-5">
                      <span
                        className="mx-3 like-button"
                        style={{ cursor: "pointer" }}
                        onClick={handleLikeUnlike}
                      >
                        {tweet.Likes.includes(currentUser._id) ? (
                          <i className="fa-solid fa-heart"></i>
                        ) : (
                          <i className="fa-regular fa-heart"></i>
                        )}
                        <span className="ms-1">{tweet.Likes.length}</span>
                      </span>

                      <span
                        className="mx-3 comment-button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleShow();
                        }}
                      >
                        <i className="fa-regular fa-comment"></i>
                        <span className="ms-1">{tweet.Replies.length}</span>
                        {/* if replies length > 0 it should show replay 1-2 comments or if more than 3 then it will show load more */}
                      </span>
                      <span
                        className="mx-3 retweet-button"
                        onClick={handleRetweet}
                      >
                        {tweet.RetweetBy.includes(currentUser._id) ? (
                          <i className="fa-solid fa-retweet"></i>
                        ) : (
                          <i className="fa-solid fa-retweet text-muted"></i>
                        )}
                        <span className="ms-1">{tweet.RetweetBy.length}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>

          {/* Reply Modal */}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Tweet your reply</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleReply} id="handleReply">
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Add your reply"
                  value={Content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={handleClose}
                type="submit"
                form="handleReply"
              >
                Reply
              </Button>
            </Modal.Footer>
          </Modal>

          {/* delete tweet modal */}
          <Modal
            show={showDelete}
            onHide={handleCloseDelete}
            animation={false}
            size="sm"
          >
            <Modal.Body>
              <strong>Are you sure you want to delete the tweet?</strong>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDelete}>
                No
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleDeleteTweet();
                  location.includes("tweet") && navigate(-1);
                }}
              >
                Yes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default Tweet;
