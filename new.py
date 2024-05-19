import cv2
import mediapipe as mp
import numpy as np
from scipy.signal import find_peaks
from scipy.spatial import distance as dist
from fer import FER
from ffpyplayer.player import MediaPlayer
from matplotlib import pyplot as plt
import mss
import threading
from datetime import datetime
import time
import sys

# Constants
MAX_FRAMES = 120
RECENT_FRAMES = MAX_FRAMES // 10
EYE_BLINK_HEIGHT = 0.15
SIGNIFICANT_BPM_CHANGE = 8
LIP_COMPRESSION_RATIO = 0.35
TELL_MAX_TTL = 30
TEXT_HEIGHT = 30
FACEMESH_FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10]
EPOCH = time.time()

# Global variables
recording = None
tells = dict()
blinks = [False] * MAX_FRAMES
blinks2 = [False] * MAX_FRAMES
hand_on_face = [False] * MAX_FRAMES
hand_on_face2 = [False] * MAX_FRAMES
face_area_size = 0
hr_times = list(range(0, MAX_FRAMES))
hr_values = [400] * MAX_FRAMES
avg_bpms = [0] * MAX_FRAMES
gaze_values = [0] * MAX_FRAMES
emotion_detector = FER(mtcnn=True)
calculating_mood = False
mood = ''
meter = cv2.imread('meter.png')
fig = None
ax = None
line = None
peakpts = None

def chart_setup():
    global fig, ax, line, peakpts
    plt.ion()
    fig = plt.figure()
    ax = fig.add_subplot(1, 1, 1)
    ax.set(ylim=(185, 200))
    line, = ax.plot(hr_times, hr_values, 'b-')
    peakpts, = ax.plot([], [], 'r+')

def decrement_tells(tells):
    for key, tell in tells.copy().items():
        if 'ttl' in tell:
            tell['ttl'] -= 1
            if tell['ttl'] <= 0:
                del tells[key]
    return tells

def new_tell(result):
    global TELL_MAX_TTL
    return {'text': result, 'ttl': TELL_MAX_TTL}

def draw_on_frame(image, face_landmarks, hands_landmarks):
    mp.solutions.drawing_utils.draw_landmarks(
        image, face_landmarks, mp.solutions.face_mesh.FACEMESH_CONTOURS,
        landmark_drawing_spec=None,
        connection_drawing_spec=mp.solutions.drawing_styles.get_default_face_mesh_contours_style())
    mp.solutions.drawing_utils.draw_landmarks(
        image, face_landmarks, mp.solutions.face_mesh.FACEMESH_IRISES,
        landmark_drawing_spec=None,
        connection_drawing_spec=mp.solutions.drawing_styles.get_default_face_mesh_iris_connections_style())
    for hand_landmarks in (hands_landmarks or []):
        mp.solutions.drawing_utils.draw_landmarks(
            image, hand_landmarks, mp.solutions.hands.HAND_CONNECTIONS,
            mp.solutions.drawing_styles.get_default_hand_landmarks_style(),
            mp.solutions.drawing_styles.get_default_hand_connections_style())

def add_text(image, tells, calibrated):
    global mood
    text_y = TEXT_HEIGHT
    if mood:
        write("Mood: {}".format(mood), image, int(.75 * image.shape[1]), TEXT_HEIGHT)
    if calibrated:
        for tell in tells.values():
            write(tell['text'], image, 10, text_y)
            text_y += TEXT_HEIGHT

def write(text, image, x, y):
    cv2.putText(img=image, text=text, org=(x, y),
                fontFace=cv2.FONT_HERSHEY_SIMPLEX, fontScale=1, color=[0, 0, 0],
                lineType=cv2.LINE_AA, thickness=4)
    cv2.putText(img=image, text=text, org=(x, y),
                fontFace=cv2.FONT_HERSHEY_SIMPLEX, fontScale=1, color=[255, 255, 255],
                lineType=cv2.LINE_AA, thickness=2)

