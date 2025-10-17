"use client";
import React, { Component } from "react";
import "../Wallet/WalletPopup.css";

class WalletPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      availableBalance: 45.99,
      creditBalance: 23.87,
      debitBalance:20.78
    };
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.wrapperRef.current &&
      !this.wrapperRef.current.contains(event.target)
    ) {
      this.setState({ showPopup: false });
    }
  };

  togglePopup = () => {
    this.setState((prev) => ({ showPopup: !prev.showPopup }));
  };

  render() {
    return (
      <div className="wallet-header" ref={this.wrapperRef}>
        {/* Wallet Button aligned right */}
        <button className="wallet-btn" onClick={this.togglePopup}>
          Wallet
        </button>

        {/* Dropdown Popup */}
        {this.state.showPopup && (
          <div className="wallet-dropdown">
            <h2>My Wallet</h2>
            <div className="wallet-balance-container">
              <div className="wallet-balance">
                <span className="wallet-icon">💰</span>
                <div className="wallet-info">
                  <p>Available Balance</p>
                  <h3>${this.state.availableBalance || "0.00"}</h3>
                </div>
              </div>

              <div className="wallet-balance credit">
                <span className="wallet-icon">🏛️</span>
                <div className="wallet-info">
                  <p>Credit Balance</p>
                  <h3>${this.state.creditBalance || "0.00"}</h3>
                </div>
              </div>
              <div className="wallet-balance credit">
                <span className="wallet-icon">💸</span>
                <div className="wallet-info">
                  <p>Debit Balance</p>
                  <h3 style={{color:"green"}}>${this.state.debitBalance || "0.00"}</h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default WalletPopup;
