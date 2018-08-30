import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import SearchResults from './SearchResults'
import {
  sidebar,
  toggleEditMode,
  changeCategory,
  trainingWheelsProtocol,
  startSearch
} from '../actions/app'
import { startSearchByTag } from '../actions/images'
import { startLogout } from '../actions/auth'
import { loadModal } from '../actions/modal'
import { ADD_IMAGE_MODAL } from '../constants/modaltypes'

interface RProps {
  photo?: string
  username?: string
  isAuthenticated?: boolean
  trainingWheels?: boolean
  category?: string
  backButton?: boolean
  history?: any
}

interface RState {
  sidebar?: any
  startSearch?: (query: any) => any
  startSearchByTag?: (data: any) => any
  toggleEditMode?: () => any
  trainingWheelsProtocol?: () => any
  changeCategory?: (string) => any
  loadModal?: (string) => any
  startLogout?: () => void
}

type Props = RProps & RState

export class Header extends Component<Props> {
  state = {
    category: this.props.category,
    dropdownOpen: false,
    showSearch: false,
    term: '',
    editMode: false
  }

  toggleDropdown = () =>
    this.setState({ dropdownOpen: !this.state.dropdownOpen })

  toggleTrainingWheels = () => this.props.trainingWheelsProtocol()

  toggleEditMode = () => this.props.toggleEditMode()

  // needs to be attached to document for click detection
  componentDidMount = () =>
    document.addEventListener('click', this.determineClick, false)

  // needs to be attached to document for click detection
  componentWillUnmount = () =>
    document.removeEventListener('click', this.determineClick)

  addImageModal = () => this.props.loadModal(ADD_IMAGE_MODAL)

  handleCategoryChange = ({ target }) => {
    this.props.changeCategory(target.value)
  }

  determineClick = e => {
    // if click outside modal or not typing in input, hide search
    if (!e.target.closest('.section') && !e.target.dataset.search) {
      this.hideSearch()
    }

    // else if you click inside or type in input, ...
  }

  showSearch = () => this.setState({ showSearch: true })

  hideSearch = () => this.setState({ showSearch: false })

  handleSearch = async e => {
    // get search query
    const {
      target: { value: query }
    } = e

    const { category, startSearch } = this.props

    // this.setState({
    //   query
    // } as any)

    // send term to database
    await startSearch({ query, category })
  }

  handleSelectColor = category => {
    if (category === 'art') return 'select teal'
    if (category === 'comments') return 'select violet'
    if (category === 'clothes') return 'select blue'
    if (category === 'people') return 'select grey'
  }

  handleSubmit = e => {
    e.preventDefault()
    this.setState({
      term: this.state.term
    })
  }

  render = () => {
    const {
      photo,
      username,
      isAuthenticated,
      trainingWheels,
      category,
      startLogout,
      backButton,
      history
    } = this.props
    const { showSearch, term } = this.state

    return (
      <header className="nav-header">
        <SearchResults query={term} showSearch={showSearch} />
        {!backButton ? (
          <div className="plus" onClick={this.addImageModal}>
            <FontAwesomeIcon icon="plus" />
            <p className="hint">upload image</p>
          </div>
        ) : (
          <div className="plus" onClick={() => history.goBack()}>
            <FontAwesomeIcon icon="arrow-left" />
            <p className="hint">go back</p>
          </div>
        )}
        <div className="settings">
          <FontAwesomeIcon icon="cog" />
          <p className="hint">settings</p>
        </div>
        {!backButton && (
          <div className="protocol" onClick={this.toggleTrainingWheels}>
            {trainingWheels ? (
              <FontAwesomeIcon icon="lock" />
            ) : (
              <FontAwesomeIcon icon="unlock" />
            )}
            <p className="hint">
              {trainingWheels ? 'deactive' : 'active'} training wheels protocol
              )}
            </p>
          </div>
        )}
        {backButton && (
          <div className="protocol" onClick={this.toggleEditMode}>
            <FontAwesomeIcon icon="sliders-h" />
            <p className="hint">adjust image settings</p>
          </div>
        )}
        <div className="search-group">
          <FontAwesomeIcon icon="search" className="icon" />
          <form className="submit" onSubmit={this.handleSubmit}>
            <input
              type="text"
              className="input spawnSearch"
              placeholder="Search"
              // data-search={true}
              // onFocus={this.showSearch}
              onChange={this.handleSearch}
              value={term}
            />

            <div className="type-choice">
              <div className="angle-down">
                <FontAwesomeIcon icon="angle-down" className="icon" />
              </div>
              <select
                className={this.handleSelectColor(category)}
                value={category}
                onChange={this.handleCategoryChange}
              >
                <option value="art">art</option>
                <option value="comments">comments</option>
                <option value="clothes">clothes</option>
                <option value="people">people</option>
              </select>
            </div>
            <div className="search-options">
              <p className="save-search">save search</p>
              <p className="advanced-search">advanced search</p>
            </div>
          </form>
        </div>

        <Dropdown
          isOpen={this.state.dropdownOpen}
          toggle={this.toggleDropdown}
          className="dropdown-root"
        >
          <DropdownToggle className="dropdown-toggle">
            <p className="nav-username">{username}</p>
            <div
              className="image"
              style={{
                // url bg-pos: x% y% / bg-scale: %
                background: `url(${photo}) 50% 5% / 110% no-repeat`,
                marginRight: 15
              }}
            />
            <FontAwesomeIcon icon="angle-down" className="icon fa-angle-down" />
          </DropdownToggle>
          <DropdownMenu
            right
            className="dropdown-menu"
            style={{
              display: this.state.dropdownOpen === false ? 'none' : 'block'
            }}
          >
            <DropdownItem className="dropdown-item">
              <Link to="/profile" className="profile">
                Profile
              </Link>
            </DropdownItem>
            <DropdownItem
              className="dropdown-item"
              onClick={() => startLogout()}
            >
              {isAuthenticated ? <p className="logout">Logout</p> : null}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </header>
    )
  }
}

const mapStateToProps = (state, props) => ({
  photo: state.auth.profileImage,
  username: state.auth.username,
  isAuthenticated: !!state.auth.token,
  category: state.app.category,
  trainingWheels: state.app.trainingWheels,
  backButton: props.match.params._id ? true : false // for some reason this works
})

export default withRouter<any>(
  connect<RProps, any>(
    mapStateToProps,
    {
      sidebar,
      toggleEditMode,
      changeCategory,
      trainingWheelsProtocol,
      startSearchByTag,
      startSearch,
      loadModal,
      startLogout
    }
  )(Header)
)
