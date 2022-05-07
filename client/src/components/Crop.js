import { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from "axios"
  
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
      props.updateComponent()
    })
  }
  
  return (
    <div className="App">
      <center>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            selectImage(e.target.files[0]);
          }}
        />
        <br />
        <br />
        <div>
          {src && (
            <div>
              <ReactCrop src={src} onImageLoaded={setImage}
                crop={crop} onChange={setCrop} style={{width : "300px"}}/>
              <br />
              <button onClick={cropImageNow}>Crop</button>
              <br />
              <br />
            </div>
          )}
        </div>
        {output && <div><span>Preview</span><img src={output} style={{borderRadius : "50%", width: "100px"}} alt=""/></div>}
        <button onClick={sendImg}>Send</button>
        {res && <img src={res} style={{borderRadius : "50%", width: "100px"}} alt=""></img>}
      </center>
    </div>
  );
}
  
export default App;