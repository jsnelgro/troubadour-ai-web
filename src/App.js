import React, { Component } from 'react';
import logo from './logos/phono1.svg';
import LyricsEditor from './LyricsEditor.js'
import './App.css';
import './GeneralComponentStyles.css'
/**
 * TODO:
 * [ ] autosuggest author name from
 * [ ] longpress on mobile to bring up word/line/verse/song list
 * [ ] keyboard shortcut
 */
class App extends Component {
  constructor (props) {
    super(props)
    this.state = {}
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
            <LyricsEditor />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
