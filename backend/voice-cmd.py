import time
import speech_recognition as sr
import pyttsx3
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# Initialize text-to-speech engine
engine = pyttsx3.init() 

# Set female voice if available
voices = engine.getProperty("voices")
female_voice_found = False

for voice in voices:
    if "zira" in voice.name.lower() or "victoria" in voice.name.lower() or "samantha" in voice.name.lower() or "female" in voice.name.lower():
        engine.setProperty("voice", voice.id)
        female_voice_found = True
        break
    
if not female_voice_found:
    print("⚠️ No female voice found. Using default voice.")

def speak(text):
    """Convert text to speech"""
    engine.say(text)
    engine.runAndWait()

def listen():  
    """Listen to user voice input and handle errors"""
    recognizer = sr.Recognizer()
    
    with sr.Microphone() as source:
        print("🎤 Listening...")
        recognizer.adjust_for_ambient_noise(source)
        try:
            audio = recognizer.listen(source, timeout=10, phrase_time_limit=8)
            command = recognizer.recognize_google(audio).lower()
            print(f"🗣️ You said: '{command}'")
            return command
        except sr.UnknownValueError:
            speak("I did not catch that. Please repeat.")
            return ""
        except sr.RequestError:
            speak("Network error.")
            return ""
        except sr.WaitTimeoutError:
            speak("Listening timed out. Try again.")
            return ""

TABLE_MAPPING = {
    "operators table": "xxfmmfg_scada_operators_t",
    "result details table": "xxfmmfg_scada_test_result_det",
    "result details backup table": "xxfmmfg_scada_test_result_det_bkp",
    "test results table": "xxfmmfg_ssd_test_results",
    "oracle scada table": "xxfmmfg_trc_ssd_oracle_scada_t",
    "testing parameter table": "xxfmmfg_trc_testing_parameters_t"
}

def open_database_explorer():
    """Open the Database Explorer webpage and ask for login details"""
    speak("Opening Database Explorer, please wait.")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.get("http://144.13.64.54:3007/")
    
    time.sleep(5)
    speak("Database Explorer is now open. Please enter your token number and password.")
    
    while True:
        speak("Say 'ok I have entered token number and password, login now' when ready.")
        confirmation = listen()
        if "login now" in confirmation:
            speak("Logging in now.")
            login_operator(driver)
            break
        else:
            speak("Waiting for confirmation. Please enter your details and confirm.")
    
    return driver  

def login_operator(driver):
    """Perform login by finding the token number and password fields and submitting"""
    try:
        token_field = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "token_no"))
        )
        password_field = driver.find_element(By.NAME, "password")
        login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]")

        driver.execute_script("arguments[0].scrollIntoView();", login_button)
        time.sleep(1)
        login_button.click()

        speak("Login successful. You can now open tables.")
        print("✅ Login successful.")
    except Exception as e:
        speak("Login failed. Please check your details and try again.")
        print(f"❌ Login error: {e}")

def list_buttons(driver):
    """Print all buttons found on the page for debugging"""
    try:
        buttons = driver.find_elements(By.TAG_NAME, "button")
        button_texts = [btn.text.strip().lower() for btn in buttons if btn.text.strip()]
        print(f"🔎 Available buttons: {button_texts}")
        return button_texts
    except Exception as e:
        print(f"⚠️ Error fetching buttons: {e}")
        return []

def click_table(driver, command):
    """Find and click the correct table button"""
    available_buttons = list_buttons(driver)

    for voice_table, actual_table in TABLE_MAPPING.items():
        if voice_table in command:
            try:
                print(f"🔎 Searching for button: {actual_table}")
                
                button_xpath = f"//button[contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '{actual_table.lower()}')]"
                button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, button_xpath)))

                driver.execute_script("arguments[0].scrollIntoView();", button)
                time.sleep(1)
                button.click()
                
                speak(f"Opening {voice_table}")
                print(f"✅ Opened {voice_table} successfully.")
                return
            except Exception as e:
                speak(f"Could not find {voice_table}. Please try again.")
                print(f"❌ Error: {e}")
                return
            
           

    speak("Table name not recognized.")
    print("❌ Table name not found in mapping.")

if __name__ == "__main__":
    driver = None  
    speak("Hello! Welcome to Database Explorer. Say 'Open Database Explorer' to begin.")

    while True:
        user_command = listen()

        if 'open database explorer' in user_command:
            if not driver:
                driver = open_database_explorer()
            else:
                speak("Database Explorer is already open.")
        elif 'open' in user_command and 'table' in user_command:
            if driver:
                click_table(driver, user_command)
            else:
                speak("Please open the database explorer first.")
        elif 'maximize the window' in user_command:
            if driver:
                driver.maximize_window()
                speak("Window maximized.")
        elif 'minimize the window' in user_command:
            if driver:
                driver.minimize_window()
                speak("Window minimized.")
        elif 'exit' in user_command or 'quit' in user_command:
            speak("Goodbye!")
            if driver:
                driver.quit()
            exit()
        


# import time
# import speech_recognition as sr
# import pyttsx3
# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from webdriver_manager.chrome import ChromeDriverManager

# # Initialize text-to-speech engine
# engine = pyttsx3.init()

# # Set female voice if available
# voices = engine.getProperty("voices")
# female_voice_found = False

