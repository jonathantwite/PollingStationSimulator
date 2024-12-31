import { parse } from "flatted";
import { SimulatorOptions } from "../types/SimulatorOptions";
import { SimulationSnapshot } from "./SimulationSnapshot";
import { Time } from "./Time";
import { Queue } from "queue-typescript";
import { Person } from "./Person";

export class Simulation {
    constructor(public options: SimulatorOptions, public snapshots: SimulationSnapshot[]){}

    static fromJsonSnapshots = (options: SimulatorOptions, snapshotsJson: string) => {

        const parsedData = parse(snapshotsJson) as any[];
        
        const snapshots = parsedData.map(ss => new SimulationSnapshot(
            new Time(ss.CurrentTime.hour, ss.CurrentTime.minutes, ss.CurrentTime.seconds),
            new Queue<Person>(ss.BuildingQueue),
            new Queue<Person>(ss.RegisterDeskQueue),
            new Queue<Person>(ss.RegisterDesk),
            new Queue<Person>(ss.VotingBoothQueue),
            new Queue<Person>(ss.VotingBooth),
            new Queue<Person>(ss.BallotBoxQueue),
            new Queue<Person>(ss.BallotBox),
            new Queue<Person>(ss.ExitQueue),
            new Queue<Person>(ss.Voted),
            ss.options
          ));
        
        return new this (options, snapshots);
    }
}