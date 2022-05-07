import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import './css/index.css';
import NApp from './pages/App';
import Login from './pages/Login'
import  Navbar   from './pages/Navbar';
import Profile from './pages/Profile';
import Blog from './pages/Blog';
import axios from 'axios';
import  {Navigate} from 'react-router-dom'


class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name : "",
      picture : ""
    }
    this.changeState = this.changeState.bind(this)
    this.updateComponent= this.updateComponent.bind(this)
  }

  changeState(field, value){
    this.setState((state)=>{
      state[field] = value
      return state
    })
  }

  updateComponent(){
    axios.get("/sessionInfo").then((res)=>{
      this.setState({name : res.data.name, picture: res.data.picture})
    })
  }

  componentDidMount(){
    axios.get("/sessionInfo").then((res)=>this.setState({name : res.data.name, picture: res.data.picture}))
  }

  render(){
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar name={this.state.name} picture={this.state.picture}/>}>
            <Route index element={<NApp name={this.state.name} picture={this.state.picture}/>} />
            <Route path="users/">
              <Route path="login" element={<Login updateState={this.changeState} updateComponent={this.updateComponent}/> } />
              <Route path="profile" element={<Profile updateState={this.changeState} updateComponent={this.updateComponent}/>} />
            </Route>
            <Route path="Blog" element={<Blog name={this.state.name}/>}></Route>
            <Route path="*" element={<Navigate to="/" replace/>}></Route>
          </Route>
          
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App

//let root= createRoot(document.getElementById("root"))
//root.render(<App />);

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);

