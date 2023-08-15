import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";

import { db, storage, createdAt } from "../../../server/firebase";
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { UserAuth } from "../../context/AuthContext";

import imageAddIcon from "../../assets/image-add-fill.svg";
import cloudUploadIcon from "../../assets/upload-cloud-2-fill.svg";
import dustbinIcon from "../../assets/delete-bin-5-fill.svg";

import "./lostForm.scss"

export const LostForm = (props) => {

  const { user } = UserAuth();
  const names = user.displayName.split(" ");
  const userId = user.uid;
  const userEmail = user.email;
  const userPhoto = user.photoURL;

  const [firstName, setFirstName] = useState(names[0]);
  const [lastName, setLastName] = useState(names[1]);
  const [objDesc, setObjDesc] = useState("");
  const [lastSeen, setLastSeen] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [progress, setProgress] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [successed, setSuccessed] = useState(false);
  const [error, setError] = useState(null);

  // Defining Props
  const lat = props.lat;
  const lng = props.lng;

  const onSubmit = async () => {
    if (
      firstName == "" ||
      lastName == "" ||
      objDesc == "" ||
      lastSeen == "" ||
      imageURL == null
    ) {
      alert("Required fields should not be Null");
    } else {
      try {
        const docRef = await addDoc(collection(db, `LostPosts`), {
          firstName,
          lastName,
          objDesc,
          lastSeen,
          lat,
          lng,
          imageURL,
          userId,
          userEmail,
          userPhoto,
          createdAt,
          isPostOpen: true,
        });
      } catch (e) {
        setError(e);
      }
      setSuccessed(true);
    }
  };

  const handleImageUpload = () => {
    if (image == null) {
      alert("Required fields should not be Null");
    } else {
      const imageRef = ref(storage, `LostImages/${Date.now()}`);
      const uploadTask = uploadBytesResumable(imageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (e) => {
          setError(e);
        },
        () => {
          getDownloadURL(uploadTask?.snapshot?.ref).then((downloadURL) => {
            setImageURL(downloadURL);
            setImage(null);
            setProgress(null);
          });
        }
      );
    }
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    setImage(file);
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
  };

  const handleImageDelete = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
      <div className="lostFormWindow">
        <div>
          <h2 className="h2">User Details</h2>
          <div className="styleDivs">
            <TextField
              id="outlined-basic"
              label="First Name"
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="userInputStyle"
            />
            <TextField
              id="outlined-basic"
              label="Last Name"
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div>
          <h2 className="h2">Lost Object Details</h2>
          <div className="styleDivs">
            <TextField
              id="outlined-basic"
              label="Object Description"
              variant="outlined"
              value={objDesc}
              onChange={(e) => setObjDesc(e.target.value)}
              className="userInputStyle"
            />
            <TextField
              id="outlined-basic"
              label="Last seen at"
              variant="outlined"
              value={lastSeen}
              onChange={(e) => setLastSeen(e.target.value)}
            />
          </div>
          <div className="userInputStyle">
            <h2 className="h2">Upload Image of the object</h2>
            {imagePreview === null && (
              <Button variant="outlined" component="label" className="uploadBtn">
                <img src={imageAddIcon} />
                <input
                  hidden
                  accept="image/*"
                  multiple
                  type="file"
                  onChange={handleImagePreview}
                />
              </Button>
            )}
            {imagePreview !== null && (
              <div className="alignDivToCenter">
                <img className="imageStyle" src={imagePreview} />
              </div>
            )}
            {image !== null && (
              <div>
                <div className="alignDivToCenter">
                  <Button
                    variant="outlined"
                    className="ImageControlBtn"
                    onClick={handleImageUpload}
                  >
                    <img src={cloudUploadIcon} />
                  </Button>
                  <div style={{ paddingLeft: "10px" }}>
                    <Button
                      variant="outlined"
                      onClick={handleImageDelete}
                      className="ImageControlBtn"
                    >
                      <img src={dustbinIcon} />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {progress !== null && (
              <LinearProgress variant="determinate" value={progress} />
            )}
          </div>
        </div>
        {successed === false && (
          <Button className="uploadBtn" variant="contained" onClick={onSubmit}>
            Create Lost post
          </Button>
        )}
        {successed === true && error === null && (
          <Alert severity="success">
            Form has been submitted! We will redirect you to home page in
          </Alert>
        )}
        {error !== null && <Alert severity="error">{`${error}`}</Alert>}
      </div>
  );
};
