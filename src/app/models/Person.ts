import { Dayjs } from "dayjs";
import { StationLocation } from "../types/StationLocation";

export class Person {
    CurrentLocation: StationLocation = 'Arriving';
    TimeEnteredRegisterDeskQueue?: Dayjs;
    TimeFinishedRegisterDeskQueue?: Dayjs;
    TimeFinishedRegisterDesk?: Dayjs;
    TimeFinishedVotingBoothQueue?: Dayjs;
    TimeFinishedVotingBooth?: Dayjs
    TimeFinishedBallotBoxQueue?: Dayjs;
    TimeFinishedBallotBox?: Dayjs;
    TimeExited?: Dayjs;
}