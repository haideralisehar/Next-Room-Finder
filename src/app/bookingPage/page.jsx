// components/BookingsPage.jsx
"use client"
import React, { useMemo, useState } from "react";
import styles from "./Bookings.module.css";
import Header from "../components/Header"

// Sample data (replace with real data later)
const SAMPLE_ROWS = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  superPnr: 129900 + i,
  service: "Flight",
  customer: ["High Sky Travels", "LINNAS TRAVELs", "AL MADINA TRAVELs"][i % 3],
  pnr: ["YZNBDG", "DMJN3P", "DMJJ20", "QLEOVV", "DMJ5H8"][i % 5],
  paxName: ["Faisal Hasan", "Abdur Rahim", "Jehen Akbar"][i % 3],
  bookedDate: `0${(i % 30) + 1}-Oct-2025`,
  user: ["FAYYAZHS", "RAFIQ", "ALMADINA", "TALHAK"][i % 4],
  amendment: "",
  searchId: 2523872 + i,
  pgStatus: "",
  trackId: "",
}));

export default function BookingsPage() {
  // UI state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [highlightId, setHighlightId] = useState(12); // example highlighted row

  // Filtered rows (simple text filter + status + date stubs)
  const filtered = useMemo(() => {
    let data = SAMPLE_ROWS;

    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(
        (r) =>
          String(r.superPnr).includes(q) ||
          r.customer.toLowerCase().includes(q) ||
          r.paxName.toLowerCase().includes(q) ||
          (r.pnr && r.pnr.toLowerCase().includes(q))
      );
    }

    if (status) {
      // Example: this just filters by 'Flight' as a demo
      data = data.filter((r) => r.service.toLowerCase() === status.toLowerCase());
    }

    // Date filters could be applied here when you wire real bookedDate values
    return data;
  }, [query, status]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const pagedRows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Handlers
  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(new Set(pagedRows.map((r) => r.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const toggleRow = (id) => {
    setSelectedRows((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const onSearch = (e) => {
    e?.preventDefault();
    setPage(1);
    // we already filter on query & status
  };

  const onExport = () => {
    // stub: you can create CSV from `filtered`
    const csv = filtered
      .map(
        (r) =>
          `"${r.superPnr}","${r.service}","${r.customer}","${r.pnr}","${r.paxName}","${r.bookedDate}","${r.user}"`
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookings_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
    <Header/>
    <div className={styles.page}>
      <header className={styles.header}>
        <h2>Bookings</h2>
      </header>

      <section className={styles.controls}>
        <form className={styles.filterRow} onSubmit={onSearch}>
          <div className={styles.dateGroup}>
            <label>
              Start date
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className={styles.input}
              />
            </label>
            <label>
              End date
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className={styles.input}
              />
            </label>
          </div>

          <div className={styles.selectGroup}>
            <label>
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={styles.input}>
                <option value="">All</option>
                <option value="Flight">Flight</option>
                <option value="Hotel">Hotel</option>
                <option value="Cancel">Cancel</option>
              </select>
            </label>
          </div>

          <div className={styles.actionGroup}>
            <input
              type="text"
              placeholder="Search by PNR, name or agent..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
            />
            <div className={styles.buttons}>
              <button type="submit" className={styles.btnPrimary}>
                Search
              </button>
              <button type="button" className={styles.btnGhost} onClick={onExport}>
                Export Unattempted Transactions
              </button>
              <button type="button" className={styles.btnGhost}>
                Visa document download
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className={styles.tableWrap}>
        <div className={styles.tableActions}>
          <div>
            <label>
              Show
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className={styles.smallSelect}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              entries
            </label>
          </div>

          <div className={styles.pageInfo}>
            <small>
              View { (page - 1) * rowsPerPage + 1 } - { Math.min(page * rowsPerPage, filtered.length) } of { filtered.length }
            </small>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.checkboxCell}>
                  <input
                    type="checkbox"
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    checked={pagedRows.length > 0 && pagedRows.every((r) => selectedRows.has(r.id))}
                  />
                </th>
                <th>Action</th>
                <th>Super PNR</th>
                <th>Services</th>
                <th>Customer</th>
                <th>PNR no</th>
                <th>Pax Name</th>
                <th>Booked date</th>
                <th>User</th>
                <th>Amendment</th>
                <th>Search id</th>
                <th>Pg Status</th>
                <th>Trackid</th>
              </tr>
            </thead>

            <tbody>
              {pagedRows.map((r) => {
                const highlighted = r.id === highlightId;
                return (
                  <tr key={r.id} className={`${highlighted ? styles.highlightRow : ""}`}>
                    <td className={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(r.id)}
                        onChange={() => toggleRow(r.id)}
                      />
                    </td>

                    <td>
                      <div className={styles.actionBtnWrap}>
                        <button className={styles.actionBtn}>Action ▾</button>
                      </div>
                    </td>

                    <td>{r.superPnr}</td>
                    <td>{r.service}</td>
                    <td>{r.customer}</td>
                    <td>{r.pnr}</td>
                    <td>{r.paxName}</td>
                    <td>{r.bookedDate}</td>
                    <td>{r.user}</td>
                    <td>{r.amendment}</td>
                    <td>{r.searchId}</td>
                    <td>{r.pgStatus}</td>
                    <td>{r.trackId}</td>
                  </tr>
                );
              })}

              {pagedRows.length === 0 && (
                <tr>
                  <td colSpan={13} className={styles.emptyRow}>
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <div>
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className={styles.pageBtn}
            >
              « First
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={styles.pageBtn}
            >
              ‹ Prev
            </button>
          </div>

          <div className={styles.pageCenter}>
            <span>Page</span>
            <input
              type="number"
              min={1}
              max={totalPages || 1}
              value={page}
              onChange={(e) => {
                let v = Number(e.target.value || 1);
                if (v < 1) v = 1;
                if (v > totalPages) v = totalPages;
                setPage(v);
              }}
              className={styles.pageInput}
            />
            <span>of {totalPages || 1}</span>
          </div>

          <div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className={styles.pageBtn}
            >
              Next ›
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page >= totalPages}
              className={styles.pageBtn}
            >
              Last »
            </button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
