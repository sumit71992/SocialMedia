import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App';
import { useParams } from 'react-router-dom';


const UserProfile = () => {
    const [userProfile, setProfile] = useState(null);
    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams();
    const [showFollow, setFollow] = useState(state?!state.following.includes(userid):true)
    //console.log(userid);
    useEffect(() => {
        fetch(`/userProfile/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                setProfile(result)
            })
    }, [])

    const followUser = () => {
        fetch("/follow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json()).then(data => {
            console.log(data);
            dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
            localStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState) => {
                return {
                    ...prevState,
                    usr: {
                        ...prevState.usr,
                        followers: [...prevState.usr.followers, data._id]
                    }
                }
            })
            setFollow(false);
        })
    }
    const unFollowUser = () => {
        fetch("/unfollow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unFollowId: userid
            })
        }).then(res => res.json()).then(data => {
            console.log(data);
            dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
            localStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState) => {
                const newFollowers = prevState.usr.followers.filter(itm=>itm!==data._id)
                return {
                    ...prevState,
                    usr: {
                        ...prevState.usr,
                        followers: newFollowers
                    }
                }
            })
            setFollow(true);
        })
    }
    return (
        <>
            {userProfile ?
                <div style={{ maxWidth: "550px", margin: "0px auto" }}>
                    <div style={{
                        margin: "18px 0px",
                        borderBottom: "1px solid grey"
                    }}>


                        <div style={{
                            display: "flex",
                            justifyContent: "space-around",

                        }}>
                            <div>
                                <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                    src={userProfile ? userProfile.usr.pic : "loading"}
                                />

                            </div>
                            <div>
                                <h4>{userProfile.usr.name}</h4>
                                <h5>{userProfile.usr.email}</h5>
                                <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                                    <h6>{userProfile.posts.length} posts</h6>
                                    <h6>{userProfile.usr.followers.length} followers</h6>
                                    <h6>{userProfile.usr.following.length} following</h6>
                                </div>
                                {
                                    showFollow?
                                    <button style={{margin:"1rem"}} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                    onClick={() => followUser()}
                                >
                                    Follow</button>
                                    :
                                    <button style={{margin:"1rem"}} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                    onClick={() => unFollowUser()}
                                >
                                    unFollow</button>
                                }
                            </div>
                        </div>
                        <div className="file-field input-field" style={{ margin: "10px" }}>
                            <div className="btn #64b5f6 blue darken-1">
                                <span>Update pic</span>
                                <input type="file" />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text" />
                            </div>
                        </div>
                    </div>
                    <div className="gallery">
                        {
                            userProfile.posts.map(item => {
                                return (
                                    <img key={item._id} className="item" src={item.photo} alt={item.title} />
                                )
                            })
                        }


                    </div>
                </div>
                : <h2>Loading...........</h2>}
        </>
    )
}


export default UserProfile