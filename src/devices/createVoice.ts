import { clamp, mapFrom } from "unit-fns";
import { ThingProps, Progress } from "./drumMachine/voices/kick";

type VoiceProps = {
  amplitude: (props: ThingProps & Progress) => number;
  source: (props: ThingProps) => number;
  pitch: (props: ThingProps & Progress) => number;
};

type TimeEvent = {
  start: number;
  duration: number;
};

export const createVoice = ({ amplitude, source, pitch }: VoiceProps) => {
  return (props: ThingProps & TimeEvent) => {
    const progress = mapFrom(
      props.start,
      props.start + props.duration,
      props.currentSample
    );

    if (clamp(0, 1, progress) !== progress) return 0;

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
