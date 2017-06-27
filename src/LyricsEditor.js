import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ResizeTextArea from 'react-textarea-autosize'
// import CursorPosition from 'react-cursor-position'
import { Shortcuts, ShortcutManager } from 'react-shortcuts'
import { state, persistState, loadState, setLyrics, setFetchingIndicator, getAILyrics, undoLyrics, redoLyrics, setSelection } from './LyricsEditorState.js'
import addressbar from 'addressbar'
import 'rc-checkbox/assets/index.css'
import Checkbox from 'rc-checkbox'

const keymap = {
  LyricsEditor: {
    UNDO: 'command+z',
    REDO: 'command+shift+z'
  }
}
const shortcutManager = new ShortcutManager(keymap)

class LyricsEditor extends Component {
  constructor(props) {
    super(props)
    this.state = (props.songID ?
      Object.assign({}, state, props, { isFetching: true }) :
      state
    )
    if (props.songID) {
      loadState(this.state.songID).then((res) => {
        if (res) {
          let { title, artist, lyrics } = res
          this.setState({ artist, title, lyrics, isFetching: false })
        }
      })
    }
    this._handleShortcuts = (action, event) => {
      switch (action) {
        case 'UNDO':
          event.preventDefault()
          this.setState(undoLyrics)
          break
        case 'REDO':
          event.preventDefault()
          this.setState(redoLyrics)
          break
        default:
          break
      }
    }
    // HACK: why is there no onSelectionChange callback for textareas?!?!?!?!
    let getSelection = () => {
      if (!this.refs.lyricsField) { return }
      let editor = this.refs.lyricsField._rootDOMNode
      this.setState(setSelection(editor))
    }
    setInterval(getSelection, 100)
  }

  componentDidUpdate(prevProps, prevState) {
    let { songID, title, artist, lyrics } = prevState
    if (lyrics !== '') {
      addressbar.value = '/song/' + this.state.songID
      persistState(songID, { title, artist, lyrics })
    }
  }

  getChildContext() {
    return { shortcuts: shortcutManager }
  }

  showOptions = (ev) => {
    console.log(ev)
  }

  setLyrics = (lyrics) => {
    this.setState(setLyrics(lyrics))
  }

  requestLyrics = async (type) => {
    this.setState(setFetchingIndicator(true))
    let lyrics = await getAILyrics(this.state, type)
    this.setState(lyrics)
    this.setState(setFetchingIndicator(false))
  }

  toggleProfanityFilter = () => {
    this.setState((s) => {
      return { filterProfanity: !s.filterProfanity }
    })
  }
  setArtist = (ev) => { this.setState({ artist: ev.target.value }) }
  setTitle = (ev) => { this.setState({ title: ev.target.value }) }

  render() {
    const { artist, isFetching, title, lyrics, filterProfanity } = this.state
    return (<div className="text-input-wrapper">
      <div className="text-input-wrapper narrow-input">
        <input className={isFetching ? 'color-ebb-ani' : null} disabled={isFetching} value={title} onChange={this.setTitle} type="text" placeholder="title..." />
      </div>
      <div className="text-input-wrapper narrow-input">
        <input className={isFetching ? 'color-ebb-ani' : null} disabled={isFetching} value={artist} onChange={this.setArtist} type="text" placeholder="author (or in the style of)..." />
      </div>
      <Shortcuts
        alwaysFireHandler stopPropagation
        name='LyricsEditor' handler={this._handleShortcuts}>
        <ResizeTextArea
          className={isFetching ? 'color-ebb-ani' : null}
          disabled={isFetching}
          value={lyrics}
          onChange={({ target }) => this.setLyrics(target.value)}
          minRows={6}
          placeholder="lyrics..."
          ref="lyricsField"
        />
      </Shortcuts>
      <div>
        {/*{isFetching ? ''}*/}
      </div>
      <button className="get-btn" onClick={_ => this.requestLyrics('word')}>get word</button>
      <button className="get-btn" onClick={_ => this.requestLyrics('line')}>get line</button>
      <button className="get-btn" onClick={_ => this.requestLyrics('verse')}>get verse</button>
      <button className="get-btn" onClick={_ => this.requestLyrics('song')}>get song</button>
      <div className="my-checkbox">
        <Checkbox
          checked={filterProfanity}
          onChange={this.toggleProfanityFilter}
        />
        {/*<input checked={filterProfanity} type="checkbox" id="my-checkbox-input" name="" />
        <label onChange={this.toggleProfanityFilter} for="my-checkbox-input"></label>*/}
        {String('filter profanity')}
      </div>
    </div>)
  }
}

LyricsEditor.childContextTypes = {
  shortcuts: PropTypes.object.isRequired
}

export default LyricsEditor
