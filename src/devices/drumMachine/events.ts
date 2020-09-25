import { clamp } from 'lodash'
import {mapFrom} from 'unit-fns'

export type EventTiming = {
    start: number;
    end: number;
}

// TODO: should we support this kind of event as well?
// type TimeEvent = {
//     start: number;
//     duration: number;
//   };

export type Sequence = Array<EventTiming>

export const createEvent = (start: number, end: number) => {
    return {
        start,
        end
    }
}

// provide only start times and end gets created automatically
export const autoSequence = (duration: number, startTimes: Array<number>) => {
    const length = startTimes.length

    return startTimes.filter((startTime) => startTime > duration).map((startTime, index) => {

        const nextStart = index < length - 2 ? startTimes[index + 1] : duration;
        
        return createEvent(startTime, nextStart)
    })
}

export const isBetween = (start: number, end: number, value: number) => {
    return value >= start && value <= end
}

export const getEventAtTime =  (sequence: Sequence, time: number) => {
    return sequence.find(({start, end}) => isBetween(start, end, time)) || null
}

export const getNoteProgress = (sequence: Sequence, time: number) => {
    const evt = getEventAtTime(sequence, time)

    return evt ? mapFrom(evt.start, evt.end, time) : null;
}

