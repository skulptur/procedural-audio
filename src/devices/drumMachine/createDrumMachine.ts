import { createVoice } from "../createVoice";
import { kickVoiceProps, ThingProps } from "./voices/kick";
import { bpmToSamples } from "audio-fns";
import {autoSequence, createSequence,  EventStartEnd, getNoteProgress} from "./events";
import { quantize, quintic } from "unit-fns";

export const createDrumMachine = () => {
  // TODO: when creating multiple we shouldn't
  // create one by one and instead pass the config to createVoices (gets array)
  const kick = createVoice({
    source: kickVoiceProps.source,
    amplitude: kickVoiceProps.amplitude,
    pitch: kickVoiceProps.pitch,
  });

  const sequence = createSequence(44100, 441, (t) => quantize(0.125, quintic(t))) // autoSequence(10000, [0, 1000, 2000, 4000, 8000])

  return (props: ThingProps) => {
    const { sampleRate, bpm, currentSample } = props;
    const bpmInSamples = bpmToSamples(sampleRate, bpm) / 4;
    const currentBeat = Math.floor(currentSample / bpmInSamples);

    const start = currentBeat * bpmInSamples
    const t = getNoteProgress(sequence, props.currentSample)

    const withTiming = {
      ...props,
      start,
      end: start + bpmInSamples,
      t
    };

    return kick(withTiming)

    // return (kick(withTiming) + closedHat(withTiming)) / 2;
  };
};
