import axios from "axios";
import React from "react";
import {Toast, InputGroup, FormControl, Accordion, Button} from "react-bootstrap"
import '../css/Blog.css'

class Blog extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            messages : [{account : "Anthony", date : "now", content : "Some text"}, {account : "Anthony", date : "now", content : "Some text"}],
            comment : ""
        }
        this.submitComment = this.submitComment.bind(this)
        this.getComments = this.getComments.bind(this)
    }

    submitComment(event){
        axios.post("/blog/postComment", {
            account : this.props.name,
            date : Date.now(),
            content : this.state.comment, 
        }, {withCredentials: true})
        .then((res)=>{
            if (res.data.status === "ok") this.setState({comment : ""})
            this.getComments()
        })
    }

    getComments(){
        axios.get("/blog/comment", {withCredentials: true})
        .then(res => {
            this.setState({messages : res.data})
            console.log(Math.round(((Date.now() - res.data[3].date) /1000) / 3600 / 24 / 30)) 
        })
    }

    UNSAFE_componentWillMount(){
        this.getComments()
    }

    render(){
        return (
        <div className="Container">
            {this.props.name &&   
            <Accordion defaultActiveKey="">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Submit a post</Accordion.Header>
              <Accordion.Body>
                <InputGroup>
                    <InputGroup.Text>Your comment</InputGroup.Text>
                    <FormControl as="textarea" aria-label="With textarea" value={this.state.comment} onChange={(event)=>this.setState({comment : event.target.value})}/>
                    <Button variant="success" onClick={this.submitComment}>Submit</Button>
                </InputGroup>
              </Accordion.Body>
            </Accordion.Item>
            </Accordion>
            }

            {this.state.messages.map((value, index)=>
                <Toast key={index} bg="dark">
                    <Toast.Header closeButton={false}>
                    <strong className="me-auto">{value.account}</strong>
                    <small>{
                        Date.now() - value.date < 3600000 ? 
                        Math.round(((Date.now() - value.date) /1000) / 60) + "mn ago":  // less than an hour
                        Date.now() - value.date < 86400 * 1000 ? 
                        Math.round(((Date.now() - value.date) /1000) / 3600) + "h ago":   // less than a day
                        Date.now() - value.date < 2592000 * 1000 ?
                        Math.round(((Date.now() - value.date) /1000) / 3600 / 24) + " days ago":  // less than a month
                        Date.now() - value.date < 31104000 * 1000 ?
                        Math.round(((Date.now() - value.date) /1000) / 3600 / 24 / 30) + " months ago": // less than a year
                        Math.round(((Date.now() - value.date) /1000) / 3600 / 24 / 30 / 12) + " years ago" // more than a year
                    }</small>
                    </Toast.Header>
                    <Toast.Body>{value.content}</Toast.Body>
                </Toast>
            )}

        </div>
        )
    }
}

export default Blog;