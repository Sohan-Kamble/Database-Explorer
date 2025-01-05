// "use client";

// import { useState } from 'react';
// import { Sidebar } from '@/components/sidebar';
// import { DataTable } from '@/components/data-table';
// import { useToast } from '@/components/ui/use-toast';

// interface DatabaseDashboardProps {
//   tables: string[];
// }

// export function DatabaseDashboard({ tables }: DatabaseDashboardProps) {
//   const [activeTable, setActiveTable] = useState<string | null>(null);
//   const [tableData, setTableData] = useState<any[]>([]);
//   const [columns, setColumns] = useState<string[]>([]);
//   const { toast } = useToast();

//   const handleTableSelect = async (table: string) => {
//     try {
//       const response = await fetch(`/api/table-data?table=${table}`);
//       const data = await response.json();
      
//       if (data.error) {
//         throw new Error(data.error);
//       }
      
//       setActiveTable(table);
//       setTableData(data);
//       if (data.length > 0) {
//         setColumns(Object.keys(data[0]));
//       }
      
//       toast({
//         title: "Table loaded successfully",
//         description: `Loaded ${data.length} rows from ${table}`,
//       });
//     } catch (error) {
//       toast({
//         title: "Error loading table",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleFilter = async (filters: any) => {
//     if (!activeTable) return;

//     try {
//       const queryParams = new URLSearchParams();
//       queryParams.append('table', activeTable);
//       Object.entries(filters).forEach(([key, value]) => {
//         if (value) queryParams.append(key, value as string);
//       });

//       const response = await fetch(`/api/table-data?${queryParams}`);
//       const data = await response.json();
      
//       if (data.error) {
//         throw new Error(data.error);
//       }
      
//       setTableData(data);
//     } catch (error) {
//       toast({
//         title: "Error applying filters",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       <Sidebar
//         tables={tables}
//         activeTable={activeTable}
//         onTableSelect={handleTableSelect}
//       />
//       <div className="flex-1 p-6 bg-background">
//         {activeTable ? (
//           <DataTable
//             data={tableData}
//             columns={columns}
//             onFilter={handleFilter}
//           />
//         ) : (
//           <div className="h-full flex items-center justify-center">
//             <div className="text-center space-y-2">
//               <h2 className="text-2xl font-bold">Welcome to Database Explorer</h2>
//               <p className="text-muted-foreground">
//                 Select a table from the sidebar to view its data
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { DataTable } from "@/components/data-table";
import { useToast } from "@/components/ui/use-toast";

interface DatabaseDashboardProps {
  tables: string[];
}

export function DatabaseDashboard({ tables }: DatabaseDashboardProps) {
  const [activeTable, setActiveTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const { toast } = useToast();

  const handleTableSelect = async (table: string) => {
    try {
      const response = await fetch(`/api/table-data?table=${table}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setActiveTable(table);
      setTableData(data);
      if (data.length > 0) {
        setColumns(Object.keys(data[0]));
      }

      toast({
        title: "Table loaded successfully",
        description: `Loaded ${data.length} rows from ${table}`,
      });
    } catch (error) {
      let errorMessage = "An unknown error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Error loading table",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleFilter = async (filters: any) => {
    if (!activeTable) return;

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("table", activeTable);
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value as string);
      });

      const response = await fetch(`/api/table-data?${queryParams}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setTableData(data);
    } catch (error) {
      let errorMessage = "An unknown error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Error applying filters",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        tables={tables}
        activeTable={activeTable}
        onTableSelect={handleTableSelect}
      />
      <div className="flex-1 p-6 bg-background">
        {activeTable ? (
          <DataTable
            data={tableData}
            columns={columns}
            onFilter={handleFilter}
            tableName={activeTable} // Pass tableName to DataTable
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Welcome to Database Explorer</h2>
              <p className="text-muted-foreground">
                Select a table from the sidebar to view its data
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
