import { Simulation } from "../simulator/models/Simulation";
import { SimulatorOptions } from "../simulator/types/SimulatorOptions";
import { SimulationSnapshotDto } from "./SimulationSnapshotDto";

export class SimulationDto{
    public readonly options: SimulatorOptions;
    public readonly snapshots: SimulationSnapshotDto[];

    constructor(simulation: Simulation){
        this.options = simulation.options;
        this.snapshots = simulation.snapshots.map(s => new SimulationSnapshotDto(s));
    }
}