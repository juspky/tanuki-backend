import WebSocket from "ws";
import Analyser from "audio-analyser";
import portAudio from "naudiodon";

const wss = new WebSocket.Server({ port: parseInt(process.env.WS_PORT) || 8081 });

const InitAudio = () => {
  const ai = portAudio.AudioIO({
    inOptions: {
      channelCount: 1,
      framesPerBuffer: 256,
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
    throttle: 20,
    // Number of time samples to transform to frequency
    fftSize: 1024 * 4,

    // Number of frequencies, twice less than fftSize
    frequencyBinCount: 1024 * 4,

    // Smoothing, or the priority of the old data over the new data
    smoothingTimeConstant: 0.01,

    // Number of channel to analyse
    channel: 0,

    // Size of time data to buffer
    bufferSize: 48000,

    //...pcm-stream params, if required
  });

  ai.pipe(analyser);

  analyser.on("data", function (chunk) {
    /*
    var floatFreq = this.getFloatFrequencyData(new Float32Array(this.fftSize));
    var floatTime = this.getFloatTimeDomainData(new Float32Array(this.fftSize));
    var byteFreq = this.getByteFrequencyData(new Uint8Array(this.fftSize));
    var byteTime = this.getByteTimeDomainData(new Uint8Array(this.fftSize));
    var time = this.getTimeData();
    */
    const freq = this.getFrequencyData().map((f) => f + 100);

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(freq));
      }
    });
  });

  ai.start();
};

export default InitAudio;
