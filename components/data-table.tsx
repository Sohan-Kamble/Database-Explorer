"use client";

import { useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, SortAsc, SortDesc, X } from "lucide-react";

interface DataTableProps {
  tableName: string;
  data: any[];
  columns: string[];
  onFilter: (filters: any) => void;
}

export function DataTable({ tableName, data, columns, onFilter }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filterFields, setFilterFields] = useState<string[]>(columns.slice(0, 4));
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const isDragging = useRef(false);
  const dragStartIndex = useRef<number | null>(null);

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleFilterChange = (column: string, value: string) => {
    const newFilters = { ...filters, [column]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleRemoveFilter = (column: string) => {
    const newFilters = { ...filters };
    delete newFilters[column];
    setFilters(newFilters);
    onFilter(newFilters);

    setFilterFields((prevFields) => prevFields.filter((field) => field !== column));
  };

  const handleAddFilter = (column: string) => {
    if (!filterFields.includes(column)) {
      setFilterFields((prevFields) => [...prevFields, column]);
    }
  };

  const handleExport = () => {
    const csv = [
      columns.join(","),
      ...sortedData.map((row) =>
        columns.map((col) => JSON.stringify(row[col])).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleMouseDown = (index: number) => {
    isDragging.current = true;
    dragStartIndex.current = index;
    setSelectedRows(new Set([index]));
  };

  const handleMouseOver = (index: number) => {
    if (isDragging.current && dragStartIndex.current !== null) {
      const rangeStart = Math.min(dragStartIndex.current, index);
      const rangeEnd = Math.max(dragStartIndex.current, index);
      const newSelectedRows = new Set<number>();
      for (let i = rangeStart; i <= rangeEnd; i++) {
        newSelectedRows.add(i);
      }
      setSelectedRows(newSelectedRows);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    dragStartIndex.current = null;
  };

  return (
    <Card className="w-full border border-black">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-black">{tableName}</h2>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1">
          {filterFields.map((column) => (
            <div key={column} className="flex items-center space-x-1">
              <Input
                placeholder={`Filter by ${column}`}
                value={filters[column] || ""}
                onChange={(e) => handleFilterChange(column, e.target.value)}
                className="w-28 px-2 py-1 text-sm text-black border border-black"
              />
              <button
                className="p-0.5 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveFilter(column)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Table */}
        <ScrollArea className="h-[calc(100vh-15rem)] w-full border border-black">
          <div className="relative">
            <Table
              className="text-black border border-black"
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <TableHeader className="sticky top-0 bg-white shadow z-10 border border-black">
                <TableRow className="border border-black">
                  {columns.map((column) => (
                    <TableHead
                      key={column}
                      className="cursor-pointer text-black border border-black"
                      onClick={(e) => {
                        if (e.detail === 3) handleAddFilter(column);
                        handleSort(column);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {column}
                        {sortConfig.key === column && (
                          sortConfig.direction === "asc" ? (
                            <SortAsc className="h-4 w-4" />
                          ) : (
                            <SortDesc className="h-4 w-4" />
                          )
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((row, i) => (
                  <TableRow
                    key={i}
                    className={`cursor-pointer border border-black ${
                      selectedRows.has(i) ? "bg-blue-100" : ""
                    }`}
                    onMouseDown={() => handleMouseDown(i)}
                    onMouseOver={() => handleMouseOver(i)}
                  >
                    {columns.map((column) => (
                      <TableCell key={column} className="py-1 text-black border border-black">
                        {row[column]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
