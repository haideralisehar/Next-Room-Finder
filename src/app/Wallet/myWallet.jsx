"use client";
import React, { Component } from "react";
import "../Wallet/WalletPopup.css";
import Cookies from "js-cookie";

class WalletPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      availableBalance: 0,
      creditBalance: 0,
      debitBalance: 0,
      isMounted: false,
      loading: false,
      error: null,
    };
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    this.setState({ isMounted: true });
    document.addEventListener("mousedown", this.handleClickOutside);
     const agencyId = Cookies.get("agencyId");
    this.fetchWalletData(agencyId); 
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

  fetchWalletData = async (agencyId) => {
    this.setState({ loading: true, error: null });
    try {
      const res = await fetch(`/api/wallet?agencyId=${agencyId}`);
      if (!res.ok) {
        console.log("Failed to fetch wallet balances");
      }

      const data = await res.json();
      this.setState({
        availableBalance: data.availableBalance,
        creditBalance: data.creditBalance,
        debitBalance: data.debitBalance,
      });
    } catch (err) {
      console.error("Error fetching wallet:", err);
      this.setState({ error: err.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    if (!this.state.isMounted) return null;

    const {
      showPopup,
      availableBalance,
      creditBalance,
      debitBalance,
      loading,
      error,
    } = this.state;

    return (
      <div className="wallet-header" ref={this.wrapperRef}>
        <button className="wallet-btn" onClick={this.togglePopup}>
          Wallet
        </button>

        {showPopup && (
          <div className="wallet-dropdown">
            <h2>My Wallet</h2>

            {loading ? (
              <div className="wallet-loader">
                <div className="spinner-w"></div>
                <p>Please Wait...</p>
              </div>
            ) : error ? (
              <p className="error-text">Error: {error}</p>
            ) : (
              <div className="wallet-balance-container">
                <div className="wallet-balance">
                  <span className="wallet-icon">💰</span>
                  <div className="wallet-info">
                    <p>Available Balance</p>
                    <h3>${availableBalance}</h3>
                  </div>
                </div>

                <div className="wallet-balance credit">
                  <span className="wallet-icon">🏛️</span>
                  <div className="wallet-info">
                    <p>Credit Balance</p>
                    <h3>${creditBalance}</h3>
                  </div>
                </div>

                <div className="wallet-balance credit">
                  <span className="wallet-icon">💸</span>
                  <div className="wallet-info">
                    <p>Debit Balance</p>
                    <h3 style={{ color: "green" }}>${debitBalance}</h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default WalletPopup;
