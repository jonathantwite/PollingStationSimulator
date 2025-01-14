import { SimulatorOptions } from "../types/SimulatorOptions";
import { SimulationSnapshot } from "./SimulationSnapshot";
import { Time } from "./Time";
import { Queue } from "queue-typescript";
import { Person } from "./Person";
import { SimulationDto } from "../../web-worker/SimulationDto";
import { SimulationSnapshotDto } from "../../web-worker/SimulationSnapshotDto";

export class Simulation {
    constructor(public options: SimulatorOptions, public snapshots: SimulationSnapshot[]){}

    static fromDto = (simulation: SimulationDto) => {

        const options = simulation.options as SimulatorOptions;
        const snapshotDtos = simulation.snapshots as SimulationSnapshotDto[]
        console.log(snapshotDtos);
        
        const snapshots = snapshotDtos.map(ss => new SimulationSnapshot(
            new Time(ss.CurrentTime.hour, ss.CurrentTime.minutes, ss.CurrentTime.seconds),
            new Queue<Person>(...ss.BuildingQueue.map(p => Person.fromObject(p))),
            new Queue<Person>(...ss.RegisterDeskQueue.map(p => Person.fromObject(p))),
            new Queue<Person>(...ss.RegisterDesk.map(p => Person.fromObject(p))),
            new Queue<Person>(...ss.VotingBoothQueue.map(p => Person.fromObject(p))),
            new Queue<Person>(...ss.VotingBooth.map(p => Person.fromObject(p))),
            new Queue<Person>(...ss.BallotBoxQueue.map(p => Person.fromObject(p))),
            new Queue<Person>(...ss.BallotBox.map(p => Person.fromObject(p))),
            new Queue<Person>(...ss.ExitQueue.map(p => Person.fromObject(p))),
            new Queue<Person>(...ss.Voted.map(p => Person.fromObject(p))),
            options
          ));
        
        return new this (options, snapshots);
    }
}