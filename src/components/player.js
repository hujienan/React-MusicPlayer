import React, { Component } from 'react'
import $ from 'jquery'
import { Link } from 'react-router-dom'
import Pubsub from 'pubsub-js'
import Progress from './progress'
import '../styles/player.less'

class Player extends Component{
  constructor(props){
    super(props)
    this.state = {
      progress: 0,
      barColor: '#E15151',
      duration: 0,
      leftTime: '',
      isPlay: true,
      volume: 0
    }
  }


  componentDidMount(){
    let player = $("#player")[0]
    let ispLay = !player.paused
    //regain thecover ***
    // let rotateValue = Math.floor((player.currentTime % 20) * (360 / 20))
    let musicCover = this.refs.musicCover
    if(player.paused){
      musicCover.style = 'animation-play-state: paused'
    }
    

    let playWhere = Math.floor(100*(player.currentTime / player.duration))
    this.setState({
      isPlay: ispLay,
      progress: playWhere,
      duration: player.duration,
      volume: player.volume*100,
      leftTime: this.formatTime(player.duration - player.currentTime)
    })

    $(player).bind('timeupdate', (e)=>{
      let percent = Math.floor(100*(e.target.currentTime / e.target.duration))
      this.setState({
        volume: e.target.volume*100,
        progress: percent,
        duration: e.target.duration,
        leftTime: this.formatTime(player.duration-e.target.currentTime)
      })
    })
    
  }

  componentWillUnmount(){
    $("#player").unbind('timeupdate')
  }

  progressChangeHandler(progress){
    let player = $("#player")[0]
    player.currentTime = this.state.duration * progress
    this.setState({
      progress: progress*100
    })
  }

  volumeChangeHandler(progress){
    let player = $("#player")[0]
    player.volume = progress
    this.setState({
      volume: progress*100
    })
  }

  play(){
    let player = $("#player")[0]
    let musicCover = this.refs.musicCover
    if(this.state.isPlay){
      player.pause()
      musicCover.style = 'animation-play-state: paused'
    }else{
      player.play()
      musicCover.style = 'animation-play-state: running'
    }
    this.setState({
      isPlay: !this.state.isPlay
    })
  }

  playPrevOrNext(e){
    e.preventDefault();
    e.stopPropagation();
    if(e.target.className === 'prev'){
      Pubsub.publish('PLAY_PREV')
    }else{
      Pubsub.publish('PLAY_NEXT')
    }
    let musicCover = this.refs.musicCover
    if($(musicCover).css('animation-play-state') === 'paused'){
      $(musicCover).css('animation-play-state', 'running')
    }
    if(!this.state.isPlay){
      this.setState({
        isPlay: !this.state.isPlay
      })
    }
  }

  changeMode(e){
    e.preventDefault()
    e.stopPropagation()
    if(e.target.className === 'shuffle'){
      Pubsub.publish('FROM_SHUFFLE')
    }else if(e.target.className === 'circle'){
      Pubsub.publish('FROM_CIRCLE')
    }else{
      Pubsub.publish('FROM_REPEAT')
    }
  }
  
  formatTime(time){
    if(time){
      time = Math.floor(time)
      let minute = Math.floor(time/60)
      let seconds = Math.floor(time%60)
      seconds = seconds < 10 ? `0${seconds}` : seconds
      return `-${minute}:${seconds}`
    }
  }

  render(){
    return (
      <div className="components-player">
        <h1 className="toMisicList"><Link to="/list">音乐收藏夹 &gt;</Link></h1>
        <div className="control-container">
          <h1 className="music-title">{this.props.currentMusicItem.title}</h1>
          <h3 className="music-artist">{this.props.currentMusicItem.artist}</h3>
          <div className="showCover">
            <img ref="musicCover" onClick={this.play.bind(this)}  src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title} className="music-cover"/>
          </div>
          
          <div className="progressShow">
            <div className="smallContainer">
              <span className="left-time">{this.state.leftTime}</span>
              <div className="volumeContainer">
                <i className="volume-icon">Volume</i>
                <div className="volumeWrapper">
                  <Progress
                    progress={this.state.volume}
                    onProgressChange={this.volumeChangeHandler.bind(this)}
                    barColor="grey"
                  />
                </div>
              </div>
            </div>
            <Progress
              progress={this.state.progress}
              onProgressChange={this.progressChangeHandler.bind(this)}
              barColor={this.state.barColor}
            />
          </div>
          
          <div className="controlBtns">
            <i className="prev" onClick={this.playPrevOrNext.bind(this)}></i>
            <i className={`${this.state.isPlay ? 'pause' : 'play'}`} onClick={this.play.bind(this)}></i>
            <i className="next" onClick={this.playPrevOrNext.bind(this)}></i> 
          </div>
          <div className="playMode">
              <i className={`${this.props.playMode === 'shuffle' ? 'shuffle' : (this.props.playMode === 'circle' ? 'circle' : 'repeat')}` } onClick={this.changeMode.bind(this)}></i>
          </div>
          
        </div>
      </div>     
    )
  }
}

export default Player