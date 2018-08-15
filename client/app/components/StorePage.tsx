import React, { Component } from 'react'
import { connect } from 'react-redux'
import ParseIcon from '../../public/icons/parse-icon.svg'
import DoubleIcon from '../../public/icons/double-icon.svg'
import ForgiveIcon from '../../public/icons/forgive-icon.svg'
import CoinIcon from '../../public/icons/coin-icon.svg'

export class StorePage extends Component {
  // @ts-ignore
  render = () => {
    return (
      <div className="store-page">
        <div className="main">
          <header>
            <h1 className="title">Store</h1>
            <button className="button" disabled={false}>
              Buy
            </button>
          </header>
          <main>
            <div className="powerup-row">
              <div className="powerup-icon">
                <ParseIcon className="icon" />
              </div>
              <div className="powerup-info">
                <p className="title">Parse</p>
                <p className="description">
                  Removes a single possible answer from a multiple choice
                  question.
                </p>
              </div>
              <div className="powerup-pricing">
                <div className="container">
                  <CoinIcon className="icon" />
                </div>
                <p className="price">15</p>
              </div>
            </div>
            <div className="powerup-row">
              <div className="powerup-icon">
                <DoubleIcon className="icon" />
              </div>
              <div className="powerup-info">
                <p className="title">Multiplier</p>
                <p className="description">
                  Doubles the total points you get for a quiz.
                </p>
              </div>
              <div className="powerup-pricing">
                <div className="container">
                  <CoinIcon className="icon" />
                </div>
                <p className="price">150</p>
              </div>
            </div>
            <div className="powerup-row">
              <div className="powerup-icon">
                <ForgiveIcon className="icon" />
              </div>
              <div className="powerup-info">
                <p className="title">Forgiving</p>
                <p className="description">
                  Forgives one wrong answer in a quiz and removes it from the
                  final calculated score.
                </p>
              </div>
              <div className="powerup-pricing">
                <div className="container">
                  <CoinIcon className="icon" />
                </div>
                <p className="price">200</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }
}

export default connect()(StorePage)
