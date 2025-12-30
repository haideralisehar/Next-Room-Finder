"use client";
import React, { Component } from "react";
import { useEffect } from "react";
import "./mobilewallet.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cookies from "js-cookie";
import Image from "next/image";

class WalletPage extends Component {

 
    

  constructor(props) {
     super(props);
     this.state = {
       activeTab: "wallet",
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
       transactions: [
        // { id: 1, title: "Hotel Booking", amount: "-$120.00", date: "Nov 2, 2025" },
        // { id: 2, title: "Flight Credit", amount: "+$80.00", date: "Nov 1, 2025" },
        // { id: 3, title: "Taxi Ride", amount: "-$25.50", date: "Oct 30, 2025" },
      ],
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
   
       // TODO: Call topup API here
   
       try {
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
       fetch(`/api/wallet?agencyId=${agencyId}`),
       fetch(`/api/getLotality?agencyId=${agencyId}`)
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
 
  switchTab = (tab) => {
    this.setState({ activeTab: tab });
  };
 
   render() {
    //  if (!this.state.isMounted) return null;
 
     const {
       activeTab,
      transactions,
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
    };

    return (
      <>
        <Header />
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
        

        <div className="wallet-page">
          <div className="wallet-card">
            {/* Tabs */}
            <div className="wallet-tabs">
              <button
                className={activeTab === "wallet" ? "tab-btn active" : "tab-btn"}
                onClick={() => this.switchTab("wallet")}
              >
                Wallet
              </button>
              <button
                className={activeTab === "transactions" ? "tab-btn active" : "tab-btn"}
                onClick={() => this.switchTab("transactions")}
              >
                Transactions
              </button>
            </div>

            {/* Wallet Tab */}
            {activeTab === "wallet" ? (
              <>
                <h2>My Wallet</h2>

                {/* ✅ Loader */}
                {loading ? (
                  <div className="wallet-loader">
                    <div className="spinner"></div>
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
                        <h3>{availableBalance}</h3>
                      </div>
                    </div>

                    <div className="wallet-balance credit">
                      <span className="wallet-icon">🏛️</span>
                      <div className="wallet-info">
                        <p>Credit Balance</p>
                        <h3>{creditBalance}</h3>
                      </div>
                    </div>

                    <div className="wallet-balance debit">
                      <span className="wallet-icon">💸</span>
                      <div className="wallet-info">
                        <p>Debit Balance</p>
                        <h3>{debitBalance}</h3>
                      </div>
                    </div>

                    <div className="wallet-balance debit">
                      <span className="wallet-icon">💸</span>
                      <div className="wallet-info">
                        <p>Loyality Points</p>
                        <h3>{loyaltyPoints}</h3>
                      </div>
                    </div>
                    <button
                  onClick={() => handleCancel()}
                  className="topup-btn"
                  style={{ color: "white", width: "100%", padding: "10px", borderRadius:"4px" }}
                >
                  Topup Wallet
                </button>
                  </div>
                )}

                
              </>
            ) : (
              <>
                {/* Transactions Tab */}
                <h2 className="transaction-head">Recent Transactions</h2>

                <div className="transactions-list">

                  {transactions.length <1 && 
                  
                  <p style={{textAlign:"center", paddingTop:"20px"}}>No transactions</p>
                  
                  }

                 

                  {transactions.map((tx) => (
                    <div key={tx.id} className="transaction-item">
                      <div className="transaction-info">
                        <p className="tx-title">{tx.title}</p>
                        <span className="tx-date">{tx.date}</span>
                      </div>
                      <span
                        className={`tx-amount ${
                          tx.amount.startsWith("+") ? "credit" : "debit"
                        }`}
                      >
                        {tx.amount}
                      </span>
                    </div>
                  ))}
                  
                </div>
              </>
            )}

             {showCancelModal && (
          <div className="modal-overlayer">
            <div className="modal-boxes" onClick={(e) => e.stopPropagation()}>
              {/* Label */}
              <div className="modal-row">
                <label className="modal-labels">Enter Topup Amount (BHD)</label>
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
        </div>

        <Footer />
      </>
    );
  }
}

export default WalletPage;
