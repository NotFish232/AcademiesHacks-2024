import assemblyai as aai
import openai
from queue import Queue
from elevenlabs import play
from elevenlabs.client import ElevenLabs

client = ElevenLabs(
  api_key="ad3aca8bb592c00337b985f9e71cec95", # Defaults to ELEVEN_API_KEY
)
aai.settings.api_key = "7a3f10a18f59461887ae4c6c3b2aae9d"
openai.api_key = "sk-proj-lQSWXvvRQj0VWmjG3hmET3BlbkFJnSfmb69i7vOVqbHZsTcR"

transcript_queue = Queue()

def on_open(session_opened: aai.RealtimeSessionOpened):
  "This function is called when the connection has been established."
  print("Session ID:", session_opened.session_id)
  print("Start speaking and press Ctrl+C after you are done talking")

def on_data(transcript: aai.RealtimeTranscript):
  "This function is called when a new transcript has been received."
  if not transcript.text:
    return

  if isinstance(transcript, aai.RealtimeFinalTranscript):
    transcript_queue.put(transcript.text + '')
    print("Suspect:", transcript.text, end="\r\n")
  else:
    print(transcript.text, end="\r")

def on_error(error: aai.RealtimeError):
  "This function is called when the connection has been closed."
  print("error")

  print("An error occured:", error)

def on_close():
  "This function is called when the connection has been closed."

  print("Closing Session")


def handle_conversation():
    conversation = ""
    count = 0

    #write about the crime
    crimeInfo = "A man was murdered and a beanbag when he was playing beanbags with his friends and was found dead on the scene."

    messageBase = 'You are interrogating a suspected criminal, ask questions to the suspect to see if he his guilty. Ask the suspect one question at a time and respond very quickly. This is the info on the crime case: ' + crimeInfo
    notEnded = True

    while notEnded:
        transcriber = aai.RealtimeTranscriber(
            sample_rate=16_000,
            on_data=on_data,
            on_error=on_error,
            on_open=on_open,
            on_close=on_close,
        )

        transcriber.connect()
        microphone_stream = aai.extras.MicrophoneStream(sample_rate=16_000)
        transcriber.stream(microphone_stream)
        transcriber.close()

        transcript_result = transcript_queue.get()
        
        conversation += "Suspect: " + transcript_result + " "
        # Send the transcript to OpenAI for response generation
        if "STOP INTERROGATION" in transcript_result.upper() or "STOP THE INTERROGATION" in transcript_result.upper():
            print("Okay, I will end the interrogation now.",)
            notEnded = False
            audio = client.generate(
            text="Okay, I will end the interrogation now.",
            voice="Rachel",
            model="eleven_multilingual_v2"
            )
            break

        print("Generating Response")
        if count > 0:
            message = messageBase + "So far, this is the current conversation with the suspect: " + conversation
        else:
            message = messageBase
        response = openai.ChatCompletion.create(
            model = 'gpt-4',
            messages = [
                {"role": "system", "content": message},
                {"role": "user", "content": transcript_result}
            ]
        )

        texto = response['choices'][0]['message']['content']
        # text = "This is a sample message"
        print("Detective:", texto, end="\r\n")
        conversation += "Detective: " + texto + " "
        audio = client.generate(
        text=texto,
        voice="Rachel",
        model="eleven_multilingual_v2"
        )
        play(audio)
        count += 1

handle_conversation()





