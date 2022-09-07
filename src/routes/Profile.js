import { authService, dbService } from "fbase";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ( {userObj, refreshUser} ) => {
  // const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  }
  const getMyNweets = async () => {
    const nweets = await dbService.collection("nweets").where("creatorId", "==", userObj.uid).orderBy("createdAt", "desc").get(); // 유저 필터링
    console.log(nweets.docs.map(doc => doc.data()));
  }
  useEffect(()=>{
    getMyNweets();
  }, [])

  const onChange = (event) => {
    const {target:{value}} = event;
    setNewDisplayName(value);
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    if(userObj.displayName !== newDisplayName){ 
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  }

  return (
    <>
      <div className="container">
        <form onSubmit={onSubmit} className="profileForm">
          <input type="text" placeholder="Display name" value={newDisplayName} onChange={onChange} autoFocus className="formInput" />
          <input type="submit" value="Update Profile" className="formBtn" style={{ marginTop: 10, }} />
        </form>
        <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>Log Out</span>
      </div>
    </>
  );
}

export default Profile;