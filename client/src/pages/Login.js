import React from "react";
import {Alert, Button, Form} from "react-bootstrap"
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
            "redirect" : ""
        }
        this.handleLogin = this.handleLogin.bind(this)
        this.handleRegister = this.handleRegister.bind(this)
        this.changeVisibility = this.changeVisibility.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
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
            console.log(res.data.status)
            if (res.data.status === "Unknown account"){
                this.setState((state)=>{
                    state.errors[0] = "Unknown account"
                    return state
                })
            }else{
                console.log(res.data.name)
                this.props.updateState("name", res.data.name)
                this.setState({redirect : "/"})
            }
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
                "name" : pseudo,
                "email" : email,
                "password" : password
            },
            {withCredentials : true}
         )
        .then((res)=>{
            console.log(res)
            if (res.data.status === "ok"){
                this.setState({redirect : "/"})
                this.props.updateState("name", res.data.name)
            }else{
                this.setState((state)=>{
                    state.errors[7] = res.data.status
                    return state
                })
                console.log(this.state.errors[7])
            }
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
            return state
        })
    }

    render(){
        if (this.state.redirect) return (<Navigate to={this.state.redirect} replace/>)
        return (
        <div className="main">
            {this.state.errors[7] && <Alert className="alert-error" variant="danger" dismissible onClose={this.closeAlert}>{this.state.errors[7]}</Alert>}
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
        </div>
        )
    }
}

export default Login