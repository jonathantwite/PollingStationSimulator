import { StationLocation } from "../types/StationLocation";
import { Time } from "./Time";

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

    TotalSecondsUntilVoted = () =>
        this.TimeArrived !== undefined && this.TimeFinishedBallotBox !== undefined
            ? this.TimeFinishedBallotBox.diff(this.TimeArrived, 'Seconds') : undefined;
}
