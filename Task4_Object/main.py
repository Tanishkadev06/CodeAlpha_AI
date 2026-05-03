import cv2
from ultralytics import YOLO

# 1. Load a pre-trained YOLOv8 model (n = nano, fast for real-time)
model = YOLO('yolov8n.pt')

# 2. Set up video input (0 is usually the default webcam)
# Replace 0 with 'video.mp4' if you want to process a file
cap = cv2.VideoCapture(0)

while cap.isOpened():
    success, frame = cap.read()

    if success:
        # 3. & 4. Run YOLOv8 detection + tracking (using BoT-SORT)
        # persist=True ensures the tracker keeps IDs across frames
        results = model.track(frame, persist=True, conf=0.5, iou=0.5)

        # 5. Visualize the results on the frame
        annotated_frame = results[0].plot()

        # Display the output
        cv2.imshow("YOLOv8 Real-Time Tracking", annotated_frame)

        # Break the loop if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
    else:
        break

# Clean up
cap.release()
cv2.destroyAllWindows()