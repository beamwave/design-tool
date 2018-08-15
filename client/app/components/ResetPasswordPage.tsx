import React, { Component } from 'react'
import { Link } from 'react-router-dom'

interface IState {
  newPassword: string
}

export class ResetPasswordPage extends Component<{}, IState> {
  state = {
    newPassword: ''
  }

  handleChange = e => {
    // const {newPassword} = this.state
    this.setState({
      newPassword: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    console.log(
      'stopping submission. When code is done, will submit new password: ',
      this.state.newPassword
    )
  }

  // @ts-ignore
  render = () => {
    const { newPassword } = this.state
    return (
      <div>
        <Link to="/login">Logo</Link>
        <br />
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="password">Enter a new password</label>
          <input type="text" name="password" value={newPassword} />
          <button type="submit">Submit</button>
        </form>
        {/* <Link to="/login">login</Link> */}
      </div>
    )
  }
}

export default ResetPasswordPage
