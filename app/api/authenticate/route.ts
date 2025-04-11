// import { NextResponse } from "next/server";
// import mysql from "mysql2/promise";
// import bcrypt from "bcryptjs";

// export async function POST(req: Request) {
//   try {
//     const { OPR_TOKEN, PASSWORD } = await req.json();

//     if (!OPR_TOKEN || !PASSWORD) {
//       return NextResponse.json(
//         { success: false, message: "Missing credentials" },
//         { status: 400 }
//       );
//     }

//     // ✅ Secure: Use environment variables
//     const connection = await mysql.createConnection({
//       host: process.env.DB_HOST ,
//       user: process.env.DB_USER ,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//     });

//     const [rows]: any = await connection.execute(
//       "SELECT * FROM xxfmmfg_scada_operators_t WHERE OPR_TOKEN = ?",
//       [OPR_TOKEN]
//     );

//     await connection.end();

//     if (rows.length === 0) {
//       return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
//     }

//     const user = rows[0];
//     const isPasswordValid = await bcrypt.compare(PASSWORD, user.password);

//     if (!isPasswordValid) {
//       return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
//     }

//     return NextResponse.json({ success: true, message: "Login successful" });

//   } catch (error) {
//     console.error("Authentication error:", error);
//     return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { oprToken, password } = await req.json();

    if (!oprToken || !password) {
      return NextResponse.json(
        { success: false, message: "Missing credentials" },
        { status: 400 }
      );
    }

    console.log("🔍 Received login request:", { oprToken, password });

    // ✅ Connect to MySQL
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // ✅ Fetch user details
    const [rows]: [any[], any] = await connection.execute(
      "SELECT * FROM xxfmmfg_scada_operators_t WHERE OPR_TOKEN = ?",
      [oprToken]
    );
    await connection.end();

    // ✅ Check if user exists
    if (rows.length === 0) {
      console.log("❌ User not found for OPR_TOKEN:", oprToken);
      return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
    }

    const user = rows[0]; // Extract user data
    console.log("✅ User found:", user);

    // ✅ Check password
    console.log("🔑 Stored Password:", user.PASSWORD);
    console.log("🔑 Input Password:", password);

    let isPasswordValid = false;

    if (user.PASSWORD.startsWith("$2b$") || user.PASSWORD.startsWith("$2a$")) {
      console.log("🔐 Password is hashed, using bcrypt comparison...");
      isPasswordValid = await bcrypt.compare(password, user.PASSWORD);
    } else {
      console.log("⚠️ Password is plaintext, using direct comparison...");
      isPasswordValid = password.trim() === user.PASSWORD.trim();
    }

    console.log("🔍 Password Match Result:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("❌ Invalid credentials: Password mismatch");
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: "Login successful" });

  } catch (error) {
    console.error("❌ Authentication error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
