import React from "react";
import  {Navigate} from 'react-router-dom'

import Crop from "../components/Crop"
import Sidebar from "../components/Sidebar"
import ScrollBarPage from "../components/ScrollBarPage"

import "../css/profile.css"
import 'react-image-crop/dist/ReactCrop.css';
import 'bootstrap/dist/css/bootstrap.min.css';


class Profile extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            page : "/",
            loaded : false
        }
    }

    componentDidMount(){
        this.state.loaded = true
    }

      
    render(){
       if (!this.props.name && this.state.loaded) return <Navigate to={"/users/login"} replace/>
       return (<div className="pages">
                <Sidebar changePage={(page) => {console.log(page); this.setState({page : page})}}  name={this.props.name}/>
                <ScrollBarPage content={(
                    this.state.page === "img" && <Crop updateComponent={this.props.updateComponent}/>
                )}/>

               </div>)
    }
}

export default Profile