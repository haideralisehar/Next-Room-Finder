"use client";
import React, { Component } from "react";
import { useState } from "react";

import "../Wallet/WalletPopup.css";
import Cookies from "js-cookie";
import Image from "next/image";

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
      showCancelModal: false, // ✅ add this
      loadingfetch: false,
      topupAmount: "", // ✅ add this
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

  handleTopupAmountChange = (e) => {
    const value = e.target.value;

    // allow only numbers
    if (/^\d*$/.test(value)) {
      this.setState({ topupAmount: value });
    }
  };

  handleTopup = async () => {
    const { topupAmount } = this.state;

    if (!topupAmount || Number(topupAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    console.log("Topup Amount:", topupAmount);
    const agencyId = Cookies.get("agencyId");
    const serviceAdded = 1/100 * topupAmount;
    const finalcost = Number(topupAmount) + Number(serviceAdded)
    // TODO: Call topup API here

    try {
      this.setState({showCancelModal: false});
      this.setState({ loadingfetch: true });
      const response = await fetch("/api/tap/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: topupAmount,
          customer: {
            firstName: "Haider Ali",
            lastName: "Sehar",
            email: "haider@gmail.com",
            phone: "0345654344",
            country_Code: "+92",
          },

          metadata: {
            created_at: new Date().toISOString(), // ✅ today date & time
            ag_id: agencyId,
          },
        }),
      });

      const data = await response.json();
      this.setState({ loadingfetch: false });

      // ✅ Handle Tap API response clearly
      if (response.ok && data?.url) {
        window.location.href = data.url;
        this.setState({ loadingfetch: false });
      } else {
        console.error("Payment Error:", data);
        const message =
          typeof data.error === "object"
            ? JSON.stringify(data.error)
            : data.error || "Unable to process payment.";
        alert("Error: " + message);
        this.setState({ loadingfetch: false });
      }
    } catch (err) {
      console.error("Payment Exception:", err);
      alert("Payment failed: " + err.message);
      this.setState({ loadingfetch: false });
    } finally {
      // setLoading(false);
      this.setState({ loadingfetch: false });
    }

    this.setState({
      showCancelModal: false,
      topupAmount: "",
    });
  };

  fetchWalletData = async (agencyId) => {
    this.setState({ loading: true, error: null });

    try {
      // Call both API requests at the same time
      const [walletRes, loyaltyRes] = await Promise.all([
        fetch(`/api/wallet`),
        fetch(`/api/getLotality?agencyId=${agencyId}`),
      ]);

      if (!walletRes.ok || !loyaltyRes.ok) {
        console.log("Failed to fetch wallet or loyalty data");
      }

      const walletData = await walletRes.json();
      const loyaltyData = await loyaltyRes.json();

      // console.log(loyaltyData[0].value);
      // console.log("wallet_id",walletData?.id,agencyId );

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
      showCancelModal,
      topupAmount,
      loadingfetch,
    } = this.state;

    const handleCancel = () => {
      this.setState({ showCancelModal: true });
      this.setState({showPopup: false});
    };

    return (
      <div className="wallet-header" ref={this.wrapperRef}>
        <button className="wallet-btn" onClick={this.togglePopup}>
          Wallet
        </button>

        {loadingfetch && (
          <div className="loading-container">
            <div className="box">
              <Image
                className="circular-left-right"
                src="/loading_ico.png"
                alt="Loading"
                width={200}
                height={200}
              />
              <p style={{ fontSize: "13px", color: "black" }}>Please Wait...</p>
            </div>
          </div>
        )}

        {showPopup && (
          <div className="wallet-dropdown">
            {/* <h2>My Wallet</h2> */}

            {loading ? (
              <div className="wallet-loader">
                <div className="spinner-w"></div>
                <p>Please Wait...</p>
              </div>
            ) : error ? (
              <div
                style={{
                  padding: "5px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p className="error-text">Error: {error}</p>

                <button
                  onClick={() => window.location.reload()}
                  className="reload"
                  style={{ color: "black" }}
                >
                  ⟳
                </button>
              </div>
            ) : (
              <>
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
                      <h3 style={{ color: "rgba(36, 36, 36, 1)" }}>
                        {loyaltyPoints}
                      </h3>
                      <p>Loyality Points</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleCancel()}
                  className="topup-btn"
                  style={{ color: "white", width: "100%", padding: "6px" }}
                >
                  Topup Wallet
                </button>
              </>
            )}
          </div>
        )}

        {showCancelModal && (
          <div className="modal-overlayer">
            <div className="modal-boxes" onClick={(e) => e.stopPropagation()}>
              {/* Label */}
              <div className="modal-row">
                <label className="modal-labels">Enter Topup Amount (BHD)</label>
                <label htmlFor=""></label>
              </div>

              {/* Full width input */}
              <div className="modal-rows">
                <input
                  type="text"
                  className="modal-input-fields"
                  placeholder="e.g. 1000"
                  value={this.state.topupAmount}
                  onChange={this.handleTopupAmountChange}
                />

                
              <div style={{display:"flex", justifyContent:"space-between", margin:"5px 0px", color:"#717171ff", fontSize:"13px"}}>
                <h4>Service Charges</h4>
                <span>≃ {1/100 * topupAmount}</span>
                </div>

                <div style={{display:"flex", justifyContent:"space-between", margin:"0px 0px", color:"#717171ff", fontSize:"13px"}}>
                <h4>Charges Included</h4>
                <span>= {Number(topupAmount) + Number(1/100 * topupAmount)}</span>
                </div>


              </div>

              {/* Buttons */}
              <div className="modal-actionses">
                <button
                  className="btns"
                  onClick={() =>
                    this.setState({ showCancelModal: false, topupAmount: "" })
                  }
                >
                  Cancel
                </button>

                <button
                  className="btns dangers"
                  disabled={!this.state.topupAmount}
                  onClick={this.handleTopup}
                >
                  Topup Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default WalletPopup;
