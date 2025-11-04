"use client";
import React, { Component } from "react";
import "./mobilewallet.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

class WalletPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "wallet",
      availableBalance: 0,
      creditBalance: 0,
      debitBalance: 0,
      transactions: [
        { id: 1, title: "Hotel Booking", amount: "-$120.00", date: "Nov 2, 2025" },
        { id: 2, title: "Flight Credit", amount: "+$80.00", date: "Nov 1, 2025" },
        { id: 3, title: "Taxi Ride", amount: "-$25.50", date: "Oct 30, 2025" },
      ],
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchWalletData("eade81a7-ead9-4879-9cb3-3d8ce82fb7ee"); // ✅ Replace "any" with actual agencyId when ready
  }

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
      console.error("Wallet fetch error:", err);
      this.setState({ error: err.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  switchTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  render() {
    const {
      activeTab,
      transactions,
      availableBalance,
      creditBalance,
      debitBalance,
      loading,
      error,
    } = this.state;

    return (
      <>
        <Header />

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

                    <div className="wallet-balance debit">
                      <span className="wallet-icon">💸</span>
                      <div className="wallet-info">
                        <p>Debit Balance</p>
                        <h3>${debitBalance}</h3>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Transactions Tab */}
                <h2 className="transaction-head">Recent Transactions</h2>

                <div className="transactions-list">
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
          </div>
        </div>

        <Footer />
      </>
    );
  }
}

export default WalletPage;
