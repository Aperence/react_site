import React from "react";
import { MDBContainer } from "mdbreact";
import "../css/scrollbar.css";

const ScrollBarPage = (props) => {
  return (
    <MDBContainer className="page">
      <div className="scrollbar scrollbar-primary">
        {props.content}
      </div>

    </MDBContainer>
  );
}
export default ScrollBarPage;