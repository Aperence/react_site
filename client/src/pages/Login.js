import React from "react";
import {Alert, Button, Form, Modal} from "react-bootstrap"
import "../css/login.css"
import axios from "axios"
import  {Navigate} from 'react-router-dom'

class Login extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            "passwordDisplayLogIn" : false,
            "passwordDisplayRegister" : false,
            "passwordDisplayRegister2" : false,
            "errors" : ["", "", "", "", "", "", "", ""],
            "redirect" : "",
            "displayToken" : false,
            "errorToken" : false
        }
        this.handleLogin = this.handleLogin.bind(this)
        this.handleRegister = this.handleRegister.bind(this)
        this.handleConfirmation = this.handleConfirmation.bind(this)
        this.changeVisibility = this.changeVisibility.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    handleLogin(event){
        event.preventDefault()
        this.setState({errors : ["", "", "", "", "", "", "", ""]})
        var email = event.target.formGroupEmailLogin.value
        var password = event.target.formGroupPasswordLogin.value
        console.log(email, password)
        axios.post("login", {
            "email" : email,
            "password" : password
        }, {withCredentials : true})
        .then((res)=>{
            this.props.updateComponent()
            this.props.updateState("name", res.data.name)
            this.setState({redirect : "/"})
            
        })
        .catch( (err) =>{
            console.log(err)
            this.setState((state)=>{
                state.errors[0] = "Unknown account with this password"
                return state
            })
        })

    }

    handleRegister(event){
        event.preventDefault()
        this.setState({errors : ["", "", "", "", "", "", "", ""]})
        var pseudo = event.target.formGroupPseudoRegister.value
        var email = event.target.formGroupEmailRegister.value
        var password = event.target.formGroupPasswordRegister.value
        var repeat = event.target.formGroupRepeatRegister.value
        if (pseudo.length < 6) {this.setState((state)=>{
            state.errors[2] = "Pseudo must be 6 characters long at least"
            return ({errors : state.errors})
        }) ;return}
        if (pseudo.trim().length > 12) {this.setState((state)=>{
            state.errors[2] = "Pseudo can't be more than 12 characters long"
            return ({errors : state.errors})
        }) ;return}

        if (password.length < 8) {
            this.setState((state)=>{
                state.errors[4] = "Passwords must be 8 characters long at least"
                return ({errors : state.errors})
            });return}
        if (password !== repeat){ this.setState((state)=>{
            state.errors[5] = "Password and repeat are different"
            return ({errors : state.errors})
        });
        return;}
        axios.post(`register`,
            {
                "name" : pseudo.trim(),
                "email" : email,
                "password" : password
            },
            {withCredentials : true}
         )
        .then((res)=>{
            console.log(res)
            this.props.updateComponent()
            if (res.status === 200){
                this.setState((state) => {state.displayToken = true; return state})
            }else{
                this.setState((state)=>{
                    state.errors[7] = res.data.status
                    return state
                })
                console.log(this.state.errors[7])
            }
        })
    }

    handleConfirmation(event){
        event.preventDefault()
        axios.post("confirm_mail", {
            enteredKey : event.target.key.value
        })
        .then((res)=>{
            this.setState({redirect : "/"})
            this.props.updateState("name", res.data.name)
        })
        .catch((err)=>{
            console.log(err)
            this.setState((state) => {state.displayToken = false; state.errorToken=true; return state})
        })
    }

    changeVisibility(event){
        switch (event.target.id){
            case "LogIn":
                this.setState((state)=>({passwordDisplayLogIn : !state.passwordDisplayLogIn}))
                break
            case "Register":
                    this.setState((state)=>({passwordDisplayRegister : !state.passwordDisplayRegister}))
                    break
            case "Register2":
                this.setState((state)=>({passwordDisplayRegister2 : !state.passwordDisplayRegister2}))
                break  
            default:
                break
        }
        
    }

    closeAlert(){
        this.setState((state)=>{
            state.errors[7] = ""
            state.errorToken = false
            return state
        })
    }

    closeModal(){
        this.setState((state) => {state.displayToken = false; return state})
    }

    render(){
        if (this.state.redirect) return (<Navigate to={this.state.redirect} replace/>)
        return (
        <div className="main">
            {this.state.errors[7] && <Alert className="alert-error" variant="danger" dismissible onClose={this.closeAlert}>{this.state.errors[7]}</Alert>}
            {this.state.errorToken && <Alert className="alert-error" variant="danger" dismissible onClose={this.closeAlert}>Wrong entered token</Alert>}
            <Form className="form"  onSubmit={this.handleLogin}>
                <Form.Label className="form-title">Log in</Form.Label>
                <Form.Group className="mb-3" controlId="formGroupEmailLogin">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" required isInvalid={!!this.state.errors[0]}/>
                    <Form.Control.Feedback type="invalid">{this.state.errors[0]}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPasswordLogin">
                    <Form.Label style={{"display" : "flex"}}>Password
                        <span style={{"marginLeft" : "auto", "marginRight" : "10px"}}>
                            <img src={process.env.PUBLIC_URL + "/images/bx-low-vision.svg"} alt="" id="LogIn" onClick={this.changeVisibility}/>
                        </span>
                    </Form.Label>
                    <Form.Control type={this.state.passwordDisplayLogIn ? "text" : "password"}  placeholder="Password" required isInvalid={!!this.state.errors[1]}/>
                    <Form.Control.Feedback type="invalid">{this.state.errors[1]}</Form.Control.Feedback>
                </Form.Group>

                <Button variant="light" type="submit" style={{"marginTop" : "auto"}}>
                    Submit
                </Button>
            </Form>

            <Form className="form" onSubmit={this.handleRegister}>
                <Form.Label className="form-title">Register</Form.Label>
                <Form.Group className="mb-3" controlId="formGroupPseudoRegister">
                    <Form.Label>Pseudo</Form.Label>
                    <Form.Control type="text" placeholder="Enter pseudo" required isInvalid={!!this.state.errors[2]}/>
                    <Form.Control.Feedback type="invalid">{this.state.errors[2]}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupEmailRegister">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" required isInvalid={!!this.state.errors[3]}/>
                    <Form.Control.Feedback type="invalid">{this.state.errors[3]}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPasswordRegister">
                    <Form.Label style={{"display" : "flex"}}>Password
                        <span style={{"marginLeft" : "auto", "marginRight" : "10px"}}>
                            <img src={process.env.PUBLIC_URL + "/images/bx-low-vision.svg"} alt="" id="Register" onClick={this.changeVisibility}/>
                        </span>
                    </Form.Label>
                    <Form.Control type={this.state.passwordDisplayRegister ? "text" : "password"} placeholder="Password" required isInvalid={!!this.state.errors[4]}/>
                    <Form.Control.Feedback type="invalid">{this.state.errors[4]}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupRepeatRegister">
                    <Form.Label style={{"display" : "flex"}}>
                        Repeat password 
                        <span style={{"marginLeft" : "auto", "marginRight" : "10px"}}>
                            <img src={process.env.PUBLIC_URL + "/images/bx-low-vision.svg"} alt="" id="Register2" onClick={this.changeVisibility}/>
                        </span>
                    </Form.Label>
                    <Form.Control type={this.state.passwordDisplayRegister2 ? "text" : "password"} placeholder="Password" isInvalid={!!this.state.errors[5]} required/>
                    <Form.Control.Feedback type="invalid">{this.state.errors[5]}</Form.Control.Feedback>
                </Form.Group>

                <Button variant="light" type="submit" style={{"marginTop" : "auto"}}>
                    Submit
                </Button>
            </Form>


            <Modal show={this.state.displayToken} onHide={this.closeModal}>
                <Modal.Header closeButton>
                <Modal.Title>Enter your token</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={this.handleConfirmation}>
                    <Form.Group className="mb-3" controlId="key">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="text" placeholder="Enter token" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
        )
    }
}

export default Login