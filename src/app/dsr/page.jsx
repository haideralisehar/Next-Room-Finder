"use client";
import React, { useEffect, useState } from "react";
import "../styling/DSRPage.css";

const initialData = [
  {
    id: 1,
    lpoNumber: "LPO-1001",
    lpoDateISO: "2025-09-02",
    txType: "Sale",
    svcType: "ManualService - Hotel",
    issueISO: "2025-10-01",
    issueDate: "01-Oct-2025",
    svcISO: "2025-10-03",
    svcDate: "03-Oct-2025",
    docNo: "164-10120064",
    pnr: "PNR129667",
    superPNR: "129667",
    passport: "A1234567",
    paxName: "MALAK MURTHADA ALYUSUFI",
    paxEmail: "malak@example.com",
    svcDtls: "Hotel-LONDON- Duration --S",
    customer: "WORLDWIDE TRAVEL",
    amount: "880.000",
    supplier: "Beds Online",
    supplierDetails: "Beds Online",
    user: "SOHAIL",
    pg: "",
    pgReceipt: "",
    source: "BookingEngine",
    hotelSpecialReq: "",
    status: "Success",
  },
  {
    id: 2,
    lpoNumber: "LPO-1002",
    lpoDateISO: "2025-09-25",
    txType: "Sale",
    svcType: "Hotel",
    issueISO: "2025-10-01",
    issueDate: "01-Oct-2025",
    svcISO: "2025-10-11",
    svcDate: "11-Oct-2025",
    docNo: "cC2rJfPGB9Xx9-R5",
    pnr: "PNR129652",
    superPNR: "129652",
    passport: "B9876543",
    paxName: "FATIMAH ALI A ALKHAWAJAH",
    paxEmail: "faheema@dairytravel.com",
    svcDtls: "MAKKAH-2 Nights-5 Star-Standard Quadruple Suite",
    customer: "AL DAIRY TRAVEL",
    amount: "462.470",
    supplier: "GRN",
    supplierDetails: "GRN",
    user: "DAIRY1",
    pg: "RezLive",
    pgReceipt: "",
    source: "BookingEngine",
    hotelSpecialReq: "",
    status: "Incomplete",
  },
  {
    id: 3,
    lpoNumber: "LPO-1003",
    lpoDateISO: "2025-09-28",
    txType: "Sale",
    svcType: "ManualService - Hotel",
    issueISO: "2025-09-29",
    issueDate: "29-Sep-2025",
    svcISO: "2025-10-05",
    svcDate: "05-Oct-2025",
    docNo: "REZ68DA9469",
    pnr: "PNR129547",
    superPNR: "129547",
    passport: "C5556666",
    paxName: "PETER INBARAJ HEPZHIBAI",
    paxEmail: "peter@example.com",
    svcDtls: "Hotel-LONDON- Duration --HOTEL",
    customer: "VISION TOURS",
    amount: "655.000",
    supplier: "Stuba",
    supplierDetails: "Stuba",
    user: "SOHAIL",
    pg: "",
    pgReceipt: "",
    source: "Agency",
    hotelSpecialReq: "",
    status: "Success",
  },
  // add more rows as needed...
];

