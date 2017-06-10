import React, { Component } from 'react'
// import Draft, { Editor, EditorState, ContentState, Modifier } from 'draft-js';
// import 'draft-js/dist/Draft.css';
// import ReactQuill from 'react-quill'
// import 'react-quill/dist/quill.core.css'
import ResizeTextArea from 'react-textarea-autosize'
import CursorPosition from 'react-cursor-position'
import LyricWriter from './LyricWriter.js'

class LyricsEditor extends Component {
  constructor (props) {
    super(props)
    this.state = { lyrics: '', title: '', artist: ''}
  }

  showOptions = (ev) => {
    console.log(ev)
  }

  setLyrics = (lyrics) => {
    this.setState({ lyrics })
  }

  onChangeLyrics = (ev) => {
    this.setLyrics(ev.target.value)
  }

  getNetworkResponse = (type, cb) => {
    let { artist, title, lyrics } = this.state
    LyricWriter.getLyric(artist, title, lyrics, type).then(({ song }) => {
        song = LyricWriter.parseLyric(lyrics, song)
        if (typeof cb === 'function') { cb(song) }
    })
  }

  getWord = () => {
    this.getNetworkResponse('word', (song) => {
      this.setLyrics(song)
    })
  }
  getLine = () => {
    this.getNetworkResponse('line', (song) => {
      this.setLyrics(song)
    })
  }
  getVerse = () => {
    this.getNetworkResponse('verse', (song) => {
      this.setLyrics(song)
    }) 
  }
  getSong = () => {
    this.getNetworkResponse('song', (song) => {
      this.setLyrics(song)
    })
  }

  setArtist = (ev) => { this.setState({ artist: ev.target.value }) }
  setTitle = (ev) => { this.setState({ title: ev.target.value }) }

  render () {
    const { styles } = this.props
    const { artist, title, lyrics } = this.state
    return (<div className="text-input-wrapper">
      <div className="text-input-wrapper narrow-input">
        <input value={title} onChange={this.setTitle} type="text" placeholder="title..." />
      </div>
      <div className="text-input-wrapper narrow-input">
        <input value={artist} onChange={this.setArtist} type="text" placeholder="author (or in the style of)..." />
      </div>
      <ResizeTextArea
        value={lyrics}
        onChange={this.onChangeLyrics}
        minRows={6}
        placeholder="lyrics..."
        ref="lyricEditor"
      ></ResizeTextArea>
      <button className="get-btn" onClick={this.getWord}>get word</button>
      <button className="get-btn" onClick={this.getLine}>get line</button>
      <button className="get-btn" onClick={this.getVerse}>get verse</button>
      <button className="get-btn" onClick={this.getSong}>get song</button>
    </div>)
  }
}

// LyricsEditor.defaultProps = {
//   styles: {
//     root: {
//       width: '80%',
//       margin: '0 auto'
//     },
//     editor: {
//       borderBottom: '1px solid white',
//       cursor: 'text',
//       minHeight: 80,
//       padding: 10
//     }
//   }
// }

/**
 * non draft-js render attempt :(
   render () {
    return (<div>
      <CursorPosition
        shouldDecorateChildren={false}
        onActivationChanged={this.showOptions}
        isActivatedOnTouch={true}
      >
      <ResizeTextArea
        value={this.state.value}
        onChange={this.onChange}
        minRows={6}
        ref='input'
        placeholder="lyrics..."
      />
      </CursorPosition>
      <button onClick={this.getWord}>get word</button>
      <button onClick={this.getLine}>get line</button>
      <button onClick={this.getVerse}>get verse</button>
      <button onClick={this.getSong}>get song</button>
    </div>)
  }
 */

/**
 * attempted render method for that stupid draft-js library
 render() {
    const {styles} = this.props
    return (
      <div style={styles.root}>
        <div style={styles.editor}>
          <Editor
            className="text-input-wrapper"
            editorState={this.state.editorState}
            onChange={this.onChange}
            placeholder="lyrics..."
            ref="editor"
          />
        </div>
      </div>
    )
 }
 */

export default LyricsEditor;