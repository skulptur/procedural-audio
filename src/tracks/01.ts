const fs = require("fs");
// @ts-ignore
import player from "node-wav-player";
import { encode } from "dotwav";
import { repeat, inverse, wrap, clamp, quintic, round } from "unit-fns";

const gain = (a: number, amount: number) => {
  return (a - 0.5) * amount + 0.5;
};

const sampleRate = 44100;
const durationInSeconds = 10;
const totalSamples = sampleRate * durationInSeconds;
const path = "noise.wav";

const kick = (t: number) => {
  const cycles = 10;
  const wave = repeat(1 / cycles, t);
  const amplitude = quintic(inverse(t));

  return gain(wave, amplitude);
};

const kickLoop = (t: number) => {
  const multi = round(wrap(t * 20));
  const loopN = multi > 0 ? 25 : 50;
  return repeat(1 / loopN, kick(wrap(t * loopN)));
};

const renderAudio = (t: number) => {
  const kickTrack = kickLoop(t);
  const riserTrack = repeat(kick(t), kickLoop(wrap(t * 2)));
  return gain(kickTrack, 0.7) + gain(riserTrack, 0.3);
};

const audio = {
  sampleRate,
  channelData: [
    new Float32Array(totalSamples).map((_, index) => {
      const progress = index / totalSamples;
      return clamp(0, 1, renderAudio(progress)) - 0.5;
    }),
  ],
};

fs.writeFileSync(path, new Buffer(encode(audio, {})));

player
  .play({
    path,
    // loop: true,
  })
  .then(() => console.log(`Playing ${path}!`));
