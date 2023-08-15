import React from 'react'
import sadEmote from "./assets/sad-emote.png"

export const SadEmote = () => {

    // Internal Style-sheet
    const loginConatiner = {
        width: "100svh",
        height: "70svh",
        margin: "20px",
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
    }

    const subLoginContainer = {
        width: "50%",
        display: 'flex',
        flexDirection: "column",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    }

    return (
        <div style={loginConatiner}>
            <div style={subLoginContainer}>
                <img src={sadEmote} />
                <p>Oh No! It Seems Empty Here!</p>
            </div>
        </div>
    )
}
