import { Queue } from "queue-typescript";
import { Person } from "./Person";
import { Dayjs } from "dayjs";
import { SimulatorOptions } from "../types/SimulatorOptions";

export class SimulationSnapshot {
  constructor(
    public CurrentTime: Dayjs,
    public BuildingQueue: Queue<Person>,
    public RegisterDeskQueue: Queue<Person>,
    public RegisterDesk: Queue<Person>,
    public VotingBoothQueue: Queue<Person>,
    public VotingBooth: Queue<Person>,
    public BallotBoxQueue: Queue<Person>,
    public BallotBox: Queue<Person>,
    public ExitQueue: Queue<Person>,
    public Voted: Queue<Person>,
    private options: SimulatorOptions) {}
  
  totalInBuilding = () => this.RegisterDeskQueue.length + this.RegisterDesk.length + this.VotingBoothQueue.length + this.VotingBooth.length + this.BallotBoxQueue.length + this.BallotBox.length + this.ExitQueue.length;
}
