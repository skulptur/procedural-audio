const fs = require("fs");
// @ts-ignore
import player from "node-wav-player";

import { encode } from "dotwav";
import { clamp } from "unit-fns";
import {
  bpmToSamples,
} from "audio-fns";
import { createDrumMachine } from "./devices/drumMachine/createDrumMachine";

type RenderProps = {
  sampleRate: number;
  bpm: number;
  totalSamples: number;
};

const renderBuffer = ({ sampleRate, bpm, totalSamples }: RenderProps) => {
  const bpmInSamples = bpmToSamples(sampleRate, bpm);
  const beatBuffer = new Float64Array(totalSamples);
  const drumMachine = createDrumMachine();
  

  const tone = beatBuffer.map((_: number, currentSample: number) => {
    const output = drumMachine({
      bpm,
      currentSample,
      pitch: 440,
      sampleRate,
    });

    return clamp(-1, 1, output) * 0.5;
  });

  return tone;
};

const path = "audio.wav";
const sampleRate = 44100;
const totalSamples = sampleRate * 1
const bpm = 140/2

const buffer = renderBuffer({
  sampleRate,
  bpm,
  totalSamples,
})

fs.writeFileSync(
  path,
  new Buffer(
    encode(
      {
        sampleRate,
        channelData: [buffer as any],
      },
      {}
    )
  )
);

player
  .play({
    path,
    // loop: true,
  })
  .then(() => console.log(`Playing ${path}!`));



// const renderBuffer = ({ sampleRate, bpm, totalSamples }: RenderProps) => {
//   const bpmInSamples = bpmToSamples(sampleRate, bpm);
//   const beatBuffer = createBuffer(Float64Array, totalSamples);

//   const tone = beatBuffer.map((_: number, currentSample: number) => {
//     const currentBeat = Math.floor(currentSample / bpmInSamples);
//     const beatProgress = ((currentSample * 2) % bpmInSamples) / bpmInSamples;

//     const stepEnvelope = currentBeat % 5;

//     const pitchStep = currentBeat % toneSequence.length;
//     const stepPitch = toneSequence[pitchStep];

//     const ratioStep = currentBeat % ratioSequence.length;
//     const stepRatio = ratioSequence[ratioStep];

//     const envelope1 = quintic(wrap((1 - beatProgress) * stepEnvelope));

//     const tone1 = oscillator(sineWave, sampleRate, currentSample, stepPitch);
//     const tone2 = oscillator(
//       sineWave,
//       sampleRate,
//       currentSample,
//       stepPitch * stepRatio
//     );

//     const distortedWithEnv = cubicSoftClip(tone1 * tone2 * 50) * envelope1;

//     return clamp(-1, 1, distortedWithEnv) * 0.5;
//   });
//   console.log(loop([1, 0], 100));

//   return loop(tone, 10);
// };