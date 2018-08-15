import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'

export class SplashPage extends Component {
  // @ts-ignore
  render = () => {
    return (
      <div className="splash-page">
        <header>
          <nav className="splash-nav">
            <Link to="/" className="item">
              Arsenal
            </Link>
            <Link to="/login" className="item">
              Login
            </Link>
            <p>or</p>
            <Link to="/signup" className="item">
              Signup
            </Link>
          </nav>
        </header>
        <main>
          <p>splash page</p>
        </main>
      </div>
    )
  }
}

export default connect()(SplashPage)
