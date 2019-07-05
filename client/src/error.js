import React from "react";
import "./App.css";
import sadface from './errorFaceGroupPhoto.PNG';

const Error = (props)=>{

    return(
       <div>
       
      
        <div style={{ margin:"auto", height:"400px",width:"50%", backgroundRepeat: "no-repeat",backgroundSize: "contain", backgroundImage: `url(${sadface})`}} className="ErrorBoyText">{props.error}</div>
        </div>
    )
}
export default Error;

