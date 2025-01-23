import { StationLocation } from "../types/StationLocation";
import { Time } from "./Time";

type PersonLikeType = {
    TimeArrived?: {hour: number, minutes: number, seconds: number},
    TimeEnteredRegisterDeskQueue?: {hour: number, minutes: number, seconds: number},
    TimeFinishedRegisterDeskQueue?: {hour: number, minutes: number, seconds: number},
    TimeFinishedRegisterDesk?: {hour: number, minutes: number, seconds: number},
    TimeFinishedVotingBoothQueue?: {hour: number, minutes: number, seconds: number},
    TimeFinishedVotingBooth?: {hour: number, minutes: number, seconds: number},
    TimeFinishedBallotBoxQueue?: {hour: number, minutes: number, seconds: number},
    TimeFinishedBallotBox?: {hour: number, minutes: number, seconds: number},
    TimeExited?: {hour: number, minutes: number, seconds: number},
}

export class Person {
    CurrentLocation: StationLocation = 'Arriving';
    TimeArrived?: Time;
    TimeEnteredRegisterDeskQueue?: Time;
    TimeFinishedRegisterDeskQueue?: Time;
    TimeFinishedRegisterDesk?: Time;
    TimeFinishedVotingBoothQueue?: Time;
    TimeFinishedVotingBooth?: Time
    TimeFinishedBallotBoxQueue?: Time;
    TimeFinishedBallotBox?: Time;
    TimeExited?: Time;

    static fromObject(obj: PersonLikeType) {
        const p = new this();
        p.TimeArrived = Time.fromObject(obj.TimeArrived);
        p.TimeEnteredRegisterDeskQueue = Time.fromObject(obj.TimeEnteredRegisterDeskQueue);
        p.TimeFinishedRegisterDeskQueue = Time.fromObject(obj.TimeFinishedRegisterDeskQueue);
        p.TimeFinishedRegisterDesk = Time.fromObject(obj.TimeFinishedRegisterDesk);
        p.TimeFinishedVotingBoothQueue = Time.fromObject(obj.TimeFinishedVotingBoothQueue);
        p.TimeFinishedVotingBooth = Time.fromObject(obj.TimeFinishedVotingBooth);
        p.TimeFinishedBallotBoxQueue = Time.fromObject(obj.TimeFinishedBallotBoxQueue);
        p.TimeFinishedBallotBox = Time.fromObject(obj.TimeFinishedBallotBox);
        p.TimeExited = Time.fromObject(obj.TimeExited);
        return p;
    }

    TotalSecondsUntilVoted = () =>
        this.TimeArrived !== undefined && this.TimeFinishedBallotBox !== undefined
            ? this.TimeFinishedBallotBox.diff(this.TimeArrived, 'Seconds') : undefined;
}
