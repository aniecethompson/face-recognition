import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import SignIn from './components/SignIn/SignIn';
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
      route: 'signin'
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
    console.log(box)
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
      .then(response => {this.displayRecognitionBox(this.calculateFaceLocation(response))})
      .catch(err => console.log(err))

  }

  onRouteChange = (route) => {
      this.setState({route: route})
  }

  render() {

  return (
    <div className="App">
      <Particles className="particles"
        params={particlesOptions}
            /> 
      <Navigation onRouteChange={this.onRouteChange}/>
      
      {this.state.route === "signin"
      ? <SignIn  onRouteChange={this.onRouteChange}/>
      : <>
        <Logo />
        <Rank />
        <ImageLinkForm 
        onButtonSubmit={this.onButtonSubmit} 
        onInputChange={this.onInputChange}/>
        <FaceRecognition 
        imageUrl={this.state.imageUrl}
        box={this.state.box}/>
        </>
  }
    </div>
  );
  }
}

export default App;

