import React, { Component } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
// import Sidebar from 'react-sidebar'
import createHistory from 'history/createBrowserHistory'

// import SidebarContent from '../components/SidebarContent'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'

import SplashPage from '../components/SplashPage'
import LoginPage from '../components/LoginPage'
import SignupPage from '../components/SignupPage'
import DashboardPage from '../components/DashboardPage'
import ImagePage from '../components/ImagePage'

import ResetPasswordPage from '../components/ResetPasswordPage'

import SettingsPage from '../components/SettingsPage'
import ProfilePage from '../components/ProfilePage'
import NotFoundPage from '../components/NotFoundPage'

export const history = createHistory()

// const mql = window.matchMedia(`(min-width: 800px)`)

interface IProps {
  history?: any
  sidebarOpen?: any
}
// interface IState {
//   mql: MediaQueryList
//   sidebarDocked: boolean
//   // sidebarOpen: boolean
// }

// sidebar content
// const sidebar = <SidebarContent />

export class Pages extends Component<IProps> {
  // state = {
  //   mql: mql,
  //   sidebarDocked: false
  //   // sidebarOpen: true
  // }

  // mediaQueryChanged = () => {
  //   this.setState({ sidebarDocked: this.state.mql.matches })
  // }

  // onSetSidebarOpen = () =>
  //   this.setState({ sidebarOpen: !this.state.sidebarOpen })

  // @ts-ignore
  // componentWillMount = () => {
  //   mql.addListener(this.mediaQueryChanged)
  //   this.setState({ mql: mql, sidebarDocked: mql.matches })
  // }

  // @ts-ignore
  // componentWillUnmount = () => {
  //   this.state.mql.removeListener(this.mediaQueryChanged)
  // }

  // @ts-ignore
  // componentWillReceiveProps = (props, nextProps) => {
  //   console.log('...old props?', props)
  //   console.log('...new props?', nextProps)
  //   this.setState({ sidebarDocked: nextProps.sidebarOpen })
  // }

  // @ts-ignore
  // shouldComponentUpdate = () => false

  // @ts-ignore
  render = () => (
    <Router history={history}>
      <Switch>
        <PublicRoute exact path="/" component={SplashPage} />
        <PublicRoute path="/signup" component={SignupPage} />
        <PublicRoute path="/login" component={LoginPage} />
        <PublicRoute path="/resetpassword" component={ResetPasswordPage} />

        <PrivateRoute path="/dashboard" component={DashboardPage} />
        <PrivateRoute path="/image/:_id" component={ImagePage} />
        <PrivateRoute path="/settings" component={SettingsPage} />

        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  )
}

const mapStateToProps = state => ({
  // sidebarOpen: state.app.sidebarOpen
})

export default connect(mapStateToProps)(Pages)
