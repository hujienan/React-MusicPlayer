import React, { Component } from 'react'
import logo from '../images/logo.png'
import '../styles/header.less'

class Header extends Component{
  render(){
    return (
      <div className="components-header">
        <img src={logo} alt="musicplayer logo" className='header-logo' />
        <h1 className="title">React Music Player</h1>
      </div>     
    )
  }
}

export default Header