def get_aspect_ratio(top, bottom, right, left):
    height = dist.euclidean([top.x, top.y], [bottom.x, bottom.y])
    width = dist.euclidean([right.x, right.y], [left.x, left.y])
    return height / width

def get_area(image, draw, topL, topR, bottomR, bottomL):
    topY = int((topR.y + topL.y) / 2 * image.shape[0])
    botY = int((bottomR.y + bottomL.y) / 2 * image.shape[0])
    leftX = int((topL.x + bottomL.x) / 2 * image.shape[1])
    rightX = int((topR.x + bottomR.x) / 2 * image.shape[1])
    if draw:
        image = cv2.circle(image, (leftX, topY), 2, (255, 0, 0), 2)
        image = cv2.circle(image, (leftX, botY), 2, (255, 0, 0), 2)
        image = cv2.circle(image, (rightX, topY), 2, (255, 0, 0), 2)
        image = cv2.circle(image, (rightX, botY), 2, (255, 0, 0), 2)
    return image[topY:botY, rightX:leftX]

def get_bpm_tells(cheekL, cheekR, fps, bpm_chart):
    global hr_times, hr_values, avg_bpms
    global ax, line, peakpts
    cheekLwithoutBlue = np.average(cheekL[:, :, 1:3])
    cheekRwithoutBlue = np.average(cheekR[:, :, 1:3])
    hr_values = hr_values[1:] + [cheekLwithoutBlue + cheekRwithoutBlue]
    if not fps:
        hr_times = hr_times[1:] + [time.time() - EPOCH]
    if bpm_chart:
        line.set_data(hr_times, hr_values)
        ax.relim()
        ax.autoscale()
    peaks, _ = find_peaks(hr_values, threshold=.1, distance=5, prominence=.5, wlen=10)
    peak_times = [hr_times[i] for i in peaks]
    if bpm_chart:
        peakpts.set_data(peak_times, [hr_values[i] for i in peaks])
    bpms = 60 * np.diff(peak_times) / (fps or 1)
    bpms = bpms[(bpms > 50) & (bpms < 150)]
    recent_bpms = bpms[(-3 * RECENT_FRAMES):]
    recent_avg_bpm = 0
    bpm_display = "BPM: ..."
    if recent_bpms.size > 1:
        recent_avg_bpm = int(np.average(recent_bpms))
        bpm_display = "BPM: {} ({})".format(recent_avg_bpm, len(recent_bpms))
    avg_bpms = avg_bpms[1:] + [recent_avg_bpm]
    bpm_delta = 0
    bpm_change = ""
    if len(recent_bpms) > 2:
        all_bpms = list(filter(lambda bpm: bpm != '-', avg_bpms))
        all_avg_bpm = sum(all_bpms) / len(all_bpms)
        avg_recent_bpm = sum(recent_bpms) / len(recent_bpms)
        bpm_delta = avg_recent_bpm - all_avg_bpm
        if bpm_delta > SIGNIFICANT_BPM_CHANGE:
            bpm_change = "Heart rate increasing"
        elif bpm_delta < -SIGNIFICANT_BPM_CHANGE:
            bpm_change = "Heart rate decreasing"
    return bpm_display, bpm_change

def is_blinking(face):
    eyeR = [face[p] for p in [159, 145, 133, 33]]
    eyeR_ar = get_aspect_ratio(*eyeR)
    eyeL = [face[p] for p in [386, 374, 362, 263]]
    eyeL_ar = get_aspect_ratio(*eyeL)
    eyeA_ar = (eyeR_ar + eyeL_ar) / 2
    return eyeA_ar < EYE_BLINK_HEIGHT

def get_blink_tell(blinks):
    if sum(blinks[:RECENT_FRAMES]) < 3:
        return None
    recent_closed = 1.0 * sum(blinks[-RECENT_FRAMES:]) / RECENT_FRAMES
    avg_closed = 1.0 * sum(blinks) / MAX_FRAMES
    if recent_closed > (20 * avg_closed):
        return "Increased blinking"
    elif avg_closed > (20 * recent_closed):
        return "Decreased blinking"
