import React, { Component } from 'react'
import Pubsub from 'pubsub-js'
import '../styles/playMode.less'

class PlayMode extends Component{
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
  render(){
    return (
      <div className="components-playMode">
        <i className={`${this.props.playMode === 'shuffle' ? 'shuffle' : (this.props.playMode === 'circle' ? 'circle' : 'repeat')}` } onClick={this.changeMode.bind(this)}></i>
      </div>     
    )
  }
}

export default PlayMode