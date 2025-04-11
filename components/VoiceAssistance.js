// First, install required dependencies:
// npm install react-speech-recognition regenerator-runtime

// components/VoiceAssistant.js
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import speech recognition to avoid SSR issues
const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);
  const [message, setMessage] = useState('How can I help you?');
  const [userCommand, setUserCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  
  // Initialize speech components on client-side only
  useEffect(() => {
    if (typeof window !== 'undefined' && !initialized) {
      // Initialize speech recognition
      if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript.toLowerCase();
          console.log(`🗣️ You said: '${transcript}'`);
          setUserCommand(transcript);
          handleCommand(transcript);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
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
      
      setInitialized(true);
    }
  }, [initialized]);
  
  const setFemaleVoice = (voices) => {
    if (!speechSynthesisRef.current) return;
    
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('zira') || 
      voice.name.toLowerCase().includes('victoria') || 
      voice.name.toLowerCase().includes('samantha')
    );
    
    if (femaleVoice) {
      console.log(`Found female voice: ${femaleVoice.name}`);
    } else {
      console.log('No female voice found, using default voice');
    }
  };
  
  const speak = (text) => {
    if (!speechSynthesisRef.current) return;
    
    // Cancel any ongoing speech
    speechSynthesisRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesisRef.current.getVoices();
    
    // Try to set a female voice
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('zira') || 
      voice.name.toLowerCase().includes('victoria') || 
      voice.name.toLowerCase().includes('samantha')
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
    setMessage('🎤 Listening...');
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Speech recognition start error', error);
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };
  
  const handleCommand = (command) => {
    setLoading(true);
    
    // Map your custom commands here
    if (command.includes('open database explorer')) {
      speak("Opening Database Explorer, please wait.");
      // Add your navigation or function call here
      // Example: router.push('/database-explorer');
    } 
    else if (command.includes('open') && command.includes('table')) {
      // Parse the table name from the command
      Object.entries(TABLE_MAPPING).forEach(([voiceTable, actualTable]) => {
        if (command.includes(voiceTable)) {
          speak(`Opening ${voiceTable}`);
          // Add your table opening logic here
        }
      });
    }
    else if (command.includes('maximize')) {
      speak("Window maximized.");
      // Add window maximize logic if applicable in browser
    }
    else if (command.includes('minimize')) {
      speak("Window minimized.");
      // Add window minimize logic if applicable in browser
    }
    else if (command.includes('exit') || command.includes('quit')) {
      speak("Goodbye!");
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
  
  // Table mapping from your original code
  const TABLE_MAPPING = {
    "operators table": "xxfmmfg_scada_operators_t",
    "result details table": "xxfmmfg_scada_test_result_det",
    "result details backup table": "xxfmmfg_scada_test_result_det_bkp",
    "test results table": "xxfmmfg_ssd_test_results",
    "oracle scada table": "xxfmmfg_trc_ssd_oracle_scada_t",
    "testing parameter table": "xxfmmfg_trc_testing_parameters_t"
  };
  
  return (
    <div className="relative">
      {/* Voice Assistant Button */}
      <button 
        onClick={toggleVoiceAssistant}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-300"
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
              <p>Try saying: "Open database explorer"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;