"use client";

import { useEffect, useState, useCallback } from "react";
import React from "react";
import { useRouter } from 'next/navigation';

export default function ReportsPage() {
    const [tableData, setTableData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [fromDate, setFromDate] = useState(getTodayDate());
    const [toDate, setToDate] = useState(getTodayDate());
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
    const router = useRouter();

    function getTodayDate() {
        return new Date().toISOString().split("T")[0];
    }

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch(`/api/reports?from_date=${fromDate}&to_date=${toDate}`);
            if (!res.ok) throw new Error("Failed to fetch data");

            const data = await res.json();
            setTableData(data.data || []);
        } catch (err) {
            setError("Failed to load data.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [fromDate, toDate]);

    const handleCellClick = useCallback((rowIndex: number, colIndex: number) => {
        if (colIndex === 0) {
            setSelectedRows(prev => {
                const newSet = new Set(prev);
                newSet.has(rowIndex) ? newSet.delete(rowIndex) : newSet.add(rowIndex);
                return newSet;
            });
            setSelectedCell(null);
        } else {
            setSelectedRows(new Set()); // clear rows if cell clicked
            setSelectedCell({ row: rowIndex, col: colIndex });
        }
    }, []);

    useEffect(() => {
        const handleCopy = (e: ClipboardEvent) => {
            if (selectedRows.size === 0 && !selectedCell) return;

            let textToCopy = "";

            if (selectedRows.size > 0) {
                const rows = Array.from(selectedRows).sort();
                const headers = Object.keys(tableData[0]).join("\t");
                const data = rows.map(rowIdx =>
                    Object.values(tableData[rowIdx]).join("\t")
                ).join("\n");
                textToCopy = `${headers}\n${data}`;
            } else if (selectedCell) {
                const value = Object.values(tableData[selectedCell.row])[selectedCell.col];
                textToCopy = String(value);
            }

            e.preventDefault();
            e.clipboardData?.setData("text/plain", textToCopy);
        };

        document.addEventListener("copy", handleCopy);
        return () => document.removeEventListener("copy", handleCopy);
    }, [selectedRows, selectedCell, tableData]);

    const exportToCSV = () => {
        if (tableData.length === 0) return;

        const headers = Object.keys(tableData[0]).join(",");
        const rows = tableData.map(row => Object.values(row).join(",")).join("\n");
        const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `TestResult_${fromDate}_to_${toDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex h-screen bg-[#0a192f] text-white">
            {/* Sidebar */}
            <aside className="w-64 h-full sticky top-0 p-6 bg-[#112240] overflow-y-auto shadow-lg text-white">
                <h2 className="text-xl font-bold mb-6">Filters</h2>
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-semibold">From Date</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full p-2 rounded-lg bg-[#0a192f] text-white border border-gray-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-semibold">To Date</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full p-2 rounded-lg bg-[#0a192f] text-white border border-gray-500"
                    />
                </div>
                <button
                    onClick={fetchData}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition mb-3"
                >
                    Apply Filter
                </button>
                <button
                    onClick={exportToCSV}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                    Export CSV
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                <div className="relative mb-4">
                    {/* Back Button - Top Right */}
                    <button
                        onClick={() => router.push('/')}
                        className="absolute top-0 right-0 text-white bg-red-600 hover:bg-red-700 font-semibold py-2 px-4 rounded-lg transition"
                    >
                        Back
                    </button>

                    {/* Centered Title */}
                    <h1 className="text-2xl font-bold text-center">Test Result Data</h1>
                </div>

                {loading && <p className="text-center text-gray-300">Loading data...</p>}
                {error && <p className="text-center text-red-400">{error}</p>}

                {!loading && tableData.length === 0 ? (
                    <p className="text-center text-gray-400">No data available</p>
                ) : (
                    <div className="overflow-auto h-[calc(100vh-100px)] border border-gray-600 rounded-lg shadow-md bg-[#e9ecf2]">
                        <table className="min-w-full text-black text-sm border-collapse">
                            <thead className="bg-blue-900 sticky top-0 text-white z-10">
                                <tr>
                                    {tableData.length > 0 &&
                                        Object.keys(tableData[0]).map((col, idx) => (
                                            <th
                                                key={idx}
                                                className="p-2 border border-gray-600 text-left whitespace-nowrap"
                                            >
                                                {col}
                                            </th>
                                        ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row, rowIndex) => (
                                    <TableRow
                                        key={rowIndex}
                                        row={row}
                                        rowIndex={rowIndex}
                                        isSelected={selectedRows.has(rowIndex)}
                                        selectedCell={selectedCell}
                                        onCellClick={handleCellClick}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}

// ✅ Row component - memoized
const TableRow = React.memo(
    ({
        row,
        rowIndex,
        isSelected,
        selectedCell,
        onCellClick
    }: {
        row: any;
        rowIndex: number;
        isSelected: boolean;
        selectedCell: { row: number; col: number } | null;
        onCellClick: (rowIndex: number, colIndex: number) => void;
    }) => {
        return (
            <tr
                className={`${isSelected ? "bg-blue-300" : ""} hover:bg-blue-200 transition duration-75`}
            >
                {Object.values(row).map((value: any, colIndex: number) => {
                    const isCellSelected =
                        selectedCell?.row === rowIndex && selectedCell?.col === colIndex;

                    return (
                        <td
                            key={colIndex}
                            onClick={() => onCellClick(rowIndex, colIndex)}
                            className={`p-2 border border-gray-700 text-black whitespace-nowrap cursor-pointer ${
                                isCellSelected ? "bg-blue-300" : ""
                            }`}
                        >
                            {String(value)}
                        </td>
                    );
                })}
            </tr>
        );
    }
);
