// import { getTables } from '@/lib/db';
// import { DatabaseDashboard } from '@/components/database-dashboard';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { AlertCircle } from "lucide-react";

// export default async function Home() {
//   try {
//     const tablesData = await getTables();
//     const tables = tablesData.map((row: any) => Object.values(row)[0] as string);

//     if (tables.length === 0) {
//       return (
//         <main className="min-h-screen p-8">
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Database Connection Error</AlertTitle>
//             <AlertDescription>
//               Could not connect to the database. Please check your .env file and ensure:
//               <ul className="list-disc ml-6 mt-2">
//                 <li>You have created a .env file with the correct database credentials</li>
//                 <li>The database server is running and accessible</li>
//                 <li>The credentials in .env are correct</li>
//               </ul>
//             </AlertDescription>
//           </Alert>
//         </main>
//       );
//     }

//     return (
//       <main className="min-h-screen">
//         <DatabaseDashboard tables={tables} />
//       </main>
//     );
//   } catch (error) {
//     return (
//       <main className="min-h-screen p-8">
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>
//             {error instanceof Error ? error.message : 'An unexpected error occurred'}
//           </AlertDescription>
//         </Alert>
//       </main>
//     );
//   }
// }



import { getTables } from '@/lib/db';
import { DatabaseDashboard } from '@/components/database-dashboard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default async function Home() {
  try {
    const tablesData = await getTables();

    // Ensure tablesData is an array
    if (!Array.isArray(tablesData)) {
      throw new Error('Unexpected data format returned from the database');
    }

    // Map the table names
    const tables = tablesData.map((row) => Object.values(row)[0] as string);

    if (tables.length === 0) {
      return (
        <main className="min-h-screen p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Connection Error</AlertTitle>
            <AlertDescription>
              Could not connect to the database. Please check your .env file and ensure:
              <ul className="list-disc ml-6 mt-2">
                <li>You have created a .env file with the correct database credentials</li>
                <li>The database server is running and accessible</li>
                <li>The credentials in .env are correct</li>
              </ul>
            </AlertDescription>
          </Alert>
        </main>
      );
    }

    return (
      <main className="min-h-screen">
        <DatabaseDashboard tables={tables} />
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </AlertDescription>
        </Alert>
      </main>
    );
  }
}
