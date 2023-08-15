import { Alert, Avatar, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { OpenMap } from "../openMap/OpenMap";

import { UserAuth } from "../../context/AuthContext";

import sendPlaneIcon from "../../assets/send-plane-fill.svg";
import "./posts.scss"

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, createdAt } from "../../../server/firebase";
import { Link } from "react-router-dom";
import { FoundPost } from "../foundPost/FoundPost";

export const Posts = (props) => {
  const { user } = UserAuth();


  const [viewMore, setViewMore] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [foundPosts, setFoundPosts] = useState([]);

  const formattedDate = new Date(props.lostPost.createdAt.seconds * 1000);

  useEffect(() => {
    const collectionRef = collection(db, `LostPosts/${props.postId}/comments`);
    const q = query(collectionRef, orderBy("createdAt", "asc"));
    const data = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    const foundPostRef = collection(db, `LostPosts/${props.postId}/FoundPosts`);
    const foundPostQuery = query(foundPostRef, orderBy("createdAt", "desc"));
    const foundPostData = onSnapshot(foundPostQuery, (snapshot) => {
      setFoundPosts(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
  }, []);

  const handleAddComment = async () => {
    const userId = user.uid;
    const userName = user.displayName;
    console.log(userId);
    if (newComment == "") {
      alert("Required fields should now be Null");
    } else {
      try {
        const docRef = await addDoc(
          collection(db, `LostPosts/${props.postId}/comments`),
          {
            comment: newComment,
            userId,
            userName,
            createdAt,
          }
        );
      } catch (e) {
        alert(e);
      }
      setNewComment("");
    }
  };

  const handleViewInMaps = () => {
    window.open(
      `https://maps.google.com?q=${props.lostPost.lat},${props.lostPost.lng} `,
      "_blank"
    );
  };

  const handleAcceptFound = (foundPostId) => {
    console.log(foundPostId);
    try {
      updateDoc(doc(db, `LostPosts/${props.postId}/FoundPosts`, foundPostId), {
        isAccepted: true,
      });
    } catch (e) {
      alert("Error updating document: ", e);
    }
    try {
      const lostPostId = props.postId;
      updateDoc(doc(db, `LostPosts/`, lostPostId), {
        isPostOpen: false,
      });
    } catch (e) {
      alert("Error updating document: ", e);
    }
  };

  return (
    <div>
      <div className="mainContainer">
        <div className="postHeader">
          <div className="userName">
            <Avatar
              alt={`${props.lostPost.firstName} ${props.lostPost.lastName}`}
              src={props.lostPost.userPhoto}
            />
            <span className="spacers">
              {props.lostPost.firstName} {props.lostPost.lastName}
            </span>
          </div>
          <span>{formattedDate.toString()}</span>
        </div>
        <div className="imageContainer">
          <img className="styleImage" src={props.lostPost.imageURL} />
        </div>
        <div className="postFooter">
          <div>
            <h3>Description:</h3>
            <p className="wordBreak">{props.lostPost.objDesc}</p>
          </div>
          <div>
            {viewMore === true && (
              <div>
                <h3>GeoLocation:</h3>
                <OpenMap
                  lat={props.lostPost.lat}
                  lng={props.lostPost.lng}
                  lastSeen={props.lostPost.lastSeen}
                />
                <div className="imageContainer">
                  <Button variant="contained" onClick={handleViewInMaps}>
                    View in Google Maps
                  </Button>
                </div>
                <div>
                  <h3>Last Seen At: </h3>
                  <p className="wordBreak">{props.lostPost.lastSeen}</p>
                </div>
              </div>
            )}
            {viewMore === false ? (
              <Button
                variant="text"
                onClick={() => {
                  setViewMore(true);
                }}
              >
                View More
              </Button>
            ) : (
              <Button
                variant="text"
                onClick={() => {
                  setViewMore(false);
                }}
              >
                View Less
              </Button>
            )}
          </div>
          <div>
            <h3>Comments:</h3>
            <div className="commentsWindow">
              {comments.map((comment) => (
                <div key={comment.id}>
                  <p className="wordBreak">
                    {comment.userName}: {comment.comment}
                  </p>
                </div>
              ))}
            </div>

            {user !== null ? (
              <div className="commentTextField">
                <TextField
                  id="standard-basic"
                  label="Comment"
                  variant="standard"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={{ width: "100%" }}
                />
                <Button variant="Text" onClick={handleAddComment}>
                  <img src={sendPlaneIcon} />
                </Button>
              </div>
            ) : (
              <span>Sign in to add comments</span>
            )}
          </div>
          <div className="spacerBottom"></div>
          <div>
            {props.lostPost.isPostOpen === true && (
              <>
              {user !== null ? (
              <Link to="/foundform" state={{ lostPostId: props.postId }}>
                Foundit
              </Link>
              ):(
                <span>Login to file found form</span>
              )}
              </>
            )}
            {props.lostPost.isPostOpen === false && (
              <Alert severity="success">This case has been solved!</Alert>
            )}
          </div>
        </div>
      </div>
      {foundPosts.map((foundPost) => (
        <div key={foundPost.id}>
          {user !== null && (
            <>
              {user.uid === props.lostPost.userId && (
                <div className="foundPostContainer">
                  <FoundPost foundPostId={foundPost.id} foundPost={foundPost} />
                  <div>
                    {foundPost.isAccepted === false && (
                      <Button
                        variant="contained"
                        onClick={() => handleAcceptFound(foundPost.id)}
                      >
                        Is this the Object you have lost?
                      </Button>
                    )}
                    {foundPost.isAccepted === true && (
                      <Alert severity="success">
                        This is selected Found Post
                      </Alert>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
          {user !== null && (
            <>
              {user.uid === foundPost.userId && (
                <div className="foundPostContainer">
                  <FoundPost foundPostId={foundPost.id} foundPost={foundPost} />
                  {foundPost.isAccepted === true && (
                    <Alert severity="success">
                      This is selected Found Post
                    </Alert>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};
