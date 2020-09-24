import { inverse, quintic } from "unit-fns";
import { sineWave, oscillator } from "audio-fns";

export type ThingProps = {
  currentSample: number;
  sampleRate: number;
  pitch: number;
  bpm: number;
};

export type Progress = {
  t: number;
};

export const kickPitch = ({ t }: Progress) => {
  return 220 * quintic(inverse(t)) + 220;
};

export const kickEnvelope = ({ t }: Progress) => {
  return quintic(inverse(t));
};

export const kickSource = (props: ThingProps) => {
  return oscillator(
    sineWave,
    props.sampleRate,
    props.currentSample,
    props.pitch
  );
};

export const kickVoiceProps = {
  source: kickSource,
  amplitude: kickEnvelope,
  pitch: kickPitch,
};
