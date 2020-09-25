import { autoSequence, EventTiming, getNoteProgress } from "./drumMachine/events";
import { ThingProps, Progress } from "./drumMachine/voices/kick";

type VoiceProps = {
  amplitude: (props: ThingProps & Progress) => number;
  source: (props: ThingProps) => number;
  pitch: (props: ThingProps & Progress) => number;
};

const sequence = autoSequence(5000, [0, 1000, 2000, 3000, 4000])

export const createVoice = ({ amplitude, source, pitch }: VoiceProps) => {
  return (props: ThingProps & EventTiming) => {
    const progress = getNoteProgress(sequence, props.currentSample) || 0

    const pitchValue = pitch({
      ...props,
      t: progress,
    });

    const amplitudeValue = amplitude({
      ...props,
      t: progress,
    });

    return source({ ...props, pitch: pitchValue }) * amplitudeValue;
  };
};
