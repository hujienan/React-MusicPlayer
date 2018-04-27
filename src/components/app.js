import React, { Component } from 'react'
import $ from 'jquery'
import {HashRouter, Route} from 'react-router-dom'
import Pubsub from 'pubsub-js'
import Header from './header'
import Player from './player'

import MusicList from './musicList'
import { MUSIC_LIST } from '../musiclist'

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      musicList: MUSIC_LIST,
      currentMusicItem: MUSIC_LIST[0],
      playMode: 'shuffle',
      modes: [
        'shuffle',
        'circle',
        'repeat'
      ]
    }
  }

  playMusic(musicItem){
    let player = $('#player')[0]
    player.src = musicItem.file
    player.play()
    this.setState({
      currentMusicItem: musicItem
    })
  }

  findMusicIndex(musicItem){
    return this.state.musicList.indexOf(musicItem)
  }

  
  skipSong(type){
    let index = this.findMusicIndex(this.state.currentMusicItem)
    if(type === "end" || type === "next"){
      if(this.state.playMode === this.state.modes[0]){
        index = Math.floor(Math.random()*this.state.musicList.length)
      }
      if(this.state.playMode === this.state.modes[1]){
        index = (index+1) % this.state.musicList.length
      }
    }
    if(type === "prev"){
      if(this.state.playMode === this.state.modes[0]){
        index = Math.floor(Math.random()*this.state.musicList.length)
      }
      if(this.state.playMode === this.state.modes[1]){
        index = (index-1+this.state.musicList.length) % this.state.musicList.length
      }
    }
    this.playMusic(this.state.musicList[index])
  }

  deleteSong(item){
    if(this.state.musicList.length === 1){
      alert("Only one song.")
      return
    }
    let prevIndex = (this.findMusicIndex(item) - 1 + this.state.musicList.length) % this.state.musicList.length

    if(item === this.state.currentMusicItem){
      this.setState({
        musicList: this.state.musicList.filter(song => (song !== item)),
        currentMusicItem: this.state.musicList[prevIndex]
      })
      this.skipSong('next')
    }else{
      this.setState({
        musicList: this.state.musicList.filter(song => (song !== item))
      })
    }
  }
  changeMode(curMode){
    let index = this.state.modes.indexOf(curMode)
    let newIndex = (index+1) % this.state.modes.length
    this.setState({
      "playMode": this.state.modes[newIndex]
    })
  }

  componentDidMount(){
    this.playMusic(this.state.currentMusicItem)
    $('#player').bind('ended', () =>{
      this.skipSong('end')
    })
    Pubsub.subscribe('PLAY_NEXT', () =>{
      this.skipSong('next')
    })
    Pubsub.subscribe('PLAY_PREV', () =>{
      this.skipSong('prev')
    })
    Pubsub.subscribe('FROM_SHUFFLE', () =>{
      this.changeMode('shuffle')
    })
    Pubsub.subscribe('FROM_CIRCLE', () =>{
      this.changeMode('circle')
    })
    Pubsub.subscribe('FROM_REPEAT', () => {
      this.changeMode('repeat')
    })
    Pubsub.subscribe('PLAY_SONG', (msg, item) =>{
      this.playMusic(item)
    })
    Pubsub.subscribe('DELETE_SONG', (msg, item) =>{
      this.deleteSong(item);
      
    })
  }

  componentWillUnmount(){
    Pubsub.unsubscribe('DELETE_SONG');
    Pubsub.unsubscribe('PLAY_SONG');
    Pubsub.unsubscribe('FROM_REPEAT');
    Pubsub.unsubscribe('FROM_CIRCLE');
    Pubsub.unsubscribe('FROM_SHUFFLE');
    Pubsub.unsubscribe('PLAY_NEXT');
    Pubsub.unsubscribe('PLAY_PREV');
    $('play').unbind('ended');
}

  render(){
    const Home = () => (
      <div>
        <Player
        currentMusicItem={this.state.currentMusicItem}
        playMode={this.state.playMode}
        />
      </div>
      
    )
    const List = () => (
      <MusicList
        currentMusicItem={this.state.currentMusicItem}
        musicList={this.state.musicList}
      />
    )
    return(
      <HashRouter>
        <div>
          <Header/>
          <audio id="player"></audio>
          <Route exact path="/" component={Home}/>
          <Route path="/list" component={List}/>
          
        </div>
      </HashRouter>
      
    )
  }
}

export default App