export default function DSRPage() {
  const [topFilters, setTopFilters] = useState({
    lpoNumber: "",
    lpoDate: "",
    startDate: "",
    endDate: "",
    fromTravelDate: "",
    toTravelDate: "",
    status: "",
  });

  const [colFilters, setColFilters] = useState({
    txType: "",
    svcType: "",
    issueDate: "",
    svcDate: "",
    docNo: "",
    pnr: "",
    superPNR: "",
    paxName: "",
    paxEmail: "",
    svcDtls: "",
    customer: "",
  });

  const [serviceType, setServiceType] = useState("All"); // All, DFU, FLT, HTL ...
  const [transactionType, setTransactionType] = useState("All"); // All, Success, Incomplete, Unclear
  const [fileName, setFileName] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [data] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [openActionId, setOpenActionId] = useState(null);

  // apply filters (with option to include top filters or not)
  function applyFilters({ includeTop = false } = {}) {
    const top = topFilters;
    const cols = colFilters;

    const result = data.filter((row) => {
      // serviceType filter
      if (serviceType !== "All") {
        // a simple contains check against svcType label or short code
        if (!row.svcType.toLowerCase().includes(serviceType.toLowerCase())) return false;
      }

      // transaction filter
      if (transactionType !== "All") {
        if (row.status !== transactionType) return false;
      }

      // top filters only if includeTop true (Search button)
      if (includeTop) {
        if (top.lpoNumber && !row.lpoNumber.toLowerCase().includes(top.lpoNumber.toLowerCase()))
          return false;

        if (top.lpoDate) {
          if (row.lpoDateISO !== top.lpoDate) return false;
        }

        if (top.status && top.status !== "Select") {
          if (row.status !== top.status) return false;
        }

        if (top.startDate && top.endDate) {
          if (!(row.issueISO >= top.startDate && row.issueISO <= top.endDate)) return false;
        }

        if (top.fromTravelDate && top.toTravelDate) {
          if (!(row.svcISO >= top.fromTravelDate && row.svcISO <= top.toTravelDate)) return false;
        }
      }

      // column filters (instant)
      if (cols.txType && !row.txType.toLowerCase().includes(cols.txType.toLowerCase())) return false;
      if (cols.svcType && !row.svcType.toLowerCase().includes(cols.svcType.toLowerCase())) return false;
      if (cols.issueDate && !row.issueDate.toLowerCase().includes(cols.issueDate.toLowerCase())) return false;
      if (cols.svcDate && !row.svcDate.toLowerCase().includes(cols.svcDate.toLowerCase())) return false;
      if (cols.docNo && !row.docNo.toLowerCase().includes(cols.docNo.toLowerCase())) return false;
      if (cols.pnr && !row.pnr.toLowerCase().includes(cols.pnr.toLowerCase())) return false;
      if (cols.superPNR && !row.superPNR.toLowerCase().includes(cols.superPNR.toLowerCase())) return false;
      if (cols.paxName && !row.paxName.toLowerCase().includes(cols.paxName.toLowerCase())) return false;
      if (cols.paxEmail && !row.paxEmail.toLowerCase().includes(cols.paxEmail.toLowerCase())) return false;
      if (cols.svcDtls && !row.svcDtls.toLowerCase().includes(cols.svcDtls.toLowerCase())) return false;
      if (cols.customer && !row.customer.toLowerCase().includes(cols.customer.toLowerCase())) return false;

      return true;
    });

    setFilteredData(result);
    // reset selected rows when filter changes
    setSelectedRows(new Set());
  }

  // apply column filters / chip filters instantly
  useEffect(() => {
    applyFilters({ includeTop: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colFilters, serviceType, transactionType]);

  // user clicks Search -> apply top filters as well
  function handleSearch(e) {
    e?.preventDefault();
    applyFilters({ includeTop: true });
  }

  function handleTopChange(e) {
    const { name, value } = e.target;
    setTopFilters((p) => ({ ...p, [name]: value }));
  }

  function handleColChange(e) {
    const { name, value } = e.target;
    setColFilters((p) => ({ ...p, [name]: value }));
  }

  function handleFile(e) {
    const f = e.target.files && e.target.files[0];
    if (f) setFileName(f.name);
    else setFileName("");
  }

  function toggleSelectRow(id) {
    setSelectedRows((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  }

  function toggleSelectAllVisible(e) {
    if (e.target.checked) {
      const allIds = filteredData.map((r) => r.id);
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  }

  function exportCSV() {
    if (!filteredData.length) {
      alert("No rows to export");
      return;
    }
    const keys = [
      "lpoNumber",
      "issueDate",
      "svcDate",
      "docNo",
      "pnr",
      "superPNR",
      "paxName",
      "paxEmail",
      "svcDtls",
      "customer",
      "amount",
      "supplier",
      "user",
      "source",
      "status",
    ];
    const header = keys.join(",");
    const rows = filteredData.map((r) =>
      keys.map((k) => `"${(r[k] ?? "").toString().replace(/"/g, '""')}"`).join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dsr_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function toggleActionMenu(id) {
    setOpenActionId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="dsr-container">
      <div className="dsr-topbar">Daily Sales Report(Contains Confirmed And Issued Services)</div>

      <div className="filters-card">
        <div className="filters-header">
          <div>Filter Reports</div>
          <button
            className="collapse-btn"
            onClick={() => setCollapsed((c) => !c)}
            aria-label="toggle"
          >
            {collapsed ? "▾" : "▴"}
          </button>
        </div>

        {!collapsed && (
          <div className="filters-body">
            {/* First row of small filters */}
            <div className="filters-row">
              <label className="field">
                <div className="field-label">LPO Number / Visa App. No</div>
                <input
                  type="text"
                  name="lpoNumber"
                  value={topFilters.lpoNumber}
                  onChange={handleTopChange}
                  placeholder="LPO Number / Visa App No"
                />
              </label>

              <label className="field">
                <div className="field-label">LPO Date</div>
                <input
                  type="date"
                  name="lpoDate"
                  value={topFilters.lpoDate}
                  onChange={handleTopChange}
                />
              </label>

              <div className="lpo-attachment">
                <div className="field-label">LPO Attachment</div>
                <input type="file" onChange={handleFile} accept=".png,.jpg,.jpeg,.pdf" />
                <div className="file-help">Formats accepted [Png,Jpg And pdf]</div>
              </div>

              <div className="update-wrapper">
                <button className="btn-green">Update LPO and report</button>
              </div>
            </div>

            {/* Second row (date ranges and status) */}
            <div className="filters-row">
              <label className="field small">
                <div className="field-label small">Start Date</div>
                <input
                  type="date"
                  name="startDate"
                  value={topFilters.startDate}
                  onChange={handleTopChange}
                />
              </label>

              <label className="field small">
                <div className="field-label small">End Date</div>
                <input
                  type="date"
                  name="endDate"
                  value={topFilters.endDate}
                  onChange={handleTopChange}
                />
              </label>

              <label className="field small">
                <div className="field-label small">From Travel Date</div>
                <input
                  type="date"
                  name="fromTravelDate"
                  value={topFilters.fromTravelDate}
                  onChange={handleTopChange}
                />
              </label>

              <label className="field small">
                <div className="field-label small">To travel date</div>
                <input
                  type="date"
                  name="toTravelDate"
                  value={topFilters.toTravelDate}
                  onChange={handleTopChange}
                />
              </label>

              <label className="field select">
                <div className="field-label small">Status</div>
                <select name="status" value={topFilters.status} onChange={handleTopChange}>
                  <option value="">Select</option>
                  <option>Success</option>
                  <option>Incomplete</option>
                  <option>Unclear</option>
                </select>
              </label>

              <div className="search-actions">
                <button className="btn" onClick={handleSearch}>
                  Search
                </button>
                <button className="btn outline" onClick={exportCSV}>
                  Export
                </button>
              </div>
            </div>

            <div className="file-chosen">
              {fileName ? <span>Selected file: {fileName}</span> : null}
            </div>
          </div>
        )}
      </div>

      {/* Service type chips and Transaction chips */}
      <div className="chips-row">
        <div className="chip-group left">
          <div className="chip-label">Servcetype</div>
          {["All", "DFU", "FLT", "HTL", "INS", "VIS", "MNS"].map((c) => (
            <button
              key={c}
              className={`chip ${serviceType === c ? "active" : ""}`}
              onClick={() => setServiceType(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="chip-group right">
          <div className="chip-label">Transaction</div>
          {["All", "Success", "Incomplete", "Unclear"].map((c) => (
            <button
              key={c}
              className={`chip ${transactionType === c ? "active-transaction" : ""}`}
              onClick={() => setTransactionType(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="dsr-table">
          <thead>
            <tr className="head-row">
              <th className="checkbox-col">
                <input
                  type="checkbox"
                  onChange={toggleSelectAllVisible}
                  checked={filteredData.length > 0 && selectedRows.size === filteredData.length}
                />
                <div className="muted">Select to report</div>
              </th>
              <th>Action</th>
              <th>Tx Type</th>
              <th>Svc Type</th>
              <th>Issue Dt</th>
              <th>Svc Dt</th>
              <th>PNR</th>
              <th>Docu #</th>
              <th>Super PNR</th>
              <th>Passport</th>
              <th>Pax Name</th>
              <th>Pax email</th>
              <th>Svc Dtls</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Supplier</th>
              <th>User</th>
              <th>PG</th>
              <th>PG Receipt#</th>
              <th>Source</th>
              <th>Hotel special req</th>
            </tr>

            {/* column-level filters */}
            <tr className="filter-row">
              <th></th>
              <th></th>
              <th>
                <input
                  name="txType"
                  value={colFilters.txType}
                  onChange={handleColChange}
                  placeholder="Tx Type"
                />
              </th>
              <th>
                <input
                  name="svcType"
                  value={colFilters.svcType}
                  onChange={handleColChange}
                  placeholder="Svc Type"
                />
              </th>
              <th>
                <input
                  name="issueDate"
                  value={colFilters.issueDate}
                  onChange={handleColChange}
                  placeholder="Issue Dt"
                />
              </th>
              <th>
                <input
                  name="svcDate"
                  value={colFilters.svcDate}
                  onChange={handleColChange}
                  placeholder="Svc Dt"
                />
              </th>
              <th>
                <input name="pnr" value={colFilters.pnr} onChange={handleColChange} placeholder="PNR" />
              </th>
              <th>
                <input name="docNo" value={colFilters.docNo} onChange={handleColChange} placeholder="Doc#" />
              </th>
              <th>
                <input
                  name="superPNR"
                  value={colFilters.superPNR}
                  onChange={handleColChange}
                  placeholder="Super PNR"
                />
              </th>
              <th></th>
              <th>
                <input
                  name="paxName"
                  value={colFilters.paxName}
                  onChange={handleColChange}
                  placeholder="Pax Name"
                />
              </th>
              <th>
                <input
                  name="paxEmail"
                  value={colFilters.paxEmail}
                  onChange={handleColChange}
                  placeholder="Pax Email"
                />
              </th>
              <th>
                <input
                  name="svcDtls"
                  value={colFilters.svcDtls}
                  onChange={handleColChange}
                  placeholder="Svc Dtls"
                />
              </th>
              <th>
                <input
                  name="customer"
                  value={colFilters.customer}
                  onChange={handleColChange}
                  placeholder="Customer"
                />
              </th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={21} style={{ padding: 20, textAlign: "center" }}>
                  No rows matching filters
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr key={row.id}>
                  <td className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={() => toggleSelectRow(row.id)}
                    />
                  </td>

                  <td className="action-cell">
                    <div className="action-wrapper">
                      <button className="action-btn" onClick={() => toggleActionMenu(row.id)}>
                        Action ▾
                      </button>
                      {openActionId === row.id && (
                        <ul className="action-menu">
                          <li>View</li>
                          <li>Edit</li>
                          <li>Export</li>
                        </ul>
                      )}
                    </div>
                  </td>

                  <td>{row.txType}</td>
                  <td>{row.svcType}</td>
                  <td>{row.issueDate}</td>
                  <td>{row.svcDate}</td>
                  <td>{row.pnr}</td>
                  <td>{row.docNo}</td>
                  <td>{row.superPNR}</td>
                  <td>{row.passport}</td>
                  <td>{row.paxName}</td>
                  <td>{row.paxEmail}</td>
                  <td className="svc-dtls-cell">{row.svcDtls}</td>
                  <td>{row.customer}</td>
                  <td>{row.amount}</td>
                  <td>{row.supplier}</td>
                  <td>{row.user}</td>
                  <td>{row.pg}</td>
                  <td>{row.pgReceipt}</td>
                  <td>{row.source}</td>
                  <td>{row.hotelSpecialReq}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
