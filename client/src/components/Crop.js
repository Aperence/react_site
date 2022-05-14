import { useState } from 'react';
import ReactCrop from 'react-image-crop';
import axios from "axios"
import {Form, Button, Alert, Toast} from "react-bootstrap"

import 'react-image-crop/dist/ReactCrop.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/Crop.css"

  
function App(props) {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({   unit: '%',
  aspect: 1,
  width: 50,
  x: 25,
  y: 20,
  circularCrop : true
  });
  const [image, setImage] = useState(null);
  const [output, setOutput] = useState(null);
  const[res, setRes] = useState(null)
  const [show, setShow] = useState(true);
  
  const selectImage = (file) => {
    setSrc(URL.createObjectURL(file));
  };
  
  const cropImageNow = () => {    // https://www.geeksforgeeks.org/how-to-crop-images-in-reactjs/
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
  
    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';
  
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );
      
    // Converting to base64
    const base64Image = canvas.toDataURL('image/jpeg');
    setOutput(base64Image);
  };

  const sendImg = () =>{
    axios.post("/users/img",{
      img : output
    }, {withCredentials : true}).then(res=>{
      setRes(res.data)
      setShow(true)
      props.updateComponent()
    })
  }
  
  return (
    <div>
        <div className="half-page">
          <center>
          <Form.Group controlId="formFile" className="mb-4">
            <Form.Label>Select an image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={(e) => {
                  selectImage(e.target.files[0]);
                }}/>
          </Form.Group>
          
            {src && (
                <ReactCrop src={src} onImageLoaded={setImage}
                  crop={crop} onChange={setCrop} className = "picture"
                  />
                
            )}
            {src && (<Button variant="primary" className="button mt-auto mb-4" onClick={cropImageNow}>Select this area</Button>)}
          </center>
      </div>

      <Toast show={output} onClose={()=>{setOutput(null); setShow(false)}} bg="dark" className="popup">
      <Toast.Header>
              <span className='me-auto'>Preview screen</span>
      </Toast.Header>
      <Toast.Body className='right-panel'>
          <div style={{fontSize : "20px", marginBottom : "10px"}}>Preview</div>
          <img src={output} className="image-preview" alt=""/>

          
          {res && show && 
          <Alert variant="success" onClose={() => setShow(false)} dismissible style={{width : "90%"}}>
              Image uploaded successfully
          </Alert>}
          <Button variant="primary" className="button mt-auto"  onClick={sendImg}>Send the image</Button>
      </Toast.Body>
      </Toast>

    </div>
  );
}
  
export default App;