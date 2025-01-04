// "use client";

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Database, Table2 } from 'lucide-react';
// import { cn } from '@/lib/utils';

// interface SidebarProps {
//   tables: string[];
//   activeTable: string | null;
//   onTableSelect: (table: string) => void;
// }

// export function Sidebar({ tables, activeTable, onTableSelect }: SidebarProps) {
//   const [expanded, setExpanded] = useState(true);

//   return (
//     <div className={cn(
//       "h-screen border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
//       expanded ? "w-64" : "w-16"
//     )}>
//       <div className="flex h-16 items-center border-b px-4">
//         <Button 
//           variant="ghost" 
//           className="w-full justify-start gap-2"
//           onClick={() => setExpanded(!expanded)}
//         >
//           <Database className="h-5 w-5" />
//           {expanded && <span>Database Explorer</span>}
//         </Button>
//       </div>
//       <ScrollArea className="h-[calc(100vh-4rem)]">
//         <div className="space-y-2 p-2">
//           {tables.map((table) => (
//             <Button
//               key={table}
//               variant={activeTable === table ? "secondary" : "ghost"}
//               className={cn(
//                 "w-full justify-start gap-2",
//                 activeTable === table && "bg-muted"
//               )}
//               onClick={() => onTableSelect(table)}
//             >
//               <Table2 className="h-4 w-4" />
//               {expanded && <span>{table}</span>}
//             </Button>
//           ))}
//         </div>
//       </ScrollArea>
//     </div>
//   );
// }



import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, Table2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  tables: string[];
  activeTable: string | null;
  onTableSelect: (table: string) => void;
}

export function Sidebar({ tables, activeTable, onTableSelect }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className={cn(
        "h-screen border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => setExpanded(!expanded)}
        >
          <Database className="h-5 w-5" />
          {expanded && <span>Database Explorer</span>}
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="space-y-2 p-2">
          {tables.map((table) => (
            <Button
              key={table}
              variant={activeTable === table ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2 relative",
                activeTable === table &&
                  "bg-muted shadow-[0_0_10px_2px_red] border border-red-500" // Red glow effect
              )}
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
