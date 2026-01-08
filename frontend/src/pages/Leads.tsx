import { useState, useEffect, useRef } from "react";
import { leadsApi } from "../services/api";
import type { Lead } from "../services/api";
import Toast from "../components/Toast";
import Modal from "../components/Modal";

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"error" | "success" | "info">("error");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasFetchedRef = useRef(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortColumn, setSortColumn] = useState<"name" | "company" | "email" | "lead_status" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    lead_status: "inactive" as "active" | "inactive",
  });

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await leadsApi.getAll();
      setLeads(data);
    } catch (err: any) {
      let errorMsg = "Failed to fetch leads";
      
      if (err?.message) {
        errorMsg = err.message;
      } else if (err?.response) {
        const status = err.response.status;
        if (status === 404) {
          errorMsg = "API endpoint not found";
        } else if (status === 401 || status === 403) {
          errorMsg = "Authentication failed";
        } else if (status >= 500) {
          errorMsg = "Server error";
        }
      } else if (err?.code === 'ECONNREFUSED') {
        errorMsg = "Can't connect to backend";
      }
      
      setToastMessage(errorMsg);
      setToastType("error");
      setShowToast(true);
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchLeads();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      lead_status: "inactive",
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSort = (column: "name" | "company" | "email" | "lead_status") => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new column and default to ascending
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      lead.name.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower) ||
      lead.company.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === "all" || lead.lead_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue: string | number;
    let bValue: string | number;

    switch (sortColumn) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "company":
        aValue = a.company.toLowerCase();
        bValue = b.company.toLowerCase();
        break;
      case "email":
        aValue = a.email.toLowerCase();
        bValue = b.email.toLowerCase();
        break;
      case "lead_status":
        // Sort status: "active" comes before "inactive"
        aValue = a.lead_status === "active" ? 0 : 1;
        bValue = b.lead_status === "active" ? 0 : 1;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await leadsApi.create(formData);
      setToastType("success");
      setToastMessage("Lead created successfully!");
      setShowToast(true);
      setIsModalOpen(false);
      resetForm();
      fetchLeads();
    } catch (err) {
      setToastType("error");
      setToastMessage("Failed to create lead");
      setShowToast(true);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-8" style={{ backgroundColor: "#1e3a5f" }}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl text-left font-bold" style={{ color: "#1e3a5f" }}>
                Leads
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                View and manage leads
              </p>
            </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, company, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] text-sm"
              style={{ minWidth: "250px" }}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 rounded-lg font-medium text-white text-sm flex items-center gap-2 transition-colors hover:opacity-90"
              style={{ backgroundColor: "#E63946" }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Lead
            </button>
          </div>
        </div>

        <Toast
          message={toastMessage}
          isVisible={showToast}
          onClose={() => {
            setShowToast(false);
            setToastMessage("");
          }}
          type={toastType}
        />

        {loading && (
          <div className="text-center py-20">
            <div
              className="animate-spin h-10 w-10 border-4 border-gray-300 rounded-full mx-auto"
              style={{ borderTopColor: "#1e3a5f" }}
            ></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        )}

        {!loading && (
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white border-b border-gray-200">
                  <tr>
                    <th
                      onClick={() => handleSort("name")}
                      className="px-6 py-4 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors select-none"
                      style={{ color: "#1e3a5f" }}
                    >
                      <div className="flex items-center gap-2">
                        Name
                        {sortColumn === "name" && (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {sortDirection === "asc" ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            )}
                          </svg>
                        )}
                        {sortColumn !== "name" && (
                          <svg
                            className="w-4 h-4 opacity-30"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("company")}
                      className="px-6 py-4 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors select-none"
                      style={{ color: "#1e3a5f" }}
                    >
                      <div className="flex items-center gap-2">
                        Company
                        {sortColumn === "company" && (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {sortDirection === "asc" ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            )}
                          </svg>
                        )}
                        {sortColumn !== "company" && (
                          <svg
                            className="w-4 h-4 opacity-30"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("email")}
                      className="px-6 py-4 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors select-none"
                      style={{ color: "#1e3a5f" }}
                    >
                      <div className="flex items-center gap-2">
                        Email
                        {sortColumn === "email" && (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {sortDirection === "asc" ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            )}
                          </svg>
                        )}
                        {sortColumn !== "email" && (
                          <svg
                            className="w-4 h-4 opacity-30"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("lead_status")}
                      className="px-6 py-4 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors select-none"
                      style={{ color: "#1e3a5f" }}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortColumn === "lead_status" && (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {sortDirection === "asc" ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            )}
                          </svg>
                        )}
                        {sortColumn !== "lead_status" && (
                          <svg
                            className="w-4 h-4 opacity-30"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {sortedLeads.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-12 text-center text-gray-500"
                      >
                        No leads found
                      </td>
                    </tr>
                  ) : (
                    sortedLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p
                            className="text-sm font-medium"
                            style={{ color: "#1e3a5f" }}
                          >
                            {lead.name}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <p
                            className="text-sm"
                            style={{ color: "#1e3a5f" }}
                          >
                            {lead.company}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <p
                            className="text-sm"
                            style={{ color: "#1e3a5f" }}
                          >
                            {lead.email}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              lead.lead_status === "active"
                                ? "bg-[#BFDBFE]"
                                : "bg-[#FEE2E2]"
                            }`}
                            style={{
                              color:
                                lead.lead_status === "active"
                                  ? "#1e3a5f"
                                  : "#991B1B",
                            }}
                          >
                            {lead.lead_status === "active"
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Add New Lead"
          footer={
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="lead-form"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg text-white font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#E63946" }}
              >
                {isSubmitting ? "Creating..." : "Create Lead"}
              </button>
            </div>
          }
        >
          <form id="lead-form" onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="text-left">
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2 text-left"
                style={{ color: "#1e3a5f" }}
              >
                Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] text-sm text-left"
                placeholder="Enter lead name"
              />
            </div>

            <div className="text-left">
              <label
                htmlFor="company"
                className="block text-sm font-medium mb-2 text-left"
                style={{ color: "#1e3a5f" }}
              >
                Company *
              </label>
              <input
                type="text"
                id="company"
                required
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] text-sm text-left"
                placeholder="Enter company name"
              />
            </div>

            <div className="text-left">
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-left"
                style={{ color: "#1e3a5f" }}
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] text-sm text-left"
                placeholder="Enter email address"
              />
            </div>

            <div className="text-left">
              <label
                htmlFor="lead_status"
                className="block text-sm font-medium mb-2 text-left"
                style={{ color: "#1e3a5f" }}
              >
                Status *
              </label>
              <select
                id="lead_status"
                required
                value={formData.lead_status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lead_status: e.target.value as "active" | "inactive",
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] text-sm text-left"
              >
                <option value="inactive">Inactive</option>
                <option value="active">Active</option>
              </select>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Leads;
