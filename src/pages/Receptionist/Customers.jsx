import { useEffect, useState, useMemo } from "react"
import "./Customers.css"

const API_BASE = "http://localhost:5000/api"

const FILTERS = [
    { key: "ALL", label: "All customers" },
    { key: "WALK_IN_ORDER", label: "Walk-in orders" },
    { key: "ONLINE_ORDER", label: "Online orders" },
    { key: "RENTAL", label: "Rental" },
    { key: "REPAIR", label: "Repair" },
]

function formatDate(dateString)
{
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

function formatAmount(amount)
{
    if (amount === null || amount === undefined) return "-"
    return `₹${Number(amount).toLocaleString("en-IN")}`
}

// Turns one raw order doc into a row our table understands
function mapOrderToRow(order)
{
    const isOnline = order.orderSource === "ONLINE"

    return {
        id: `order-${order._id}`,
        customerName: order.shippingAddress?.fullName || order.user?.firstName || "Unknown",
        contact: order.shippingAddress?.phone || order.user?.phone || "-",
        service: isOnline ? "ONLINE_ORDER" : "WALK_IN_ORDER",
        serviceLabel: isOnline ? "Online order" : "Walk-in order",
        item: order.orderItems?.[0]?.name
            ? `${order.orderItems[0].name}${order.orderItems.length > 1 ? ` +${order.orderItems.length - 1} more` : ""}`
            : "-",
        amount: formatAmount(order.finalAmount),
        status: order.orderStatus || "-",
        date: formatDate(order.createdAt),
        sortDate: order.createdAt,
    }
}

// Turns one raw rental doc into a row our table understands
function mapRentalToRow(rental)
{
    let status = "Active"
    if (rental.actualReturnDate)
    {
        status = "Returned"
    }
    else if (rental.expectedEndDate && new Date(rental.expectedEndDate) < new Date())
    {
        status = "Overdue"
    }

    return {
        id: `rental-${rental._id}`,
        customerName: rental.individualDetails?.fullName || rental.companyDetails?.companyName || "Unknown",
        contact: rental.individualDetails?.phone || "-",
        service: "RENTAL",
        serviceLabel: "Rental",
        item: rental.productId?.name || rental.rental?.name || rental.name || "-",
        amount: `${formatAmount(rental.monthlyRent)}/mo`,
        status,
        date: formatDate(rental.createdAt),
        sortDate: rental.createdAt,
    }
}

// Turns one raw repair doc into a row our table understands
function mapRepairToRow(repair)
{
    return {
        id: `repair-${repair._id}`,
        customerName: repair.customerName || "Unknown",
        contact: repair.customerPhone || "-",
        service: "REPAIR",
        serviceLabel: "Repair",
        item: repair.deviceModel || "-",
        amount: formatAmount(repair.repairCost),
        status: repair.status || "-",
        date: formatDate(repair.createdAt),
        sortDate: repair.createdAt,
    }
}

export function Customers()
{
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeFilter, setActiveFilter] = useState("ALL")
    const [search, setSearch] = useState("")

    useEffect(() =>
    {
        const token = localStorage.getItem("token")
        const headers = { authorization: `Bearer ${token}` }

        setLoading(true)
        setError(null)

        Promise.all([
            fetch(`${API_BASE}/orders/`, { headers }).then((res) => res.json()),
            fetch(`${API_BASE}/rentals/`, { headers }).then((res) => res.json()),
            fetch(`${API_BASE}/newRepair/`, { headers }).then((res) => res.json()),
        ])
            .then(([ordersRes, rentalsRes, repairsRes]) =>
            {
                const orderRows = (ordersRes.orders || []).map(mapOrderToRow)
                const rentalRows = (rentalsRes.data || []).map(mapRentalToRow)
                const repairRows = (repairsRes.data || []).map(mapRepairToRow)

                const combined = [...orderRows, ...rentalRows, ...repairRows].sort(
                    (a, b) => new Date(b.sortDate) - new Date(a.sortDate)
                )

                setRows(combined)
            })
            .catch(() =>
            {
                setError("Couldn't load customers. Try refreshing.")
            })
            .finally(() =>
            {
                setLoading(false)
            })
    }, [])

    const filteredRows = useMemo(() =>
    {
        return rows.filter((row) =>
        {
            const matchesFilter = activeFilter === "ALL" || row.service === activeFilter
            const searchTerm = search.trim().toLowerCase()
            const matchesSearch =
                !searchTerm ||
                row.customerName.toLowerCase().includes(searchTerm) ||
                row.contact.toLowerCase().includes(searchTerm)

            return matchesFilter && matchesSearch
        })
    }, [rows, activeFilter, search])

    return (
        <div className="customers-page">
            <h1 className="customers-title">Customers</h1>

            <div className="customers-toolbar">
                <div className="customers-filters">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter.key}
                            className={`filter-chip ${activeFilter === filter.key ? "active" : ""}`}
                            onClick={() => setActiveFilter(filter.key)}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                <input
                    type="text"
                    className="customers-search"
                    placeholder="Search name or phone"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading && <div className="customers-state">Loading customers...</div>}

            {!loading && error && <div className="customers-state error">{error}</div>}

            {!loading && !error && filteredRows.length === 0 && (
                <div className="customers-state">No customers found.</div>
            )}

            {!loading && !error && filteredRows.length > 0 && (
                <div className="customers-table-wrapper">
                    <table className="customers-table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Contact</th>
                                <th>Service</th>
                                <th>Item</th>
                                <th className="align-right">Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.customerName}</td>
                                    <td className="muted">{row.contact}</td>
                                    <td>
                                        <span className={`badge badge-${row.service.toLowerCase()}`}>
                                            {row.serviceLabel}
                                        </span>
                                    </td>
                                    <td>{row.item}</td>
                                    <td className="align-right">{row.amount}</td>
                                    <td>
                                        <span className="badge badge-status">{row.status}</span>
                                    </td>
                                    <td className="muted">{row.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}