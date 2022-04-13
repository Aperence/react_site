import React from "react";
import {Image} from "react-bootstrap"
import "../css/profile.css"



class Profile extends React.Component{
    render(){
       return (<img className="img" style={{"backgroundImage" : `url(${process.env.PUBLIC_URL + "/images/@IMG_1052.PNG"})`}}/>)
    }
}

export default Profile