import React,{useEffect,createContext,useReducer,useContext} from 'react';
import Navbar from './components/Navbar';
import "./App.css";
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/Home';
import Signin from './components/SignIn';
import Profile from './components/Profile';
import Signup from './components/Signup';
import CreatePost from './components/CreatePost';
import {reducer,initialState} from './reducers/userReducer';
import UserProfile from './components/UserProfile';
import FollowedPosts from './components/FollowedPosts';
import Reset from './components/Reset';
import NewPassword from './components/Newpassword';
export const UserContext = createContext();


const Routing = ()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      if(!history.location.pathname.startsWith('/reset'))
           history.push('/signin')
    }
  },[])
  return(
    <Switch>
      <Route exact path="/" >
      <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost/>
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <FollowedPosts />
      </Route>
      <Route exact path="/reset">
        <Reset/>
      </Route>
      <Route path="/reset/:token">
        <NewPassword />
      </Route>
      
    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <Navbar />
      <Routing />
      
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;