import React, { Component } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { FontAwesomeIcon } from '../../../node_modules/@fortawesome/react-fontawesome'

import { connect } from 'react-redux'
import { startSignup } from '../actions/auth'
import { generateUuid } from '../helpers/helpers'

interface IProps {
  history?: any
  startSignup(data: {}): any
}

interface IState {
  username: string
  email: string
  password: string
  message: string
  admin: boolean
  errors: {
    username: string
    email: string
    password: string
  }
}

export class SignupPage extends Component<IProps, IState> {
  state = {
    email: '',
    fullname: '',
    username: '',
    password: '',
    message: '',
    admin: false,
    errors: {
      username: '',
      email: '',
      password: '',
      global: ''
    }
  }

  // @ts-ignore
  onFieldChange = e => {
    const { name, value } = e.target
    this.setState({
      [name]: value
    } as any)
  }

  // @ts-ignore
  onSubmit = async e => {
    e.preventDefault()
    const { startSignup, history } = this.props
    const personName = this.state.fullname.split(' ')

    // single variable used in cognito signup
    const { email, username, password, admin } = this.state

    const data = {
      email: this.state.email,
      firstname: personName[0],
      lastname: personName[personName.length - 1],
      username: this.state.username,
      password: this.state.password
      // uid: generateUuid()
      // role: admin ? 'admin' : 'employee'
    }

    try {
      console.log('starting signup')
      const res = await startSignup(data)
      console.log('login success', res)
      history.push('/dashboard')
    } catch (err) {
      console.log('login failure', err)
      this.setState({ errors: err.response.data.errors })
    }
  }

  // @ts-ignore
  render = () => {
    const { errors, admin, message } = this.state
    return (
      <div className="signup-page">
        <div className="signup-bg" />
        <Link to="/" className="header">
          <div className="globe">
            <FontAwesomeIcon icon="globe" />
          </div>
          <h1 className="app-name">Arsenal</h1>
        </Link>
        <form
          autoComplete="off"
          className="signup-form"
          onChange={this.onFieldChange}
          onSubmit={this.onSubmit}
        >
          <div className="input-group">
            <label htmlFor="email" className="title">
              email
            </label>
            <input type="email" name="email" />
          </div>
          <div className="input-group">
            <label htmlFor="fullname" className="title">
              full name
            </label>
            <input type="text" name="fullname" />
          </div>
          <div className="input-group">
            <label htmlFor="username" className="title">
              username
            </label>
            <input type="text" name="username" />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="title">
              password
            </label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
            />
          </div>
          <div className="input-group">
            <div className="switch-page">
              <p className="text">Already have an account?</p>
              <Link to="/login" className="login-link">
                &nbsp;Login
              </Link>
            </div>
            <button type="submit" className="signup-button button">
              Signup
            </button>
          </div>
        </form>
        {!!errors.global && <p>{errors.global}</p>}
        {message && <div className="message">{message}</div>}
        <div className="signup-overlay" />
        <div className="signup-bg" />
      </div>
    )
  }
}

export default connect(
  null,
  { startSignup }
)(SignupPage)
