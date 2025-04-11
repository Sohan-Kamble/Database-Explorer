import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  tables: string[];
  activeTable: string | null;
  onTableSelect: (table: string) => void;
}

export function Sidebar({ tables, activeTable, onTableSelect }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  // const bgColor = "#1E1E1E"; 
  const bgColor = "#02033b"; // database tables list buttons background color 

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        expanded ? "w-64" : "w-16"
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center h-16 border-b px-4">
        <Image src="/logo1.png" alt="Logo" width={120} height={60} layout="intrinsic" />
      </div>

      {/* Sidebar Toggle */}
      <div className="flex h-16 items-center border-b px-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => setExpanded(!expanded)}
        >
          <Database className="h-5 w-5" />
          {expanded && <span>Database Tables...</span>}
        </Button>
      </div>

      {/* Table List */}
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-2 p-2">
          {tables.map((table) => (
            <Button
              key={table}
              className={cn(
                "w-full flex items-center justify-start gap-2 border px-4 py-2 text-white",
                activeTable === table
                  ? "border-red-500 shadow-[0_0_10px_2px_red]" // Selected: Red glow
                  : "border-blue"
              )}
              style={{ backgroundColor: bgColor }} // Apply fixed background color
              onClick={() => onTableSelect(table)}
            >
              <Table2 className="h-4 w-4" />
              {expanded && <span>{table}</span>}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
