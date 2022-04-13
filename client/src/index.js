import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import './css/index.css';
import NApp from './pages/App';
import Login from './pages/Login'
import  Navbar   from './pages/Navbar';
import Profile from './pages/Profile';
import axios from 'axios';
import  {Navigate} from 'react-router-dom'


class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name : ""
    }
    this.changeState = this.changeState.bind(this)
  }

  changeState(field, value){
    this.setState((state)=>{
      state[field] = value
      return state
    })
  }

  UNSAFE_componentWillMount(){
    axios.get("/sessionInfo").then((res)=>this.setState({name : res.data.name}))
  }

  render(){
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar name={this.state.name}/>}>
            <Route index element={<NApp name={this.state.name}/>} />
            <Route path="users/">
              <Route path="login" element={<Login updateState={this.changeState}/>} />
              <Route path="profile" element={<Profile updateState={this.changeState}/>} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace/>}></Route>
          </Route>
          
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App

let root= createRoot(document.getElementById("root"))
root.render(<App />);
