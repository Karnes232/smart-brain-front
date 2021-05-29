import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'
import Particles from 'react-particles-js';
import { useEffect, useState } from 'react'


const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 300
      }
    }
  },
}


function App() {
  const [input, setInput] = useState("")
  const [imageUrl, setImageUrl] = useState('')
  const [box, setBox] = useState({})
  const [route, setRoute] = useState('signin')
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [user, setUser] = useState({
            id: '',
            name: '',
            email: '',
            entries: 0,
            joined: ''
  })

let loadUser = (data) => {
  setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
  })
  setImageUrl('')
}

let calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage')
  const width = Number(image.width)
  const height = Number(image.height)
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}

let displayFaceBox = (box2) => {
  setBox(box2)
}

let onInputChange = (event) => {
    setInput(event.target.value)
  }

let onButtonSubmit = () => {
  setImageUrl(input)
  fetch('http://localhost:2000/imageurl/', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        input: input
    })
  })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('http://localhost:2000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              id: user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          setUser({
            id: user.id,
            name: user.name,
            email: user.email,
            entries: count,
            joined: user.joined
          })
        })
        .catch(console.log)
      }
      displayFaceBox(calculateFaceLocation(response))
    })
    .catch(err => console.log(err))
}

let onRouteChange = (route) => {
  if (route === 'signout') {
    setIsSignedIn(false)
    setInput("")
    setImageUrl('')
    setBox({})
    setUser({
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
    })
  } else if (route === 'home') {
    setIsSignedIn(true)
  }
  setRoute(route)
}

  return (
    <div className="App">
      <Particles 
        className='particles'
        params={particlesOptions}
            />
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      { route === 'home' 
        ? <div>
            <Logo />
            <Rank name={user.name} entries={user.entries}/>
            <ImageLinkForm 
              onInputChange={onInputChange} 
              onButtonSubmit={onButtonSubmit}
            />
            <FaceRecognition imageUrl={imageUrl} box={box}/>
          </div>
        : ( route === 'signin'
            ? <SignIn onRouteChange={onRouteChange} loadUser={loadUser}/> 
            : <Register onRouteChange={onRouteChange} loadUser={loadUser}/>
        )        
      }
    </div>
  );
}

export default App;
