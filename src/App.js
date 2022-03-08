import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

const app = new Clarifai.App({
 apiKey: '582f8b0a701c41e1849ded66cfb63075'
});

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {}
    }
  }
  

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
    // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
    // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
    // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
    // If that isn't working, then that means you will have to wait until their servers are back up. Another solution
    // is to use a different version of their model that works like the ones found here: https://github.com/Clarifai/clarifai-javascript/blob/master/src/index.js
    // so you would change from:
    // .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    // to:
    // .predict('53e1df302c079b3db8a0a36033ed2d15', this.state.input)
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(
      function(response){
        this.calculateFaceLocation(response);
      },
      function(err){
        console.log(err);
      });
  }

  render() {
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation />
        <Logo /> 
        <Rank />     
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition box={box} imageUrl={imageUrl} />
      </div>
    );
  }
}

export default App;
