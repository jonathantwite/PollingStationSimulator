import { Queue } from "queue-typescript";
import { Person } from "./Person";
import { Dayjs } from "dayjs";
import { StationLocation } from "../types/StationLocation";
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
  
  
  processTimePoint(time: Dayjs){
    if(time.second() === 0 && time < this.options.ClosingTime){
        this.BuildingQueue.enqueue(new Person());
    }

    console.log("Processing: ", time.format("HH:mm"));
    this.#processQueue(this.ExitQueue, this.Voted, 'Exited', time, p => p.TimeExited = time);
    this.#processQueue(this.BallotBox, this.ExitQueue, 'ExitQueue', time, p => p.TimeFinishedBallotBox = time);
    this.#processQueue(this.BallotBoxQueue, this.BallotBox, 'BallotBox', time, p => p.TimeFinishedBallotBoxQueue = time);
    this.#processQueue(this.VotingBooth, this.BallotBoxQueue, 'BallotBoxQueue', time, p => p.TimeFinishedVotingBooth = time);
    this.#processQueue(this.VotingBoothQueue, this.VotingBooth, 'VotingBooth', time, p => p.TimeFinishedVotingBoothQueue = time);
    this.#processQueue(this.RegisterDesk, this.VotingBoothQueue, 'VotingBoothQueue', time, p => p.TimeFinishedRegisterDesk = time);
    this.#processQueue(this.RegisterDeskQueue, this.RegisterDesk, 'RegisterDesk', time, p => p.TimeFinishedRegisterDeskQueue = time);
    this.#processQueue(this.BuildingQueue, this.RegisterDeskQueue, 'RegisterDeskQueue', time, p => p.TimeEnteredRegisterDeskQueue = time);
  }

  #processQueue(currentLocationQueue: Queue<Person>, nextLocationQueue: Queue<Person>, nextLocation: StationLocation, currentTime: Dayjs, updateTimeFunc: (person: Person) => void){
    if(currentLocationQueue.length === 0){
      return;
    }
    
    var nextPerson = currentLocationQueue.front;
    if(nextPerson && this.canPersonMove(nextPerson, currentTime)){
      var person = currentLocationQueue.dequeue();
      updateTimeFunc(person);
      person.CurrentLocation = nextLocation;
      nextLocationQueue.enqueue(person);
    }
  }

  //TODO - currently all people move at same speed.  Need to generate random actual time each one spends at each location
  canPersonMove(person: Person, currentTime: Dayjs){
    switch(person.CurrentLocation){
      case 'Arriving':          return this.totalInBuilding() < this.options.MaxInBuilding && this.#canPersonMove(this.RegisterDeskQueue.length,this.options.MaxQueueRegisterDesk, currentTime, currentTime, 0);
      case 'RegisterDeskQueue': return this.#canPersonMove(this.RegisterDesk.length, this.options.NumberOfRegisterDesks, person.TimeEnteredRegisterDeskQueue, currentTime, this.options.MinTimeInRegisterDeskQueue);
      case 'RegisterDesk':      return this.#canPersonMove(this.VotingBoothQueue.length, this.options.MaxQueueVotingBooth, person.TimeFinishedRegisterDeskQueue, currentTime, this.options.AvgTimeAtRegisterDesk);
      case 'VotingBoothQueue':  return this.#canPersonMove(this.VotingBooth.length, this.options.NumberOfVotingBooths, person.TimeFinishedRegisterDesk, currentTime, this.options.MinTimeInVotingBoothQueue);
      case 'VotingBooth':       return this.#canPersonMove(this.BallotBoxQueue.length, this.options.MaxQueueBallotBox, person.TimeFinishedVotingBoothQueue, currentTime, this.options.AvgTimeAtVotingBooth);
      case 'BallotBoxQueue':    return this.#canPersonMove(this.BallotBox.length, this.options.NumberOfBallotBoxes, person.TimeFinishedVotingBooth, currentTime, this.options.MinTimeInBallotBoxQueue);
      case 'BallotBox':         return this.#canPersonMove(this.ExitQueue.length, this.options.MaxInBuilding, person.TimeFinishedBallotBoxQueue, currentTime, this.options.AvgTimeAtBallotBox);
      case 'ExitQueue':         return this.#canPersonMove(0, 1, person.TimeFinishedBallotBox, currentTime, this.options.MinTimeInExitQueue);
      case 'Exited': return false;
    }
  }

  totalInBuilding = () => this.RegisterDeskQueue.length + this.VotingBoothQueue.length + this.BallotBoxQueue.length + this.ExitQueue.length;

  #canPersonMove(
    nextLocationCurrentSize: number, 
    nextLocationMaxSize: number, 
    timeFinishedPreviousLocation: Dayjs | undefined, 
    currentTime: Dayjs, 
    minimumSecondsToCompleteCurrentLocation: number) {
    
      return (
        nextLocationCurrentSize < nextLocationMaxSize
        && timeFinishedPreviousLocation != undefined
        && (timeFinishedPreviousLocation?.add(minimumSecondsToCompleteCurrentLocation, 'second') ?? currentTime.add(1, 'minute')) <= currentTime);
  }
}
