import { Time } from "../models/Time";
import { VisitProfile } from "./VisitProfile";

export type SimulatorOptions = {
    VisitProfile: VisitProfile;
    TotalElectorate: number;
    Turnout: number
    OpeningTime: Time;
    ClosingTime: Time;

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