const lengthMap = {
  word: 10,
  line: 30,
  verse: 300,
  song: 1000
}

export default {
  parseLyric: (prev_str, str) => {
    // let lyr = str.split('{')[1]
    // let new_str = lyr.split(prev_str)
    // console.log('strs', prev_str, str)
    
    return str
  },
  getLyric: (artist, title, previous_text, type) => {
    // TODO
    // - if word, then set n to, like, 10 or something
    // - this algorithm assumes the whole song will be replaced, and formats the
    // selection as a song
    console.log('prevtxt', previous_text)
    
    let endpoint = 'http://0.0.0.0:5000/song'
    let args = {
      n: lengthMap[type],
      artist: `${artist}`,
      title: `${title}`,
      lyrics: `${previous_text}`

    }
    return fetch(endpoint, {method: 'post', body: JSON.stringify(args)}).then((res) => {
      if (res.status === 200) { return res.json() }
      else { console.log(res) }
    })
  }
}