import cv2
import mediapipe as mp
import pyttsx3
import numpy as np
import time

# Initialize Mediapipe Pose and Text-to-Speech
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose()
engine = pyttsx3.init()

# Voice alert function with cooldown
last_alert_time = 0
cooldown_seconds = 5  # Minimum seconds between voice alerts


def voice_alert(message):
    global last_alert_time
    current_time = time.time()
    if current_time - last_alert_time > cooldown_seconds:
        print(message)  # Print the message for debugging
        engine.say(message)
        engine.runAndWait()
        last_alert_time = current_time


# Initialize webcam
cap = cv2.VideoCapture(0)  # Use 0 for the default webcam

if not cap.isOpened():
    print("Error: Cannot access the webcam.")
    exit()

# Main loop
while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab a frame.")
        break

    # Convert the frame to RGB (required by Mediapipe)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Process the frame for pose detection
    result = pose.process(rgb_frame)

    # Draw pose landmarks on the frame
    if result.pose_landmarks:
        mp_drawing.draw_landmarks(frame, result.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        landmarks = result.pose_landmarks.landmark

        # Check condition: Right hand not near railing (below hips)
        right_hand = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST]
        right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP]

        if right_hand.y > right_hip.y:
            voice_alert("Please use the railing for safety.")

        # Check condition: Person using phone (head close to hands)
        nose = landmarks[mp_pose.PoseLandmark.NOSE]
        right_hand_x = right_hand.x

        if abs(right_hand_x - nose.x) < 0.1:  # Adjust threshold as needed
            voice_alert("Please avoid using your phone while walking on steps.")

    # Display the frame
    cv2.imshow("Step Monitoring", frame)

    # Exit when 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
