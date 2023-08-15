import React, { useState } from "react";
import { useLocation } from "react-router-dom";
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
import { Checkbox, MenuItem } from "@mui/material";
import { CheckBox } from "@mui/icons-material";
import "./foundFormStyle.scss"

export const FoundForm = () => {
  // Start of Style-sheet
  // End of Style-sheet

  const location = useLocation();
  const { lostPostId } = location.state;

  const { user } = UserAuth();
  console.log(user);
  const names = user.displayName.split(" ");
  const userId = user.uid;
  const userPhoto = user.photoURL;

  const [firstName, setFirstName] = useState(names[0]);
  const [lastName, setLastName] = useState(names[1]);
  const [email, setEmail] = useState(user.email);
  const [phoneNoCode, setPhoneNoCode] = useState("+91");
  const [phoneNo, setPhoneNo] = useState("");
  const [showEmailTextField, setShowEmailTextField] = useState(true);
  const [showPhoneNo, setShowPhoneNo] = useState(false);
  const [objDesc, setObjDesc] = useState("");
  const [lastSeen, setLastSeen] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [progress, setProgress] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [successed, setSuccessed] = useState(false);
  const [error, setError] = useState(null);

  const phoneCodes = [
    {
      label: "IND",
      value: "+91",
    },
    {
      label: "USA",
      value: "+1",
    },
    {
      label: "JPN",
      value: "+81",
    },
    {
      label: "NPL",
      value: "+977",
    },
  ];

  const checkPhoneField = () => {
    if (showPhoneNo === true) {
      if (phoneNo.length === 10) {
        onSubmit()
      } else {
        alert("phone number is not valid")
      }
    } else {
      onSubmit()
    }
  }

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
        const docRef = await addDoc(
          collection(db, `LostPosts/${lostPostId}/FoundPosts`),
          {
            firstName,
            lastName,
            objDesc,
            imageURL,
            userId,
            showEmailTextField,
            showPhoneNo,
            email,
            phoneNo: `${phoneNoCode} ${phoneNo}`,
            userPhoto,
            createdAt,
            isAccepted: false,
          }
        );
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
      const imageRef = ref(storage, `FoundImages/${Date.now()}`);
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
    <>
      <div className="form-container">
        <div>
          <h2 className="h2">Found Form</h2>
        </div>
        <div>
          <h2 className="h2">User Details</h2>
          <div className="styleDivs">
            <TextField
              id="outlined-basic"
              label="First Name"
              variant="outlined"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="userInputStyle"
            />
            <TextField
              id="outlined-basic"
              label="Last Name"
              variant="outlined"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <div>
              <h2 className="h2">Ways to contact you</h2>
              <div>
                <Checkbox
                  onClick={(e) => {
                    setShowEmailTextField(e.target.checked);
                  }}
                  defaultChecked
                />{" "}
                <span>Email</span>
                <Checkbox
                  onClick={(e) => {
                    setShowPhoneNo(e.target.checked);
                  }}
                />
                <span>Phone Number</span>
              </div>
            </div>
            {showEmailTextField === true && (
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
            {showPhoneNo === true && (
              <div className="phoneContactField">
                <div>
                  <TextField
                    id="outlined-select-currency"
                    select
                    label="code"
                    defaultValue="+91"
                    value={phoneNoCode}
                    onChange={(e) => setPhoneNoCode(e.target.value)}
                  >
                    {phoneCodes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label} {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="phoneInputField">
                  <TextField
                    id="outlined-basic"
                    label="Phone Number"
                    variant="outlined"
                    value={phoneNo}
                    required
                    sx={{ width: "100%" }}
                    inputProps={{ pattern: "[0-9]{3}-[0-9]{2}-[0-9]{3}" }}
                    onChange={(e) => setPhoneNo(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <h2 className="h2">Found Object Details</h2>
          <div className="styleDivs">
            <TextField
              id="outlined-basic"
              label="Object Description"
              variant="outlined"
              value={objDesc}
              required
              onChange={(e) => setObjDesc(e.target.value)}
              className="userInputStyle"
            />
            <TextField
              id="outlined-basic"
              label="Is this object same as the user who lost it specified?"
              variant="outlined"
              required
              value={lastSeen}
              onChange={(e) => setLastSeen(e.target.value)}
            />
          </div>
          <div className="userInputStyle">
            <h2 className="h2">Upload Image of the object</h2>
            {imagePreview === null && (
              <div>
                <p>Upload image just to verify that you have the object</p>
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
              </div>
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
                  <Button
                    variant="outlined"
                    onClick={handleImageDelete}
                    className="ImageControlBtn"
                  >
                    <img src={dustbinIcon} />
                  </Button>
                </div>
              </div>
            )}
            {progress !== null && (
              <LinearProgress variant="determinate" value={progress} />
            )}
          </div>
        </div>
        {successed === false && (
          <Button className="uploadBtn" variant="contained" onClick={checkPhoneField}>
            Create Found post
          </Button>
        )}
        {successed === true && error === null && (
          <Alert severity="success">
            Form has been submitted! We will redirect you to home page in
          </Alert>
        )}
        {error !== null && <Alert severity="error">{`${error}`}</Alert>}
      </div>
    </>
  );
};
