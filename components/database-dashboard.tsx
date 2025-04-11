// "use client";

// import { useState, useEffect } from "react";
// import { Sidebar } from "@/components/sidebar";
// import { DataTable } from "@/components/data-table";
// import { useToast } from "@/components/ui/use-toast";
// import { useRouter } from "next/navigation";

// interface DatabaseDashboardProps {
//   tables: string[];
// }

// export function DatabaseDashboard({ tables }: DatabaseDashboardProps) {
//   const [activeTable, setActiveTable] = useState<string | null>(null);
//   const [tableData, setTableData] = useState<any[]>([]);
//   const [columns, setColumns] = useState<string[]>([]);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [oprToken, setOprToken] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const { toast } = useToast();
//   const router = useRouter();

//   useEffect(() => {
//     const storedAuth = sessionStorage.getItem("isAuthenticated");
//     if (storedAuth === "true") {
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const maskSensitiveData = (data: any[]) => {
//     return data.map((row) => {
//       const maskedRow = { ...row };
//       Object.keys(maskedRow).forEach((key) => {
//         if (key.toLowerCase().includes("password")) {
//           maskedRow[key] = "••••••";
//         }
//       });
//       return maskedRow;
//     });
//   };

//   const handleTableSelect = async (table: string) => {
//     try {
//       const response = await fetch(`/api/table-data?table=${table}`);
//       const data = await response.json();

//       if (!response.ok || data.error) {
//         throw new Error(data.error || "Failed to fetch table data");
//       }

//       setActiveTable(table);
//       setTableData(maskSensitiveData(data));
//       setColumns(data.length > 0 ? Object.keys(data[0]) : []);

//       toast({
//         title: "Table loaded successfully",
//         description: `Loaded ${data.length} rows from ${table}`,
//       });
//     } catch (error) {
//       toast({
//         title: "Error loading table",
//         description: error instanceof Error ? error.message : "Unknown error",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleFilter = async (filters: any) => {
//     if (!activeTable) return;

//     try {
//       const queryParams = new URLSearchParams();
//       queryParams.append("table", activeTable);
//       Object.entries(filters).forEach(([key, value]) => {
//         if (value) queryParams.append(key, value as string);
//       });

//       const response = await fetch(`/api/table-data?${queryParams}`);
//       const data = await response.json();

//       if (!response.ok || data.error) {
//         throw new Error(data.error || "Failed to apply filters");
//       }

//       setTableData(maskSensitiveData(data));
//     } catch (error) {
//       toast({
//         title: "Error applying filters",
//         description: error instanceof Error ? error.message : "Unknown error",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleLogin = async () => {
//     try {
//       const response = await fetch("/api/authenticate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ oprToken, password }),
//       });

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(data.message || "Invalid credentials");
//       }

//       setIsAuthenticated(true);
//       sessionStorage.setItem("isAuthenticated", "true");

//       toast({
//         title: "Login Successful",
//         description: "Welcome!",
//       });
//     } catch (error) {
//       toast({
//         title: "Login Failed",
//         description: error instanceof Error ? error.message : "Unknown error",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     sessionStorage.removeItem("isAuthenticated");
//   };

//   return (
//     <div className="flex h-screen bg-white-600 p-6"> {/* Parent container */}
//       {isAuthenticated ? (
//         <>
//           {/* Sidebar with fixed width */}
//           <div className="w-72"> {/* Increased sidebar width */}
//             <Sidebar
//               tables={tables}
//               activeTable={activeTable}
//               onTableSelect={handleTableSelect}
//             />
//           </div>

//           {/* Right section takes full remaining width */}
//           <div className="flex-1 p-6 flex flex-col w-full">
//             <button
//               onClick={handleLogout}
//               className="absolute top-3 right-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//             >
//               Logout
//             </button>

//             <button
//               onClick={handleLogout}
//               className="fixed bottom-5 right-5 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
//             >
//               Voice Assistance
//             </button>



//             {activeTable ? (
//               <div className="bg-white p-6 rounded-lg shadow-lg w-[95%] h-[90vh] flex-grow overflow-auto"> {/* Increased width and height */}
//                 <DataTable
//                   data={tableData}
//                   columns={columns}
//                   onFilter={handleFilter}
//                   tableName={activeTable}
//                 />
//               </div>
//             ) : (
//               <div className="h-full flex flex-col items-center justify-center">
//                 <div className="text-center space-y-2">
//                   <h2 className="text-2xl font-bold text-white">Welcome to Database Explorer</h2>
//                   <p className="text-white">
//                     Select a table from the sidebar to view its data
//                   </p>
//                   <button
//                     onClick={() => router.push("/reports")}
//                     className="mt-4 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-200 transition"
//                   >
//                     View Reports
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </>
//       ) : (


//         <div className="relative w-full h-screen flex items-center justify-center">
//           {/* Background Image */}
//           <div
//             className="absolute inset-0 bg-cover bg-center"
//             style={{
//               backgroundImage: "url('/FM-bg.png')",
//               backgroundSize: "cover",  // Ensures the image covers the screen
//               backgroundPosition: "center",  // Keeps the image centered
//               backgroundRepeat: "no-repeat",  // Prevents repeating the image
//               height: "100%",  // Make sure it covers the entire height
//               width: "100%",  // Make sure it covers the entire width
//             }}
//           ></div>

//           {/* Semi-transparent overlay */}
//           <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//           {/* Login Box */}
//           <div className="relative z-10 p-8 bg-white bg-opacity-90 shadow-2xl rounded-xl w-96 backdrop-blur-md flex flex-col items-center">
//             <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Welcome Back!</h2>
//             <p className="text-gray-600 text-sm text-center mb-4">Enter your credentials to access the dashboard</p>

//             {/* Input Fields */}
//             <div className="w-full">
//               <input
//                 type="text"
//                 placeholder="Operator Token"
//                 value={oprToken}
//                 onChange={(e) => setOprToken(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
//               />
//             </div>

//             {/* Login Button */}
//             <button
//               onClick={handleLogin}
//               className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg text-lg font-semibold hover:scale-105 transition-transform shadow-lg"
//             >
//               Login
//             </button>

//             {/* Decorative Elements */}
//             <div className="absolute -top-12 w-24 h-24 bg-blue-500 rounded-full shadow-lg opacity-30 animate-pulse"></div>
//             <div className="absolute -bottom-12 right-10 w-16 h-16 bg-indigo-500 rounded-full shadow-lg opacity-30 animate-pulse"></div>
//           </div>
//         </div>



//       )}
//     </div>
//   );
// }







"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/sidebar";
import { DataTable } from "@/components/data-table";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface DatabaseDashboardProps {
  tables: string[];
}

export function DatabaseDashboard({ tables }: DatabaseDashboardProps) {
  const [activeTable, setActiveTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [oprToken, setOprToken] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  // Voice Assistant States
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("How can I help you?");
  const [userCommand, setUserCommand] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Speech Recognition and Synthesis Refs
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<any>(null);

  // Table mapping from your original code - convert to appropriate format
  const TABLE_MAPPING: Record<string, string> = {
    "operators table": "xxfmmfg_scada_operators_t",
    "result details table": "xxfmmfg_scada_test_result_det",
    "result details backup table": "xxfmmfg_scada_test_result_det_bkp",
    "test results table": "xxfmmfg_ssd_test_results",
    "oracle scada table": "xxfmmfg_trc_ssd_oracle_scada_t",
    "testing parameter table": "xxfmmfg_trc_testing_parameters_t"
  };

  useEffect(() => {
    const storedAuth = sessionStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }

    // Initialize speech components only on client-side
    if (typeof window !== "undefined") {
      initializeSpeechComponents();
    }
  }, []);

  const initializeSpeechComponents = () => {
    // Initialize speech recognition
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log(`🗣️ You said: '${transcript}'`);
        setUserCommand(transcript);
        handleCommand(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        speak("I didn't catch that. Please try again.");
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if (window.speechSynthesis) {
      speechSynthesisRef.current = window.speechSynthesis;

      // Try to set a female voice if available
      let voices = speechSynthesisRef.current.getVoices();

      if (voices.length === 0) {
        // Voice list might not be loaded yet
        speechSynthesisRef.current.onvoiceschanged = () => {
          voices = speechSynthesisRef.current.getVoices();
          setFemaleVoice(voices);
        };
      } else {
        setFemaleVoice(voices);
      }
    }
  };


  const setFemaleVoice = (voices: SpeechSynthesisVoice[]) => {
    if (!speechSynthesisRef.current) return;

    const femaleVoice = voices.find(voice =>
      voice.name.toLowerCase().includes("female") ||
      voice.name.toLowerCase().includes("zira") ||
      voice.name.toLowerCase().includes("victoria") ||
      voice.name.toLowerCase().includes("samantha")
    );

    if (femaleVoice) {
      console.log(`Found female voice: ${femaleVoice.name}`);
    } else {
      console.log("No female voice found, using default voice");
    }
  };

  const speak = (text: string) => {
    if (!speechSynthesisRef.current) return;

    // Cancel any ongoing speech
    speechSynthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesisRef.current.getVoices();

    // Try to set a female voice
    const femaleVoice = voices.find((voice: SpeechSynthesisVoice) =>
      voice.name.toLowerCase().includes("female") ||
      voice.name.toLowerCase().includes("zira") ||
      voice.name.toLowerCase().includes("victoria") ||
      voice.name.toLowerCase().includes("samantha")
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    speechSynthesisRef.current.speak(utterance);
    setMessage(text);
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      speak("Speech recognition is not supported in your browser.");
      return;
    }

    setIsListening(true);
    setMessage("🎤 Listening...");

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Speech recognition start error", error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleCommand = (command: string) => {
    setLoading(true);

    // Login command handling
    if (command.includes("login") && !isAuthenticated) {
      speak("Please enter your token number and password to login.");
    }
    // Table selection commands
    else if (command.includes("open") && command.includes("table") && isAuthenticated) {
      let foundTable = false;

      // Check if any table name is in the command
      Object.entries(TABLE_MAPPING).forEach(([voiceTable, actualTable]) => {
        if (command.includes(voiceTable)) {
          speak(`Opening ${voiceTable}`);
          handleTableSelect(actualTable);
          foundTable = true;
        }
      });

      if (!foundTable) {
        speak("I couldn't find that table. Please try again with a valid table name.");
      }
    }
    // Navigation commands
    else if (command.includes("go to reports") && isAuthenticated) {
      speak("Navigating to reports page");
      router.push("/reports");
    }
    // Logout command
    else if ((command.includes("logout") || command.includes("log out")) && isAuthenticated) {
      speak("Logging you out");
      handleLogout();
    }
    // Close voice assistant
    else if (command.includes("close") || command.includes("exit") || command.includes("quit")) {
      speak("Closing voice assistant");
      setVoiceAssistantOpen(false);
    }
    else {
      speak("I didn't understand that command. Please try again.");
    }

    setLoading(false);
  };

  const toggleVoiceAssistant = () => {
    const newState = !voiceAssistantOpen;
    setVoiceAssistantOpen(newState);

    if (newState) {
      speak("How can I help you?");
    } else {
      stopListening();
    }
  };

  const maskSensitiveData = (data: any[]) => {
    return data.map((row) => {
      const maskedRow = { ...row };
      Object.keys(maskedRow).forEach((key) => {
        if (key.toLowerCase().includes("password")) {
          maskedRow[key] = "••••••";
        }
      });
      return maskedRow;
    });
  };

  const handleTableSelect = async (table: string) => {
    try {
      const response = await fetch(`/api/table-data?table=${table}`);
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to fetch table data");
      }

      setActiveTable(table);
      setTableData(maskSensitiveData(data));
      setColumns(data.length > 0 ? Object.keys(data[0]) : []);

      toast({
        title: "Table loaded successfully",
        description: `Loaded ${data.length} rows from ${table}`,
      });
    } catch (error) {
      toast({
        title: "Error loading table",
        description: error instanceof Error ? error.message : "Unknown error",
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

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to apply filters");
      }

      setTableData(maskSensitiveData(data));
    } catch (error) {
      toast({
        title: "Error applying filters",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oprToken, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid credentials");
      }

      setIsAuthenticated(true);
      sessionStorage.setItem("isAuthenticated", "true");

      toast({
        title: "Login Successful",
        description: "Welcome!",
      });

      // Voice feedback for successful login
      speak("Login successful. Welcome to Database Explorer!");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });

      // Voice feedback for failed login
      speak("Login failed. Please check your credentials and try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("isAuthenticated");
    speak("You have been logged out. Goodbye!");
  };

  return (
    <div className="flex h-screen bg-white-600 p-6 relative"> {/* Added relative for Voice Assistant positioning */}
      {isAuthenticated ? (
        <>
          {/* Sidebar with fixed width */}
          <div className="w-72"> {/* Increased sidebar width */}
            <Sidebar
              tables={tables}
              activeTable={activeTable}
              onTableSelect={handleTableSelect}
            />
          </div>

          {/* Right section takes full remaining width */}
          <div className="flex-1 p-6 flex flex-col w-full">
            <button
              onClick={handleLogout}
              className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
            {activeTable ? (
              <div className="bg-white p-6 rounded-lg shadow-lg w-[95%] h-[90vh] flex-grow overflow-auto"> {/* Increased width and height */}
                <DataTable
                  data={tableData}
                  columns={columns}
                  onFilter={handleFilter}
                  tableName={activeTable}
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Welcome to Database Explorer</h2>
                  <p className="text-white">
                    Select a table from the sidebar to view its data
                  </p>
                  <button
                    onClick={() => router.push("/reports")}
                    className="mt-4 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-200 transition"
                  >
                    View Reports
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="relative w-full h-screen flex items-center justify-center">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/FM-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "100%",
              width: "100%",
            }}
          ></div>

          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          {/* Login Box */}
          <div className="relative z-10 p-8 bg-white bg-opacity-90 shadow-2xl rounded-xl w-96 backdrop-blur-md flex flex-col items-center">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Welcome Back!</h2>
            <p className="text-gray-600 text-sm text-center mb-4">Enter your credentials to access the dashboard</p>

            {/* Input Fields */}
            <div className="w-full">
              <input
                type="text"
                placeholder="Operator Token"
                value={oprToken}
                onChange={(e) => setOprToken(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
              />
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg text-lg font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              Login
            </button>

            {/* Decorative Elements */}
            <div className="absolute -top-12 w-24 h-24 bg-blue-500 rounded-full shadow-lg opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-12 right-10 w-16 h-16 bg-indigo-500 rounded-full shadow-lg opacity-30 animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Voice Assistant Button - Always visible regardless of authentication state */}
      <button
        onClick={toggleVoiceAssistant}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-300 z-50"
        aria-label="Voice Assistant"
      >
        {voiceAssistantOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>

      {/* Voice Assistant Panel */}
      {voiceAssistantOpen && (
        <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-xl p-6 w-80 z-50 border border-gray-200">
          <div className="flex flex-col items-center">
            <div className="text-center mb-4">
              <p className="text-gray-800 font-medium">{message}</p>
              {userCommand && <p className="text-sm text-gray-500 mt-1">"{userCommand}"</p>}
            </div>

            <div className="mt-2">
              {loading ? (
                <div className="animate-pulse flex justify-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="h-6 w-6 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              ) : isListening ? (
                <button
                  onClick={stopListening}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
                >
                  Stop Listening
                </button>
              ) : (
                <button
                  onClick={startListening}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
                >
                  Start Listening
                </button>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-500">
              {!isAuthenticated ? (
                <p>Try saying: "Login"</p>
              ) : (
                <p>Try saying: "Open operators table"</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}