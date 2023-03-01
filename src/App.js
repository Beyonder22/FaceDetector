import React,{Component} from 'react';
import './App.css';
import Clarifai from 'clarifai';
import ParticlesBg from 'particles-bg';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Facerecognition from './components/Facerecognition/Facerecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

const app = new Clarifai.App({
 apiKey: '65350eabd0d84d1f97ceb299adae8d72'
});

class App extends Component {
  constructor(){
    super();
    this.state={
      input:'',
      imageUrl:'',
      box: {},
      route:'signin',
  }
}
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    // console.log(clarifaiFace);
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width,height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height-(clarifaiFace.bottom_row * height)
    }
  } 
  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box:box});
  }
  onInputChange = (event) =>{
    // console.log(event.target.value);
    this.setState({input:event.target.value});
    // this.state.input=event.target.value this can be used but not recommended
  }
  onSubmit = () =>{
    // console.log('click');
      this.setState({imageUrl:this.state.input});
      app.models
      .predict(
        {
          id: 'face-detection',
          name: 'Face',
          version: '6dc7e46bc9124c5c8824be4822abe105',
          type: 'visual-detector',
        }, this.state.input)
      .then(response => this.displayFaceBox(
        this.calculateFaceLocation(response)))
        .catch(err => console.log(err));
  } 

  onRouteChange = (route) =>{
    this.setState({route:route})
  }

  render(){
  return (
    <div className="App">
        <ParticlesBg color="#aafaff" num={200} type="cobweb" bg={true}/>
        { this.state.route === 'home'?
        <div>
          <Navigation onRouteChange={this.onRouteChange}/>
          <Logo/>
          <Rank/>
          <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
          <Facerecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
        </div>
        :this.state.route === 'signin' ?
        <div>
          <Logo/>
          <Signin onRouteChange={this.onRouteChange}/>
        </div>
        :
        <div>
          <Logo/>
          <Register onRouteChange={this.onRouteChange}/>
        </div>
        }
    </div>
  );
  }
}

export default App;
