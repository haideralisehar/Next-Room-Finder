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
       loyaltyPoints: 0,
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
    // Call both API requests at the same time
    const [walletRes, loyaltyRes] = await Promise.all([
      fetch(`/api/wallet?agencyId=${agencyId}`),
      fetch(`/api/getLotality?agencyId=${agencyId}`)
    ]);

    if (!walletRes.ok || !loyaltyRes.ok) {
      console.log("Failed to fetch wallet or loyalty data");
    }

    const walletData = await walletRes.json();
    const loyaltyData = await loyaltyRes.json();

    console.log(loyaltyData[0].value);
console.log("wallet_id",walletData?.id,agencyId );


    // Update state
    this.setState({
      availableBalance: walletData.availableBalance ?? 0,
      creditBalance: walletData.creditBalance ?? 0,
      debitBalance: walletData.debitBalance ?? 0,
      loyaltyPoints: loyaltyData[0].value ?? 0, // coming from second API
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
      loyaltyPoints,
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
            {/* <h2>My Wallet</h2> */}
            


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
                  {/* <span className="wallet-icon">💰</span> */}
                  <div className="wallet-info">
                    <h3>{availableBalance}</h3>
                    <p>Available Balance</p>
                    
                  </div>
                </div>

                <div className="wallet-balance credit">
                  {/* <span className="wallet-icon">🏛️</span> */}
                  <div className="wallet-info">
                    <h3>{creditBalance}</h3>
                    <p>Credit Balance</p>
                    
                  </div>
                </div>

                <div className="wallet-balance credit">
                  {/* <span className="wallet-icon">💸</span> */}
                  <div className="wallet-info">
                     <h3 style={{ color: "green" }}>{debitBalance}</h3>
                    <p>Debit Balance</p>
                   
                  </div>
                </div>

                <div className="wallet-balance credit">
                  {/* <span className="wallet-icon">💸</span> */}
                  <div className="wallet-info">
                    <h3 style={{ color: "rgba(36, 36, 36, 1)" }}>{loyaltyPoints}</h3>
                    <p>Loyality Points</p>
                    
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
