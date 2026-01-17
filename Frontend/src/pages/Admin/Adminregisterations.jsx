import { useEffect, useState } from "react";
import { useAdminEvent } from "../../context/AdminEventContext";
import { apiAdmin } from "../../lib/apiAdmin";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaFileExcel, FaFilePdf, FaDownload, FaTimes } from "react-icons/fa";

export default function AdminRegistrations() {
  const { activeEvent } = useAdminEvent();
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewReceipt, setViewReceipt] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set()); // Track expanded rows

  // Fetch Logic
  const fetchRegs = async () => {
    if (!activeEvent) return;
    setLoading(true);
    try {
      const res = await apiAdmin.get(`/api/admin/events/${activeEvent._id}/registrations`);
      setRegs(res.data);
    } catch (e) { toast.error("Fetch failed"); }
    setLoading(false);
  };

  useEffect(() => { fetchRegs(); }, [activeEvent]);

  // Approval Logic
  const handleStatus = async (id, status) => {
    const confirmMsg = status === "PENDING"
      ? "Are you sure you want to disapprove this registration?"
      : `Are you sure you want to mark this as ${status}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await apiAdmin.put(`/api/admin/events/${activeEvent._id}/registrations/${id}/status`, { status });
      toast.success(`Marked as ${status}`);
      fetchRegs();
    } catch (e) { toast.error("Update failed"); }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Toggle row expansion for family details
  const toggleRow = (id) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Export to XLSX
  const exportToExcel = () => {
    const data = regs.map(r => ({
      Name: r.name,
      Email: r.oauthEmail,
      Batch: r.batch,
      Contact: r.contact || r.mobile || "N/A",
      Type: r.familyMembers?.length > 0 ? `Family (${r.familyMembers.length})` : "Solo",
      "Family Members": r.familyMembers?.map(fm => `${fm.name} (${fm.relation})`).join(", ") || "N/A",
      Amount: `₹${r.amount || 0}`,
      Status: r.status,
      "Registered On": formatDate(r.createdAt),
      "Approved By": r.approvedBy?.username || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");

    // Auto-size columns
    const maxWidth = data.reduce((w, r) => Math.max(w, ...Object.values(r).map(v => String(v).length)), 10);
    ws['!cols'] = Object.keys(data[0] || {}).map(() => ({ wch: Math.min(maxWidth, 30) }));

    XLSX.writeFile(wb, `${activeEvent.name}_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel file downloaded!");
    setShowExportModal(false);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF('landscape');

    // Title
    doc.setFontSize(16);
    doc.text(`${activeEvent.name} - Registrations`, 14, 15);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, 22);

    // Table data
    const tableData = regs.map(r => [
      r.name,
      r.batch,
      r.contact || r.mobile || "N/A",
      r.familyMembers?.length > 0 ? `Family (${r.familyMembers.length})` : "Solo",
      `₹${r.amount || 0}`,
      r.status,
      formatDate(r.createdAt),
      r.approvedBy?.username || "N/A"
    ]);

    doc.autoTable({
      head: [['Name', 'Batch', 'Contact', 'Type', 'Amount', 'Status', 'Registered', 'Approved By']],
      body: tableData,
      startY: 28,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 28 },
    });

    doc.save(`${activeEvent.name}_Registrations_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF file downloaded!");
    setShowExportModal(false);
  };

  if (!activeEvent) return <div className="text-center text-gray-500 mt-20">Select an event from the sidebar.</div>;

  return (
    <div className="max-w-7xl mx-auto relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Registrations: <span className="text-indigo-400">{activeEvent.name}</span></h2>
        <button
          onClick={() => setShowExportModal(true)}
          disabled={regs.length === 0}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <FaDownload /> Export ({regs.length})
        </button>
      </div>

      {/* Desktop Table View - Hidden on Mobile */}
      <div className="hidden lg:block bg-gray-900 rounded-xl border border-gray-800 overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-gray-800 text-gray-200 uppercase font-medium text-xs">
            <tr>
              <th className="p-4">Candidate</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Type</th>
              <th className="p-4">Receipt</th>
              <th className="p-4">Registered On</th>
              <th className="p-4">Approved By</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {regs.map(r => (
              <tr key={r._id} className="hover:bg-gray-800/50 transition">
                <td className="p-4">
                  <p className="font-bold text-white">{r.name}</p>
                  <p className="text-xs">{r.oauthEmail}</p>
                  <p className="text-xs text-gray-500">Batch: {r.batch}</p>
                </td>
                <td className="p-4">{r.contact || r.mobile || "N/A"}</td>
                <td className="p-4">
                  {r.familyMembers?.length > 0 ? (
                    <div>
                      <button
                        onClick={() => toggleRow(r._id)}
                        className="bg-purple-900 text-purple-200 px-2 py-1 rounded text-xs hover:bg-purple-800 transition cursor-pointer"
                      >
                        Family ({r.familyMembers.length}) {expandedRows.has(r._id) ? '▼' : '▶'}
                      </button>
                      {expandedRows.has(r._id) && (
                        <div className="mt-2 pl-2 border-l-2 border-purple-500">
                          {r.familyMembers.map((fm, idx) => (
                            <div key={idx} className="text-xs text-gray-400 mb-1">
                              <span className="text-white font-medium">{fm.name}</span>
                              <span className="text-purple-300 ml-2">({fm.relation})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs">Solo</span>
                  )}
                  <div className="mt-1 text-xs text-green-400">Paid: ₹{r.amount}</div>
                </td>
                <td className="p-4">
                  {r.receiptUrl ? (
                    <button onClick={() => setViewReceipt(r.receiptUrl)} className="text-indigo-400 underline hover:text-indigo-300 text-xs">View Receipt</button>
                  ) : <span className="text-gray-600 text-xs">No File</span>}
                </td>
                <td className="p-4">
                  <span className="text-xs text-gray-300">{formatDate(r.createdAt)}</span>
                </td>
                <td className="p-4">
                  {r.approvedBy ? (
                    <span className="text-xs text-white font-medium">{r.approvedBy.username}</span>
                  ) : (
                    <span className="text-xs text-gray-600">N/A</span>
                  )}
                </td>
                <td className="p-4 text-right space-x-2">
                  {r.status === "PENDING" && (
                    <>
                      <button onClick={() => handleStatus(r._id, "APPROVED")} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold">Approve</button>
                      <button onClick={() => handleStatus(r._id, "REJECTED")} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold">Reject</button>
                    </>
                  )}
                  {r.status === "APPROVED" && (
                    <>
                      <span className="text-xs font-bold px-2 py-1 rounded text-green-400 bg-green-900/20 border border-green-700">APPROVED</span>
                      <button onClick={() => handleStatus(r._id, "PENDING")} className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-xs font-bold ml-2">Disapprove</button>
                    </>
                  )}
                  {r.status === "REJECTED" && (
                    <>
                      <span className="text-xs font-bold px-2 py-1 rounded text-red-400 bg-red-900/20 border border-red-700">REJECTED</span>
                      <button onClick={() => handleStatus(r._id, "APPROVED")} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold ml-2">Approve</button>
                      <button onClick={() => handleStatus(r._id, "PENDING")} className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs font-bold ml-2">Reset</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {regs.length === 0 && !loading && <div className="p-8 text-center text-gray-500">No registrations found yet.</div>}
      </div>

      {/* Mobile Card View - Visible on Mobile Only */}
      <div className="lg:hidden space-y-4">
        {regs.map(r => (
          <div key={r._id} className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-3">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-white text-lg">{r.name}</p>
                <p className="text-xs text-gray-400">{r.oauthEmail}</p>
                <p className="text-xs text-gray-500 mt-1">Batch: {r.batch}</p>
              </div>
              <div className="text-right">
                {r.status === "APPROVED" && <span className="text-xs font-bold px-2 py-1 rounded text-green-400 bg-green-900/20 border border-green-700">APPROVED</span>}
                {r.status === "REJECTED" && <span className="text-xs font-bold px-2 py-1 rounded text-red-400 bg-red-900/20 border border-red-700">REJECTED</span>}
                {r.status === "PENDING" && <span className="text-xs font-bold px-2 py-1 rounded text-yellow-400 bg-yellow-900/20 border border-yellow-700">PENDING</span>}
              </div>
            </div>

            <div className="border-t border-gray-800 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Contact:</span>
                <span className="text-white font-medium">{r.contact || r.mobile || "N/A"}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-gray-500">Type:</span>
                <div className="text-right">
                  {r.familyMembers?.length > 0 ? (
                    <div>
                      <button
                        onClick={() => toggleRow(r._id)}
                        className="bg-purple-900 text-purple-200 px-2 py-1 rounded text-xs hover:bg-purple-800 transition"
                      >
                        Family ({r.familyMembers.length}) {expandedRows.has(r._id) ? '▼' : '▶'}
                      </button>
                      {expandedRows.has(r._id) && (
                        <div className="mt-2 pl-2 border-l-2 border-purple-500 text-left">
                          {r.familyMembers.map((fm, idx) => (
                            <div key={idx} className="text-xs text-gray-400 mb-1">
                              <span className="text-white font-medium">{fm.name}</span>
                              <span className="text-purple-300 ml-2">({fm.relation})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs">Solo</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="text-green-400 font-bold">₹{r.amount}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Receipt:</span>
                {r.receiptUrl ? (
                  <button onClick={() => setViewReceipt(r.receiptUrl)} className="text-indigo-400 underline hover:text-indigo-300 text-xs">View</button>
                ) : <span className="text-gray-600 text-xs">No File</span>}
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Registered:</span>
                <span className="text-xs text-gray-300">{formatDate(r.createdAt)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Approved By:</span>
                {r.approvedBy ? (
                  <span className="text-xs text-white font-medium">{r.approvedBy.username}</span>
                ) : (
                  <span className="text-xs text-gray-600">N/A</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-800 pt-3 flex flex-col gap-2">
              {r.status === "PENDING" && (
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleStatus(r._id, "APPROVED")} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-bold text-sm">Approve</button>
                  <button onClick={() => handleStatus(r._id, "REJECTED")} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded font-bold text-sm">Reject</button>
                </div>
              )}
              {r.status === "APPROVED" && (
                <button onClick={() => handleStatus(r._id, "PENDING")} className="w-full bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded font-bold text-sm">Disapprove</button>
              )}
              {r.status === "REJECTED" && (
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleStatus(r._id, "APPROVED")} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-bold text-sm">Approve</button>
                  <button onClick={() => handleStatus(r._id, "PENDING")} className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded font-bold text-sm">Reset</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {regs.length === 0 && !loading && <div className="p-8 text-center bg-gray-900 rounded-xl border border-gray-800 text-gray-500">No registrations found yet.</div>}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowExportModal(false)}>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Export Registrations</h3>
              <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>

            <p className="text-gray-400 mb-6">Choose your preferred export format:</p>

            <div className="space-y-3">
              <button
                onClick={exportToExcel}
                className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-bold transition transform active:scale-95"
              >
                <FaFileExcel size={24} />
                <span>Export as Excel (.xlsx)</span>
              </button>

              <button
                onClick={exportToPDF}
                className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-bold transition transform active:scale-95"
              >
                <FaFilePdf size={24} />
                <span>Export as PDF (.pdf)</span>
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              {regs.length} registration{regs.length !== 1 ? 's' : ''} will be exported
            </p>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {viewReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setViewReceipt(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 p-2" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setViewReceipt(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-red-500/80 text-white rounded-full p-2 transition z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img src={viewReceipt} alt="Receipt" className="w-full h-full object-contain max-h-[85vh] rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}