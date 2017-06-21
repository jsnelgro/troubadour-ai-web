import LyricWriter from './LyricWriter.js'
import { saveSong, loadSong } from './db.js'
import uuid from 'uuid'

export let state = {
  songID: uuid(),
  isFetching: false,
  lyricsHistoryIndex: 0,
  lyricsHistory: [''],
  lastUndoUpdate: Date.now(),
  undoInterval: 1000,
  maxUndoSteps: 40,
  selection: [0, 0],
  lyrics: '', title: '', artist: ''
}

export function setLyrics(updatedLyrics, forceUndoUpdate = false) {
  return (state, props) => {
    let newHistory = state.lyricsHistory
    let newUndoUpdate = state.lastUndoUpdate
    if (Date.now() - state.lastUndoUpdate > state.undoInterval || forceUndoUpdate) {
      newUndoUpdate = Date.now()
      newHistory = state.lyricsHistory
        .concat([updatedLyrics])
        .slice(Math.max(state.lyricsHistory.length - state.maxUndoSteps, 0))
    }
    return {
      lastUndoUpdate: newUndoUpdate,
      lyricsHistoryIndex: newHistory.length,
      lyricsHistory: newHistory,
      lyrics: updatedLyrics
    }
  }
}

export function undoLyrics(state, props) {
  let { lyricsHistoryIndex, lyricsHistory } = state
  return {
    lyricsHistoryIndex: Math.max(lyricsHistoryIndex - 1, 0),
    lyrics: lyricsHistory[Math.max(lyricsHistoryIndex - 1, 0)]
  }
}

export function redoLyrics(state, props) {
  let { lyricsHistoryIndex, lyricsHistory } = state
  return {
    lyricsHistoryIndex: Math.min(lyricsHistoryIndex + 1, lyricsHistory.length - 1),
    lyrics: lyricsHistory[Math.min(lyricsHistoryIndex + 1, lyricsHistory.length - 1)]
  }
}

export function setSelection(editorRef) {
  let start = editorRef.selectionStart
  let end = editorRef.selectionEnd
  return (state, props) => {
    return { selection: [start, end] }
  }
}

export function setFetchingIndicator(isFetching) {
  return (state, props) => {
    return { isFetching }
  }
}

export async function getAILyrics(state, type) {
  let { artist, title, lyrics, selection } = state
  // let lyrics = lyricsHistory[lyricsHistoryIndex]
  let pre_text = lyrics.substring(0, selection[0])
  let post_text = lyrics.substring(selection[1], lyrics.length)
  let networkResponse = await LyricWriter.getLyric(artist, title, pre_text, type)
  let song = networkResponse['song'].split('{')[1].split('}')[0]
  // TODO: FIXME this is super jenky
  // let generated = ''
  switch (type) {
    // case 'word':
    //   generated = song.substring(pre_text.length, song.length).trim().split(' ')[0]
    //   song = pre_text.trim() + ' ' + (generated || '').trim()
    //   break;
    // case 'line':
    //   generated = song.substring(pre_text.length, song.length).trim().split('\n').filter(x => x.length > 1)[0]
    //   song = pre_text.trim() + ' ' + (generated || '').trim()
    //   break;
    // case 'verse':
    //   generated = song.split('\n').map(x => x.trim()).join('\n').split('\n\n')[0]
    //   song = pre_text.trim() + ' ' + (generated || '').trim()
    //   break;
    case 'song':
    default:
      break;
  }
  song = (song + post_text).trim()
  return setLyrics(song, true)
}

export function persistState(id, state, fn) {
  saveSong(id, state)
  return fn
}

export async function loadState(id) {
  return await loadSong(id)
}
