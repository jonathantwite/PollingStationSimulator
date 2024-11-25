import { StationLocation } from "../types/StationLocation";

export class Person {
    CurrentLocation: StationLocation = 'Arriving';
    TimeFinishedBallotBoxQueue?: Date;
    TimeFinishedBallotBox?: Date;
    TimeExited?: Date;
}