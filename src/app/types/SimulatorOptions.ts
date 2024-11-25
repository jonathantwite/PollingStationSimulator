import { VisitProfileHour } from "./VisitProfileHour";

export type SimulatorOptions = {
    VisitProfile: VisitProfileHour[];
    OpeningTime: Date;
    ClosingTime: Date;

    MaxQueueRegisterDesk: Number;
    MaxQueueVotingBooth: Number;
    MaxQueueBallotBox: Number;
    MaxInBuilding: Number;

    MinTimeInRegisterDeskQueue: Number;
    MinTimeInVotingBoothQueue: Number;
    MinTimeInBallotBoxQueue: Number;
    MinTimeInExitQueue: Number;
}