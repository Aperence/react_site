import React from "react";
import "../css/profile.css"
import 'react-image-crop/dist/ReactCrop.css';

import Crop from "../components/Crop"



class Profile extends React.Component{

    constructor(props){
        super(props)
        this.cropImg = this.cropImg.bind(this)
        this.ref = React.createRef()
        this.cropConfig =  {
            unit: 'px', // default, can be 'px' or '%'
            x: 130,
            y: 50,
            width: 200,
            height: 200
          }

        this.imageRef = process.env.PUBLIC_URL + "/images/@IMG_1052.PNG"
    }

    cropImg(){
        const canvas = this.ref.current;
        const ctx = canvas.getContext('2d');

        console.log(ctx)
      
        var image = new Image();
        image.src = "https://images.unsplash.com/photo-1593642634443-44adaa06623a?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=725&q=80"; 
        
        image.onload = function(){
          ctx.drawImage(image, 150, 200, 500, 300, 60,60, 500, 300);
        }
    }

    componentDidMount(){
        //this.cropImg()
        //                <canvas id="canvas" ref={this.ref}></canvas>
        // <img className="img" alt="" style={{"backgroundImage" : `url(${process.env.PUBLIC_URL + "/images/@IMG_1052.PNG"})`}}/>
    }


      
    render(){
       return (<div>
                <Crop updateComponent={this.props.updateComponent}/>
               </div>)
    }
}

export default Profile