import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import './App.css';
import Clarifai from 'clarifai';
let API_KEY = process.env.REACT_APP_API_KEY


const app = new Clarifai.App({
  apiKey: API_KEY
 });

const particlesOptions = {
    particles: {
      number: {
        value: 200,
        density: {
          enable: true,
          value_area: 800
        }
      }
     
    },
    interactivity: {
      events: {
        onhover:{
          enable: true,
          mode: "repulse"
        }
    }
  },
  modes: {
    repulse: {
      distance: 50,
      duration: 0.4
    }
  }

}

class App extends Component {

  state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        password: "",
        entries: 0,
        joined: ''
      }
    }

    loadUser = (data) => {
      this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        entries: data.entries,
        joined: data.joined
      }})
    }

  calculateFaceLocation = (data) =>{
    const clarifyFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById("inputImage")
    const width = Number(image.width)
    const height = Number(image.height)
    return {
      leftCol: clarifyFace.left_col * width,
      topRow: clarifyFace.top_row * height,
      rightCol: width - (clarifyFace.right_col * width),
      bottomRow: height - (clarifyFace.bottom_row * height)
    }
  }

  displayRecognitionBox = (box) =>{
    // console.log(box)
    this.setState({box: box})
  }

  onInputChange = (evt) =>{
    this.setState({input: evt.target.value});
  }

  onButtonSubmit = () =>{
    this.setState({imageUrl: this.state.input})
    
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
      .then(response => {
        if(response){
          fetch(`http://localhost:3000/image`, {
            method:'PUT',
            headers: { 
               'Content-type': 'application/json',
               'accept': 'application/json'
            },
            body: JSON.stringify({
              id: this.state.user.id
            })
           })
          .then(resp => resp.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
        }
        this.displayRecognitionBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err))

  }

  onRouteChange = (route) => {
      if(route ==='signout'){
        this.setState({isSignedIn  : false})
      } else if (route === 'home'){
        this.setState({isSignedIn  : true})

      }
      this.setState({route: route})
  }

  render() {
    const {isSignedIn, route, imageUrl, box} = this.state

  return (
    <div className="App">
      <Particles className="particles"
        params={particlesOptions}
            /> 
      <Navigation 
      isSignedIn={isSignedIn}
      onRouteChange={this.onRouteChange}/>
      
      {route === "home"
      ? <React.Fragment>
      <Logo />
      <Rank name={this.state.user.name} entries={this.state.user.entries}/>
      <ImageLinkForm 
      onButtonSubmit={this.onButtonSubmit} 
      onInputChange={this.onInputChange}/>
      <FaceRecognition 
      imageUrl={imageUrl}
      box={box}/>
      </React.Fragment>
      : (
        route === 'signin'
        ? <SignIn  onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
        : <Register  onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>

      )

  }
    </div>
  );
  }
}

export default App;

