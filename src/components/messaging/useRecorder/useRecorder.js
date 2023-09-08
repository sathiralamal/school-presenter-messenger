import { useEffect, useState } from "react";

import AudioRecorder from 'audio-recorder-polyfill';
import mpegEncoder from 'audio-recorder-polyfill/mpeg-encoder';

const useRecorder = () => {
  let [audioFile, setAudioFile] = useState();
  let [audioURL, setAudioURL] = useState("");
  let [isRecording, setIsRecording] = useState(false);
  let [recorder, setRecorder] = useState(null);
  let [mediaStream, setMediaStream] = useState(null);
  let [timer, setTimer] = useState('00:00');
  let [intervalId, setIntervalId] = useState(0);
  
  let mint = 0;
  let second = 0;

  AudioRecorder.encoder=mpegEncoder;
  AudioRecorder.prototype.mimeType='audio/mpeg';
  window.MediaRecorder=AudioRecorder;

  useEffect(() => {
    // Lazily obtain recorder first time we're recording.
    console.log("useRecorder recorder ", recorder, " isRecording ", isRecording);
    if (recorder === null) {
      if (isRecording) {
        try{
          console.log("useRecorder requestRecorder ");

          requestRecorder().then((obj)=>{
            console.log("useRecorder requestRecorder obj ", obj);

            setRecorder(obj.mediaRecorder);
            setMediaStream(obj.stream);
          }, console.error);
        }catch(e){
          console.log("useRecorder error ", e);
        }
        
      }
      return;
    }

    // Manage recorder state.
    if (isRecording) {
      recorder.start();
    } else {
      console.log("STOPPED")
      recorder.stop();
    }

    // Obtain the audio when ready.
    const handleData = e => {
      console.log("e ", e);

      console.log("e.data ", e.data);
      setAudioFile(e.data)
      setAudioURL(URL.createObjectURL(e.data));
    };
    recorder.addEventListener("dataavailable", handleData);

    recorder.ondataavailable = function(e) {
      console.log("mediaRecorder.ondataavailable e.data ", e.data);
    }
    
  
    return () => recorder.removeEventListener("dataavailable", handleData);
  }, [recorder, isRecording]);

  const resetRecording = () => {
    mediaStream.getTracks().forEach(track => track.stop());
    clearInterval(intervalId)
    setIsRecording(false);
    setRecorder(null)
    // setMediaStream(null)
    // if (audioURL !== '') {
    //   setAudioURL('');
    // }
  };

  const startRecording = () => {
    second = 0
    mint = 0
    setIsRecording(true);
    startTimer()
  };

  const startTimer = () => {
    let id = setInterval(() => increaseCounter(), 1000)
    setIntervalId(id)
  };

  const stopRecording = () => {
    console.log("stopRecording ");
    clearInterval(intervalId)
    setIsRecording(false);
  };

  const increaseCounter = async () => {
    if (second < 60 || second == 0) {
      second++
      setTimer(`${mint.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`)
    } else {
      second = 0
      mint++
      setTimer(`${mint.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`)
    }
  };

  return [audioFile, audioURL, isRecording, timer, startRecording, stopRecording, resetRecording, setAudioURL];
};

async function requestRecorder() {
  console.log("enter requestRecorder");
  let mimeType="audio/mp3"
  let stream = null;
  let mediaRecorder = null;
  try{
      console.log("requestRecorder navigator ", JSON.stringify(navigator));

      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if(!MediaRecorder.isTypeSupported(mimeType)){
          mimeType="audio/webm"
      }

      mediaRecorder = await new MediaRecorder(stream);
      console.log("requestRecorder mediaRecorder ", mediaRecorder, " mimeType ", mimeType);
    }catch(error){
      console.log("requestRecorder error ", JSON.stringify(error));
  }
  return {stream, mediaRecorder};
}
export default useRecorder;