# for voice in voices:
#     if "zira" in voice.name.lower() or "victoria" in voice.name.lower() or "samantha" in voice.name.lower() or "female" in voice.name.lower():
#         engine.setProperty("voice", voice.id)
#         female_voice_found = True
#         break

# if not female_voice_found:
#     print("⚠️ No female voice found. Using default voice.")

# def speak(text):
#     """Convert text to speech"""
#     engine.say(text)
#     engine.runAndWait()

# def listen():  
#     """Listen to user voice input and handle errors"""
#     recognizer = sr.Recognizer()
    
#     with sr.Microphone() as source:
#         print("🎤 Listening...")
#         recognizer.adjust_for_ambient_noise(source)
#         try:
#             audio = recognizer.listen(source, timeout=10, phrase_time_limit=8)
#             command = recognizer.recognize_google(audio).lower()
#             print(f"🗣️ You said: '{command}'")
#             return command
#         except sr.UnknownValueError:
#             speak("I did not catch that. Please repeat.")
#             return ""
#         except sr.RequestError:
#             speak("Network error.")
#             return ""
#         except sr.WaitTimeoutError:
#             speak("Listening timed out. Try again.")
#             return ""

# TABLE_MAPPING = {
#     "operators table": "xxfmmfg_scada_operators_t",
#     "result details table": "xxfmmfg_scada_test_result_det",
#     "result details backup table": "xxfmmfg_scada_test_result_det_bkp",
#     "test results table": "xxfmmfg_ssd_test_results",
#     "oracle scada table": "xxfmmfg_trc_ssd_oracle_scada_t",
#     "testing parameter table": "xxfmmfg_trc_testing_parameters_t"
# }

# def open_database_explorer():
#     """Open the Database Explorer webpage and ask for login details"""
#     speak("Opening Database Explorer, please wait.")

#     driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
#     # driver.get("http://144.13.64.54:3001/")
#     driver.get("http://localhost:3000/")

#     # Wait for page to load
#     time.sleep(5)

#     # Ask the operator to enter their token number and password
#     speak("Database Explorer is now open. Please enter your token number and password.")
    
#     while True:
#         speak("Say 'ok I have entered token number and password, login now' when ready.")
#         confirmation = listen()
#         if "login now" in confirmation:
#             speak("Logging in now.")
#             login_operator(driver)
#             break
#         else:
#             speak("Waiting for confirmation. Please enter your details and confirm.")

#     return driver  

# def login_operator(driver):
#     """Perform login by finding the token number and password fields and submitting"""
#     try:
#         token_field = WebDriverWait(driver, 10).until(
#             EC.presence_of_element_located((By.NAME, "token_no"))
#         )
#         password_field = driver.find_element(By.NAME, "password")
#         login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]")

#         # Simulating login (assuming credentials are entered manually)
#         driver.execute_script("arguments[0].scrollIntoView();", login_button)
#         time.sleep(1)
#         login_button.click()

#         speak("Login successful. You can now open tables.")
#         print("✅ Login successful.")
#     except Exception as e:
#         speak("Login failed. Please check your details and try again.")
#         print(f"❌ Login error: {e}")

# def list_buttons(driver):
#     """Print all buttons found on the page for debugging"""
#     try:
#         buttons = driver.find_elements(By.TAG_NAME, "button")
#         button_texts = [btn.text.strip().lower() for btn in buttons if btn.text.strip()]
#         print(f"🔎 Available buttons: {button_texts}")
#         return button_texts
#     except Exception as e:
#         print(f"⚠️ Error fetching buttons: {e}")
#         return []

# def click_table(driver, command):
#     """Find and click the correct table button"""
#     available_buttons = list_buttons(driver)

#     for voice_table, actual_table in TABLE_MAPPING.items():
#         if voice_table in command:
#             try:
#                 print(f"🔎 Searching for button: {actual_table}")

#                 # Find button using a more reliable XPath
#                 button_xpath = f"//button[contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '{actual_table.lower()}')]"
#                 button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, button_xpath)))

#                 # Scroll into view and click
#                 driver.execute_script("arguments[0].scrollIntoView();", button)
#                 time.sleep(1)  # Small delay before clicking
#                 button.click()
                
#                 speak(f"Opening {voice_table}")
#                 print(f"✅ Opened {voice_table} successfully.")
#                 return
#             except Exception as e:
#                 speak(f"Could not find {voice_table}. Please try again.")
#                 print(f"❌ Error: {e}")
#                 return

#     speak("Table name not recognized.")
#     print("❌ Table name not found in mapping.")

# if __name__ == "__main__":
#     driver = None  
#     speak("Hello! Welcome to Database Explorer. Say 'Open Database Explorer' to begin.")

#     while True:
#         user_command = listen()

#         if 'open database explorer' in user_command:
#             if not driver:
#                 driver = open_database_explorer()
#             else:
#                 speak("Database Explorer is already open.")
#         elif 'open' in user_command and 'table' in user_command:
#             if driver:
#                 click_table(driver, user_command)
#             else:
#                 speak("Please open the database explorer first.")
#         elif 'exit' in user_command or 'quit' in user_command:
#             speak("Goodbye!")
#             if driver:
#                 driver.quit()
#             exit()
