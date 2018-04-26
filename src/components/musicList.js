import React, { Component } from 'react'
import Pubsub from 'pubsub-js'
import '../styles/musicList.less'

class MusicList extends Component{
  playSong(item, e){
    e.preventDefault()
    e.stopPropagation()
    Pubsub.publish('PLAY_SONG',item)
  }
  deleteSong(item, e){
    e.preventDefault()
    e.stopPropagation()
    Pubsub.publish('DELETE_SONG',item)
  }
  render(){
    
    let listItems = this.props.musicList.map((item, index) => {
      return (
        <li key={index} className={`${item === this.props.currentMusicItem ? 'playing' : ''}`} onClick={this.playSong.bind(this, item)}> <p>{item.title} - {item.artist} <span className="deleteSong" onClick={this.deleteSong.bind(this, item)}>X</span></p> </li>
      )
    })
    return (
      <div className="components-musicList">
        <ul>
          { listItems }
        </ul>
      </div>     
    )
  }
}

export default MusicList