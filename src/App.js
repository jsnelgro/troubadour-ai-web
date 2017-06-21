import React, { Component } from 'react'
import logo from './logos/phono1.svg'
import LyricsEditor from './LyricsEditor.js'
import './App.css'
import './GeneralComponentStyles.css'
import addressbar from 'addressbar'

/**
 * TODO:
 * [ ] autosuggest author name from
 * [ ] longpress on mobile to bring up word/line/verse/song list
 * [ ] keyboard shortcut
 */
class App extends Component {
  constructor (props) {
    super(props)
    let [_, key, id] = addressbar.pathname.split('/')
    // check url for songID.
    // get song info from firebase if there's an ID.
    // pass all db stuff into lyrics writer
    this.state = (key === 'song' ?
      {songID: id} :
      {songID: false}
    )
    addressbar.addEventListener('change', (e) => {
      e.preventDefault()
    })
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Troubadour.ai</h1>
        </div>
        <p className="App-intro">
          use deep learning to co-write your song lyrics
        </p>
        <div className="text-inputs">
          <div className="text-input-wrapper">
            <LyricsEditor songID={this.state.songID} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
