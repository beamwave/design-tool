import React, { Component } from 'react'
import { Route, Redirect, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import * as H from 'history'
import MySidebarContent from '../components/MySidebarContent'
import Header from '../components/Header'
import ModalContainer from '../components/ModalContainer'

interface RouteProps {
  location?: H.Location
  component?:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>
  render?: ((props: RouteComponentProps<any>) => React.ReactNode)
  children?:
    | ((props: RouteComponentProps<any>) => React.ReactNode)
    | React.ReactNode
  path?: string
  exact?: boolean
  strict?: boolean
}

interface StateProps {
  sidebar: boolean
  isAuthenticated?: boolean
}

interface DispatchProps {
  startLogout?: () => void
}

type Props = StateProps & DispatchProps & RouteProps

class PrivateRoute extends Component<Props> {
  componentDidMount = () => console.log('private route re-rendered!')

  render = () => {
    const {
      sidebar,
      isAuthenticated,
      component: Component,
      ...rest
    } = this.props

    return (
      <Route
        {...rest}
        component={props =>
          isAuthenticated ? (
            <div className="private">
              <div
                className={sidebar ? 'sidebar expanded' : 'sidebar collapsed'}
              >
                <MySidebarContent />
              </div>
              <div className="content">
                <Header />
                <Component {...props} />
              </div>
              <ModalContainer />
            </div>
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    )
  }
}

const mapStateToProps = state => ({
  email: state.auth.email,
  isAuthenticated: !!state.auth.token,
  sidebar: state.app.sidebarOpen
})

export default connect<StateProps, DispatchProps, RouteProps>(
  mapStateToProps,
  null,
  null,
  {
    pure: true
    // pure: false
  }
)(PrivateRoute)
