
import '../css/App.css';
import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';

//var local = "https://localhost:9000"

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
  }

  render (){
    return (
      <div className="App">
        <header className="App-header">

          {this.props.name}

          <img src={this.props.picture}></img>
        
        </header>
      </div>
    );
  }
}

export default App;
