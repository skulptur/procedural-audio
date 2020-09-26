import {  EventStartEnd, getNoteProgress } from "./drumMachine/events";
import { ThingProps, Progress } from "./drumMachine/voices/kick";

type VoiceProps = {
  amplitude: (props: ThingProps & Progress) => number;
  source: (props: ThingProps) => number;
  pitch: (props: ThingProps & Progress) => number;
};

export const createVoice = ({ amplitude, source, pitch }: VoiceProps) => {
  return (props: ThingProps & EventStartEnd & {t: number | null }) => {
    if(props.t  === null) return 0;

    //@ts-ignore
    const pitchValue = pitch(props);
    //@ts-ignore
    const amplitudeValue = amplitude(props);

    return source({ ...props }) * amplitudeValue;
  };
};
