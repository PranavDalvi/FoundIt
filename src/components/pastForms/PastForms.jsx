import React, { useEffect, useState } from "react";
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    where,
} from "firebase/firestore";
import { db } from "../../../server/firebase";
import { Posts } from "../posts/Posts";

import { UserAuth } from "../../context/AuthContext";
import { SadEmote } from "../sadEmote/SadEmote";

export const PastForms = () => {

    const { user } = UserAuth();

    const [lostPosts, setLostPosts] = useState([]);

    useEffect(() => {
        const collectionRef = collection(db, `LostPosts`);
        const q = query(collectionRef, orderBy("createdAt", "desc"), where("userId", "==", user.uid));
        const data = onSnapshot(q, (snapshot) => {
            setLostPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
    }, []);

    return (
        <div>
            {lostPosts.length === 0 ? (
                <div style={{display:"flex", justifyContent: "center"}}>
                <SadEmote />
                </div>
            ) : (
                <>
                    {lostPosts.map((lostPost) => (
                        <div key={lostPost.id}>
                            <Posts postId={lostPost.id} lostPost={lostPost} />
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}
