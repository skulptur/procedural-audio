import { createVoice } from "../createVoice";
import { kickVoiceProps, ThingProps } from "./voices/kick";
import { bpmToSamples } from "audio-fns";

export const createDrumMachine = () => {
  // TODO: when creating multiple we shouldn't
  // create one by one and instead pass the config to createVoices (gets array)
  const kick = createVoice({
    source: kickVoiceProps.source,
    amplitude: kickVoiceProps.amplitude,
    pitch: kickVoiceProps.pitch,
  });

  const closedHat = createVoice({
    source: kickVoiceProps.source,
    amplitude: kickVoiceProps.amplitude,
    pitch: kickVoiceProps.pitch,
  });

  return (props: ThingProps) => {
    const { sampleRate, bpm, currentSample } = props;
    const bpmInSamples = bpmToSamples(sampleRate, bpm) / 4;
    const currentBeat = Math.floor(currentSample / bpmInSamples);

    const start = currentBeat * bpmInSamples
  
    const withStartDuration = {
      ...props,
      start,
      end: start + bpmInSamples,
    };

    return (kick(withStartDuration) + closedHat(withStartDuration)) / 2;
  };
};
