"use client";
import React, { Component } from "react";
import "./mobilewallet.css"; // ✅ new CSS file
import Header from "../components/Header";

class WalletPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availableBalance: 45.99,
      creditBalance: 23.87,
      debitBalance: 20.78,
    };
  }

  render() {
    return (
      <>
      <Header/>
      
      <div className="wallet-page">
        <div className="wallet-card">
          <h2>My Wallet</h2>

          <div className="wallet-balance-container">
            <div className="wallet-balance">
              <span className="wallet-icon">💰</span>
              <div className="wallet-info">
                <p>Available Balance</p>
                <h3>${this.state.availableBalance}</h3>
              </div>
            </div>

            <div className="wallet-balance credit">
              <span className="wallet-icon">🏛️</span>
              <div className="wallet-info">
                <p>Credit Balance</p>
                <h3>${this.state.creditBalance}</h3>
              </div>
            </div>

            <div className="wallet-balance debit">
              <span className="wallet-icon">💸</span>
              <div className="wallet-info">
                <p>Debit Balance</p>
                <h3>${this.state.debitBalance}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }
}

export default WalletPage;
