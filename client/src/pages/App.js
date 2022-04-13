
import '../css/App.css';
import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import {Card} from 'react-bootstrap';

var local = "https://localhost:9000"

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = { apiResponse: [] , error : {"password" : ""}};
    this.submitAPI = this.submitAPI.bind(this);
    this.change = this.change.bind(this)
  }

  UNSAFE_componentWillMount() {
    fetch(local + "/test")
    .then(res => res.json())
    .then(res =>this.setState({ apiResponse: res }));
  }

  submitAPI(event){
    if (event.target.password.value.length < 8) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({error : {"password" : "Must contain 8 characters "}})
      return
    }
    this.setState({error : {"password" : ""}})
    event.preventDefault()
    var url = local + `/new?name=${event.target.name.value}&password=${event.target.password.value}`
    console.log(url)
    fetch(url)
      .then(res => res.json())
      .then(res=>this.setState({apiResponse : res}))
  }

  change(event){
    event.preventDefault()
    if (event.target.value.length >= 8){
        this.setState({valid : true})
    }else{
        this.setState({valid : false})
    }
  }

  render (){
    return (
      <div className="App">
        <header className="App-header">

          {/**this.state.apiResponse.map((value)=>
            <Card key={value} style={{ width: '18rem' , color : "black", margin: "2px"}}>
            <Card.Body>
              <Card.Title>{value.name}</Card.Title>
              <Card.Text>
              {value.password}
              </Card.Text>
            </Card.Body>
          </Card>
        )*/
        this.props.name}
        
        </header>
      </div>
    );
  }
}

export default App;
