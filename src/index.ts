const fs = require("fs");
// @ts-ignore
import player from "node-wav-player";

import { encode } from "dotwav";
import { clamp, quintic, wrap } from "unit-fns";
import {
  sineWave,
  bpmToSamples,
  oscillator,
  cubicSoftClip,
  createBuffer,
  loop,
} from "audio-fns";
// @ts-ignore
import { noteToFrequency } from "music-fns";
import { times } from "lodash";
import { createDrumMachine } from "./devices/drumMachine/createDrumMachine";

const toneSequence: Array<number> = ["C3", "E2", "G2", "D3"].map(
  noteToFrequency
);
const ratioSequence = [0.5, 1];

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

const path = "audio.wav";
const sampleRate = 44100;
const durationInSeconds = 5;

fs.writeFileSync(
  path,
  new Buffer(
    encode(
      {
        sampleRate,
        channelData: [
          renderBuffer({
            sampleRate,
            bpm: 140 / 2,
            totalSamples: sampleRate * durationInSeconds,
          }) as any,
        ],
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
