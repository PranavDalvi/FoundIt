import { Avatar, Button } from '@mui/material'
import React from 'react'

export const FoundPost = (props) => {

  const imageContainer = {
    display: "flex",
    justifyContent: "center",
  };

  const styleImage = {
    height: "50%",
    width: "50%",
    borderRadius: "10px",
  };

  const userName = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  };

  const spacers = {
    paddingLeft: "20px",
  };

  const formattedDate = new Date(props.foundPost.createdAt.seconds * 1000);


  return (
    <div>
      <div >
          <div style={userName}>
            <Avatar
              alt={`${props.foundPost.firstName} ${props.foundPost.lastName}`}
              src={props.foundPost.userPhoto}
            />
            <span style={spacers}>
              {props.foundPost.firstName} {props.foundPost.lastName}
            </span>
          </div>
          <span>{formattedDate.toString()}</span>
        </div>
        <div>
          <h2>Founder Details</h2>
          <p>First Name: {props.foundPost.firstName}</p>
          <p> Last Name: {props.foundPost.lastName}</p>
        </div>
        <div>
          {props.foundPost.showEmailTextField === true && (
            <div>
            <p>Email: {props.foundPost.email}</p>
            </div>
          )}
          {props.foundPost.showPhoneNo === true && (
            <div>
              <p>Phone No.: {props.foundPost.phoneNo}</p>
            </div>
          )}
        </div>

        <div style={imageContainer}>
          <img style={styleImage} src={props.foundPost.imageURL}/>
        </div>
        <div>
          <p>Object Description: {props.foundPost.objDesc}</p>
        </div>
    </div>
  )
}
