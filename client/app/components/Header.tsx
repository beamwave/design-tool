import React, { Component } from 'react'
import { Link } from 'react-router-dom'
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
  changeCategory,
  trainingWheelsProtocol,
  startSearch
} from '../actions/app'
import { startLogout } from '../actions/auth'
import { loadModal } from '../actions/modal'
import { ADD_IMAGE_MODAL } from '../constants/modaltypes'

interface RProps {
  photo?: string
  username?: string
  isAuthenticated?: boolean
  trainingWheels?: boolean
  category?: string
}

interface RState {
  sidebar?: any
  startSearch?: (query: string) => any
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
    query: ''
  }

  toggleDropdown = () =>
    this.setState({ dropdownOpen: !this.state.dropdownOpen })

  // @ts-ignore
  // needs to be attached to document for click detection
  componentDidMount = () =>
    document.addEventListener('click', this.determineClick, false)

  //@ts-ignore
  // needs to be attached to document for click detection
  componentWillUnmount = () =>
    document.removeEventListener('click', this.determineClick)

  addImageModal = () => this.props.loadModal(ADD_IMAGE_MODAL)

  handleCategoryChange = ({ target }) => {
    this.props.changeCategory(target.value)
  }

  toggleTrainingWheels = () => this.props.trainingWheelsProtocol()

  determineClick = e => {
    // if click outside modal or not typing in input, hide search
    if (!e.target.closest('.section') && !e.target.dataset.search) {
      this.hideSearch()
    }

    // else if you click inside or type in input, ...
  }

  showSearch = () => this.setState({ showSearch: true })

  hideSearch = () => this.setState({ showSearch: false })

  onFieldChange = async e => {
    const {
      target: { value }
    } = e
    const { startSearch } = this.props
    this.setState({
      term: value,
      query: value
    } as any)
    // send term to database
    // await startSearch(query)
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
      query: this.state.term
    })
  }

  // @ts-ignore
  render = () => {
    const {
      photo,
      username,
      isAuthenticated,
      trainingWheels,
      category,
      startLogout
    } = this.props
    const { showSearch, term, query } = this.state

    return (
      <header className="nav-header">
        <SearchResults query={query} showSearch={showSearch} />
        <div className="plus" onClick={this.addImageModal}>
          <FontAwesomeIcon icon="plus" />
          <p className="hint">upload image</p>
        </div>
        <div className="settings">
          <FontAwesomeIcon icon="cog" />
          <p className="hint">settings</p>
        </div>
        <div className="protocol" onClick={this.toggleTrainingWheels}>
          {trainingWheels ? (
            <FontAwesomeIcon icon="lock" />
          ) : (
            <FontAwesomeIcon icon="unlock" />
          )}
          <p className="hint">
            {trainingWheels ? 'deactive' : 'active'} training wheels protocol
          </p>
        </div>
        <div className="search-group">
          <FontAwesomeIcon icon="search" className="icon" />
          <form className="submit" onSubmit={this.handleSubmit}>
            <input
              type="text"
              className="input spawnSearch"
              placeholder="Search"
              data-search={true}
              onFocus={this.showSearch}
              onChange={this.onFieldChange}
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
                background: `url(${photo}) center / cover no-repeat`,
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

const mapStateToProps = state => ({
  photo: state.auth.profileImage,
  username: state.auth.username,
  isAuthenticated: !!state.auth.token,
  category: state.app.category,
  trainingWheels: state.app.trainingWheels
})

export default connect<RProps, any>(
  mapStateToProps,
  {
    sidebar,
    changeCategory,
    trainingWheelsProtocol,
    startSearch,
    loadModal,
    startLogout
  }
)(Header)
