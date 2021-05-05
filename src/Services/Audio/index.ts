import Analyser from "audio-analyser";
import portAudio, { IoStreamRead } from "naudiodon";
import { Broadcast } from "../../Websocket/Server";

let ai: IoStreamRead;
const frequencyCallbacks: ((frequencies: number[]) => Promise<void>)[] = [];

export const InitAudioService = () => {

  ai = portAudio.AudioIO({
    inOptions: {
      channelCount: 1,
      framesPerBuffer: 256 / 2,
      sampleFormat: portAudio.SampleFormat16Bit,
      sampleRate: 48000,
      deviceId: -1, // Use -1 or omit the deviceId to select the default device
      closeOnError: false, // Close the stream if an audio error is detected, if set false then just log the error
    },
  });
  const analyser: NodeJS.WritableStream | any = new Analyser({
    // Magnitude diapasone, in dB
    minDecibels: -100,
    maxDecibels: -0,
    throttle: 10,
    // Number of time samples to transform to frequency
    fftSize: 1024 * 4,

    // Number of frequencies, twice less than fftSize
    frequencyBinCount: 1024 * 2,

    // Smoothing, or the priority of the old data over the new data
    smoothingTimeConstant: 0.01,

    // Number of channel to analyse
    channel: 1,

    // Size of time data to buffer
    bufferSize: 48000,

    //...pcm-stream params, if required
  });

  ai.pipe(analyser);
  analyser.on("data", function (chunk) {
    /*
      const floatFreq = this.getFloatFrequencyData(new Float32Array(this.fftSize));
      const floatTime = this.getFloatTimeDomainData(new Float32Array(this.fftSize));
      const byteFreq = this.getByteFrequencyData(new Uint8Array(this.fftSize));
      const byteTime = this.getByteTimeDomainData(new Uint8Array(this.fftSize));
      const time = this.getTimeData();
    */
    const freq = this.getFrequencyData().map((f) => f + 100);
    const cbPromises = frequencyCallbacks.map((cb) => {
      return cb && cb(freq);
    });
    Broadcast("audio_in_frequencies", freq);
  });
};

export const StartAudioService = () => {
  ai.start();
};

export const ResumeAudioService = () => {
  ai.resume();
};

export const PauseAudioService = () => {
  ai.pause();
};

export const RegisterCallback = (
  cb: (frequencies: number[]) => Promise<void>
) => {
  return frequencyCallbacks.push(cb) - 1;
};

export const UnregisterCallback = (id: number) => {
  frequencyCallbacks[id] = null;
};
