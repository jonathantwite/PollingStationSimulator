import { Queue } from "queue-typescript";
import { Person } from "../models/Person";
import { Time } from "../models/Time";
import { SimulatorOptions } from "../types/SimulatorOptions";
import { deepCopyPerson } from "../../helpers/modelHelpers/PeopleHelpers";
import { SimulationSnapshot } from "../models/SimulationSnapshot";
import { StationLocation } from "../types/StationLocation";

type AllQueues = {
  BuildingQueue: Queue<Person>,
  RegisterDeskQueue: Queue<Person>,
  RegisterDesk: Queue<Person>,
  VotingBoothQueue: Queue<Person>,
  VotingBooth: Queue<Person>,
  BallotBoxQueue: Queue<Person>,
  BallotBox: Queue<Person>,
  ExitQueue: Queue<Person>,
  Voted: Queue<Person>,
};

function runSimulation(options: SimulatorOptions) {
    console.log("GO");
    const simulation: SimulationSnapshot[] = [];
    let currentTime = options.OpeningTime;
    
    const AllQueues: AllQueues = {
      BuildingQueue: new Queue<Person>(),
      RegisterDeskQueue: new Queue<Person>(),
      RegisterDesk: new Queue<Person>(),
      VotingBoothQueue: new Queue<Person>(),
      VotingBooth: new Queue<Person>(),
      BallotBoxQueue: new Queue<Person>(),
      BallotBox: new Queue<Person>(),
      ExitQueue: new Queue<Person>(),
      Voted: new Queue<Person>()
    }

    //this.simulationFinished.set(false);
    //this.simulationRunning.set(true);
    
    let count = 0;

    while (
      ++count < 24*60*60 &&
      (currentTime.isLessThan(options.ClosingTime)
      || AllQueues.RegisterDeskQueue.length > 0
      || AllQueues.RegisterDesk.length > 0
      || AllQueues.VotingBoothQueue.length > 0
      || AllQueues.VotingBooth.length > 0
      || AllQueues.BallotBoxQueue.length > 0
      || AllQueues.BallotBox.length > 0
      || AllQueues.ExitQueue.length > 0)){
        
      //const previousSnapshot = this.simulation().length > 0 ? this.simulation()[this.simulation().length - 1] : undefined;

      //currentProgressTime.set(Time.fromTime(currentTime));
      processTimePoint(Time.fromTime(currentTime), AllQueues, options);
        
      const currentSnapshot = new SimulationSnapshot(
        Time.fromTime(currentTime),
        new Queue<Person>(...deepCopyPerson(AllQueues.BuildingQueue.toArray())),
        new Queue<Person>(...deepCopyPerson(AllQueues.RegisterDeskQueue.toArray())),
        new Queue<Person>(...deepCopyPerson(AllQueues.RegisterDesk.toArray())),
        new Queue<Person>(...deepCopyPerson(AllQueues.VotingBoothQueue.toArray())),
        new Queue<Person>(...deepCopyPerson(AllQueues.VotingBooth.toArray())),
        new Queue<Person>(...deepCopyPerson(AllQueues.BallotBoxQueue.toArray())),
        new Queue<Person>(...deepCopyPerson(AllQueues.BallotBox.toArray())),
        new Queue<Person>(...deepCopyPerson(AllQueues.ExitQueue.toArray())),
        new Queue<Person>(...deepCopyPerson(AllQueues.Voted.toArray())),
        options);
          
      simulation.push(currentSnapshot);
        
      currentTime = getNextTimePoint(currentTime);
    }
    //simulationRunning.set(false);
    //simulationFinished.set(true);

  }

  function getNextTimePoint(
    currentTime: Time
  ){
    //TODO - something clever to ignore time when nothing happens - or don't save snapshot if nothing happens
    return currentTime.add(20, 'Seconds');

    //const nextMin = currentTime.second(0).add(1, 'minute');
    //
    //const allPeopleWithNextTime: PersonWithNextTime[] = [
    //  ...this.RegisterDeskQueue.toArray().map(p => { const pn = p as PersonWithNextTime; pn.NextTime = pn.TimeEnteredRegisterDeskQueue?.add(this.options.MinTimeInRegisterDeskQueue, 'second'); return pn}),
    //  ...this.RegisterDesk.toArray().map(p => { const pn = p as PersonWithNextTime; pn.NextTime = pn.TimeFinishedRegisterDeskQueue?.add(this.options.AvgTimeAtRegisterDesk, 'second'); return pn})
    //]
//
    //const nextPersonEvent = allPeopleWithNextTime.sort((a, b) => dayjs.min(a.NextTime as Dayjs, b.NextTime as Dayjs) === a.NextTime ? -1 : 1)[0]?.NextTime ?? dayjs(new Date(2099,12,31,23,59,59));
//
    //dayjs.extend(minMax);
    //return dayjs.min(nextMin, nextPersonEvent);
  }

  function processTimePoint(time: Time, AllQueues:AllQueues, options: SimulatorOptions){
    if(time.seconds === 0 && (time.minutes % 1) === 0 && time.isLessThan(options.ClosingTime)){
    //if(time.second() === 0 && time.minute() === 0 && time.hour() === 7){
        const p = new Person();
        p.CurrentLocation = 'Arriving';
        p.TimeArrived = time;
        AllQueues.BuildingQueue.enqueue(p);
    }

    processQueue(AllQueues, AllQueues.ExitQueue, AllQueues.Voted, 'Exited', time, (p, t) => p.TimeExited = t, options);
    processQueue(AllQueues, AllQueues.BallotBox, AllQueues.ExitQueue, 'ExitQueue', time, (p, t) => p.TimeFinishedBallotBox = t, options);
    processQueue(AllQueues, AllQueues.BallotBoxQueue, AllQueues.BallotBox, 'BallotBox', time, (p, t) => p.TimeFinishedBallotBoxQueue = t, options);
    processQueue(AllQueues, AllQueues.VotingBooth, AllQueues.BallotBoxQueue, 'BallotBoxQueue', time, (p, t) => p.TimeFinishedVotingBooth = t, options);
    processQueue(AllQueues, AllQueues.VotingBoothQueue, AllQueues.VotingBooth, 'VotingBooth', time, (p, t) => p.TimeFinishedVotingBoothQueue = t, options);
    processQueue(AllQueues, AllQueues.RegisterDesk, AllQueues.VotingBoothQueue, 'VotingBoothQueue', time, (p, t) => p.TimeFinishedRegisterDesk = t, options);
    processQueue(AllQueues, AllQueues.RegisterDeskQueue, AllQueues.RegisterDesk, 'RegisterDesk', time, (p, t) => p.TimeFinishedRegisterDeskQueue = t, options);
    processQueue(AllQueues, AllQueues.BuildingQueue, AllQueues.RegisterDeskQueue, 'RegisterDeskQueue', time, (p, t) => p.TimeEnteredRegisterDeskQueue = t, options);
  }

  function processQueue(AllQueues: AllQueues, currentLocationQueue: Queue<Person>, nextLocationQueue: Queue<Person>, nextLocation: StationLocation, currentTime: Time, updateTimeFunc: (person: Person, time: Time) => void, options: SimulatorOptions){
    if(currentLocationQueue.length === 0){
      return;
    }
    
    var nextPerson = currentLocationQueue.front;
    if(nextPerson && canPersonMove(nextPerson, Time.fromTime(currentTime), AllQueues, options)){
      const person = currentLocationQueue.dequeue();
      updateTimeFunc(person, Time.fromTime(currentTime));
      person.CurrentLocation = nextLocation;
      nextLocationQueue.enqueue(person);
    }
  }

  //TODO - currently all people move at same speed.  Need to generate random actual time each one spends at each location
  function canPersonMove(person: Person, currentTime: Time, AllQueues: AllQueues, options: SimulatorOptions){
    const totalInBuilding = AllQueues.RegisterDeskQueue.length + AllQueues.RegisterDesk.length + AllQueues.VotingBoothQueue.length + AllQueues.VotingBooth.length + AllQueues.BallotBoxQueue.length + AllQueues.BallotBox.length + AllQueues.ExitQueue.length;
    switch(person.CurrentLocation){
      case 'Arriving':          return totalInBuilding < options.MaxInBuilding && canPersonMoveVals(AllQueues.RegisterDeskQueue.length,options.MaxQueueRegisterDesk, currentTime, currentTime, 0);
      case 'RegisterDeskQueue': return canPersonMoveVals(AllQueues.RegisterDesk.length, options.NumberOfRegisterDesks, person.TimeEnteredRegisterDeskQueue, currentTime, options.MinTimeInRegisterDeskQueue);
      case 'RegisterDesk':      return canPersonMoveVals(AllQueues.VotingBoothQueue.length, options.MaxQueueVotingBooth, person.TimeFinishedRegisterDeskQueue, currentTime, options.AvgTimeAtRegisterDesk);
      case 'VotingBoothQueue':  return canPersonMoveVals(AllQueues.VotingBooth.length, options.NumberOfVotingBooths, person.TimeFinishedRegisterDesk, currentTime, options.MinTimeInVotingBoothQueue);
      case 'VotingBooth':       return canPersonMoveVals(AllQueues.BallotBoxQueue.length, options.MaxQueueBallotBox, person.TimeFinishedVotingBoothQueue, currentTime, options.AvgTimeAtVotingBooth);
      case 'BallotBoxQueue':    return canPersonMoveVals(AllQueues.BallotBox.length, options.NumberOfBallotBoxes, person.TimeFinishedVotingBooth, currentTime, options.MinTimeInBallotBoxQueue);
      case 'BallotBox':         return canPersonMoveVals(AllQueues.ExitQueue.length, options.MaxInBuilding, person.TimeFinishedBallotBoxQueue, currentTime, options.AvgTimeAtBallotBox);
      case 'ExitQueue':         return canPersonMoveVals(0, 1, person.TimeFinishedBallotBox, currentTime, options.MinTimeInExitQueue);
      case 'Exited': return false;
    }
  }

  function canPersonMoveVals(
    nextLocationCurrentSize: number, 
    nextLocationMaxSize: number, 
    timeFinishedPreviousLocation: Time | undefined, 
    currentTime: Time, 
    minimumSecondsToCompleteCurrentLocation: number) {
    
      return (
        nextLocationCurrentSize < nextLocationMaxSize
        && timeFinishedPreviousLocation != undefined
        && (Time.fromTime(timeFinishedPreviousLocation).add(minimumSecondsToCompleteCurrentLocation, 'Seconds')).isLessThanOrEqualTo(currentTime));
  }

export {runSimulation};