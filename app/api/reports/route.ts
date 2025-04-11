import { NextResponse } from "next/server";
import { spawn } from "child_process";

export async function GET() {
    return new Promise((resolve) => {
        const pythonProcess = spawn("python", ["app/api/fetch_data.py"]); // ✅ Use `spawn`

        let dataBuffer = "";
        let errorBuffer = "";

        pythonProcess.stdout.on("data", (data) => {
            dataBuffer += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            errorBuffer += data.toString();
        });

        pythonProcess.on("close", (code) => {
            if (code !== 0 || errorBuffer) {
                console.error("Python Script Error:", errorBuffer);
                resolve(NextResponse.json({ error: "Failed to fetch data" }, { status: 500 }));
                return;
            }

            try {
                const data = JSON.parse(dataBuffer);
                resolve(NextResponse.json({ data }));
            } catch (parseError) {
                console.error("JSON Parsing Error:", parseError);
                resolve(NextResponse.json({ error: "Invalid JSON response" }, { status: 500 }));
            }
        });
    });
}



// import { NextResponse } from "next/server";
// import { exec } from "child_process";

// export async function GET() {
//     return new Promise((resolve) => {
//         exec("python app/api/fetch_data.py", (error, stdout, stderr) => { // ⬅️ Use "python" instead of "python3"
//             if (error) {
//                 console.error("Error executing Python script:", error);
//                 resolve(NextResponse.json({ error: "Failed to fetch data" }, { status: 500 }));
//                 return;
//             }
//             if (stderr) {
//                 console.error("Python Script Error:", stderr);
//             }

//             try {
//                 const data = JSON.parse(stdout);
//                 resolve(NextResponse.json({ data }));
//             } catch (parseError) {
//                 console.error("JSON Parsing Error:", parseError);
//                 resolve(NextResponse.json({ error: "Invalid JSON response" }, { status: 500 }));
//             }
//         });
//     });
// }


