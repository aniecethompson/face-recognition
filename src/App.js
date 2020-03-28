import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
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

  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: ''
    }
  }

  onInputChange = (evt) =>{
    this.setState({input: evt.target.value});
  }

  onButtonSubmit = () =>{
    this.setState({imageUrl: this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
      function(response) {
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box)
      },
      function(err) {
        // there was an error
      }
  );

  }

  render() {

  return (
    <div className="App">
      <Particles className="particles"
        params={particlesOptions}
            /> 
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm 
      onButtonSubmit={this.onButtonSubmit} 
      onInputChange={this.onInputChange}/>
      <FaceRecognition imageUrl={this.state.imageUrl}/>
    </div>
  );
  }
}

export default App;
