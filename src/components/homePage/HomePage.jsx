import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../../server/firebase";
import { Posts } from "../posts/Posts";
import { SadEmote } from "../sadEmote/SadEmote";

export const HomePage = () => {

  const [lostPosts, setLostPosts] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, `LostPosts`);
    const q = query(collectionRef, orderBy("createdAt", "desc"));
    const data = onSnapshot(q, (snapshot) => {
      setLostPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  }, []);

  if (lostPosts.length === 0) {
    return (
      // if there are no posts display sad emoji
      <>
        <div style={{display:"flex", justifyContent: "center"}}>
        <SadEmote/>
        </div>
      </>
    )
  }
  else {
    return (
      // else display posts
      <>
        <div>
          {lostPosts.map((lostPost) => (
            <div key={lostPost.id}>
              <Posts postId={lostPost.id} lostPost={lostPost} />
            </div>
          ))}
        </div>
      </>
    );
  }
};
