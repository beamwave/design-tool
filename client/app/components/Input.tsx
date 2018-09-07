import React, { Component } from 'react'

const Input = ({ query, handleChange }) => {
  const Input = (
    <input
      type="text"
      className="input spawnSearch"
      placeholder="Search"
      onChange={handleChange}
      value={query}
    />
  )

  return Input
}

export default Input

// import React, { Component } from 'react'

// interface IProps {
//   handleSearch: (e: any) => Promise<void>
// }

// export class Input extends Component<IProps> {
//   state = {
//     query: ''
//   }

//   handleChange = e => {
//     e.preventDefault()
//     const {
//       target: { value: query }
//     } = e
//     this.setState({ query })
//     this.props.handleSearch(e)
//   }

//   shouldComponentUpdate = (nextProps, nextState) => {
//     console.log('next state', this.state.query)
//     console.log('incoming query', nextState.query)

//     if (nextState.query !== this.state.query) return true

//     return false
//   }
//   render = () => {
//     const { query } = this.state
//     return (
//       <input
//         type="text"
//         className="input spawnSearch"
//         placeholder="Search"
//         onChange={this.handleChange}
//         value={query}
//       />
//     )
//   }
// }

// export default Input
