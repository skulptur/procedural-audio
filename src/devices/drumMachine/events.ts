import { clamp, times } from 'lodash'
import {mapFrom} from 'unit-fns'

type EventStart = {
    start: number;
}

export type EventStartEnd = EventStart & {
    end: number;
}

// TODO: should we support this kind of event as well?
// type TimeEvent = {
//     start: number;
//     duration: number;
//   };

export type Sequence = Array<EventStartEnd>

export const createEvent = (start: number, end: number) => {
    return {
        start,
        end
    }
}

export const createWithDuration = (start: number, duration: number) => {
    return createEvent(start, start + duration)
}

export const setDuration = (evt: EventStartEnd, duration: number) => {
    return createWithDuration(evt.start, duration)
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


// provide only start times and end gets created automatically
export const autoSequence = (duration: number, startTimes: Array<number>) => {
    const length = startTimes.length

    return startTimes.filter((startTime) => startTime < duration).map((startTime, index) => {

        const nextStart = index < length - 2 ? startTimes[index + 1] : duration;
        
        return createEvent(startTime, nextStart)
    })
}

export const createSequence = (duration: number, events: number, fn: (t: number) => number) => {
    // TODO: last item's start time will be duration, not what we want
    // TODO: remove duplicates
    const startTimes = times(events, (index) => {
        const progress = index / events
        return fn(progress) * duration
    })

    return autoSequence(duration, startTimes)
}