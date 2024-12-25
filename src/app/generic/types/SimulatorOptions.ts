import { Dayjs } from "dayjs";
import { VisitProfileHour } from "./VisitProfileHour";

export type SimulatorOptions = {
    VisitProfile: VisitProfileHour[];
    OpeningTime: Dayjs;
    ClosingTime: Dayjs;

    MaxQueueRegisterDesk: number;
    NumberOfRegisterDesks: number;
    MaxQueueVotingBooth: number;
    NumberOfVotingBooths: number;
    MaxQueueBallotBox: number;
    NumberOfBallotBoxes: number;
    MaxInBuilding: number;

    MinTimeInRegisterDeskQueue: number;
    AvgTimeAtRegisterDesk: number
    MinTimeInVotingBoothQueue: number;
    AvgTimeAtVotingBooth: number;
    MinTimeInBallotBoxQueue: number;
    AvgTimeAtBallotBox: number;
    MinTimeInExitQueue: number;
}