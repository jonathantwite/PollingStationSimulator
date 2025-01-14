import { Person } from "../simulator/models/Person";
import { SimulationSnapshot } from "../simulator/models/SimulationSnapshot";
import { Time } from "../simulator/models/Time";

export class SimulationSnapshotDto {

    public readonly CurrentTime: Time;
    public readonly BuildingQueue: Person[];
    public readonly RegisterDeskQueue: Person[];
    public readonly RegisterDesk: Person[];
    public readonly VotingBoothQueue: Person[];
    public readonly VotingBooth: Person[];
    public readonly BallotBoxQueue: Person[];
    public readonly BallotBox: Person[];
    public readonly ExitQueue: Person[];
    public readonly Voted: Person[];

    constructor(snapshot: SimulationSnapshot){
        this.CurrentTime = snapshot.CurrentTime;
        this.BuildingQueue = snapshot.BuildingQueue.toArray();
        this.RegisterDeskQueue = snapshot.RegisterDeskQueue.toArray();
        this.RegisterDesk = snapshot.RegisterDesk.toArray();
        this.VotingBoothQueue = snapshot.VotingBoothQueue.toArray();
        this.VotingBooth = snapshot.VotingBooth.toArray();
        this.BallotBoxQueue = snapshot.BallotBoxQueue.toArray();
        this.BallotBox = snapshot.BallotBox.toArray();
        this.ExitQueue = snapshot.ExitQueue.toArray();
        this.Voted = snapshot.Voted.toArray();
    }
}