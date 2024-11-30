import { Queue } from "queue-typescript";
import { Person } from "../models/Person";
import { SimulatorOptions } from "../types/SimulatorOptions";
import { SimulationSnapshot } from "../models/SimulationSnapshot";
import { deepCopyPerson } from "../helpers/modelHelpers/PeopleHelpers";
import dayjs, { Dayjs } from "dayjs";
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
    console.log("GO")
    const simulation: SimulationSnapshot[] = [];
    //simulation.set([]);
    let currentTime = dayjs(options.OpeningTime);
    
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

    //simulationFinished.set(false);
    //simulationRunning.set(true);
    
    let count = 0;
console.log(count);
console.log(currentTime);
console.log(currentTime.format('HH:mm:ss'));
console.log(options.ClosingTime);
console.log(options.ClosingTime.format('HH:mm:ss'));
console.log(AllQueues);

if(++count < 24*60*60 &&
    (currentTime < options.ClosingTime
    || AllQueues.RegisterDeskQueue.length > 0
    || AllQueues.RegisterDesk.length > 0
    || AllQueues.VotingBoothQueue.length > 0
    || AllQueues.VotingBooth.length > 0
    || AllQueues.BallotBoxQueue.length > 0
    || AllQueues.BallotBox.length > 0
    || AllQueues.ExitQueue.length > 0)){
        console.log("OK");
    }

    while (
      ++count < 24*60*60 &&
      (currentTime < options.ClosingTime
      || AllQueues.RegisterDeskQueue.length > 0
      || AllQueues.RegisterDesk.length > 0
      || AllQueues.VotingBoothQueue.length > 0
      || AllQueues.VotingBooth.length > 0
      || AllQueues.BallotBoxQueue.length > 0
      || AllQueues.BallotBox.length > 0
      || AllQueues.ExitQueue.length > 0)){
        
      //currentProgressTime.set(currentTime);
      processTimePoint(currentTime, AllQueues, options);
        
      const currentSnapshot = new SimulationSnapshot(
        currentTime,
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
    console.log(currentSnapshot)
        simulation.push(currentSnapshot);
        
      currentTime = getNextTimePoint(currentTime);
      console.log(currentTime);
    }
    //simulationRunning.set(false);
    //simulationFinished.set(true);

    return simulation;
  }

function getNextTimePoint(
    currentTime: Dayjs
  ){
    //TODO - something clever to ignore time when nothing happens - or don't save snapshot if nothing happens
    return currentTime.add(20, 'second');

    //const nextMin = currentTime.second(0).add(1, 'minute');
    //
    //const allPeopleWithNextTime: PersonWithNextTime[] = [
    //  ...RegisterDeskQueue.toArray().map(p => { const pn = p as PersonWithNextTime; pn.NextTime = pn.TimeEnteredRegisterDeskQueue?.add(options.MinTimeInRegisterDeskQueue, 'second'); return pn}),
    //  ...RegisterDesk.toArray().map(p => { const pn = p as PersonWithNextTime; pn.NextTime = pn.TimeFinishedRegisterDeskQueue?.add(options.AvgTimeAtRegisterDesk, 'second'); return pn})
    //]
//
    //const nextPersonEvent = allPeopleWithNextTime.sort((a, b) => dayjs.min(a.NextTime as Dayjs, b.NextTime as Dayjs) === a.NextTime ? -1 : 1)[0]?.NextTime ?? dayjs(new Date(2099,12,31,23,59,59));
//
    //dayjs.extend(minMax);
    //return dayjs.min(nextMin, nextPersonEvent);
  }

function processTimePoint(time: Dayjs, AllQueues:AllQueues, options: SimulatorOptions){
    if(time.second() === 0 && (time.minute() % 1) === 0 && time < options.ClosingTime){
    //if(time.second() === 0 && time.minute() === 0 && time.hour() === 7){
        const p = new Person();
        p.CurrentLocation = 'Arriving';
        p.TimeArrived = time;
        AllQueues.BuildingQueue.enqueue(p);
    }

    processQueue(AllQueues, options, AllQueues.ExitQueue, AllQueues.Voted, 'Exited', time, (p, t) => p.TimeExited = t);
    processQueue(AllQueues, options, AllQueues.BallotBox, AllQueues.ExitQueue, 'ExitQueue', time, (p, t) => p.TimeFinishedBallotBox = t);
    processQueue(AllQueues, options, AllQueues.BallotBoxQueue, AllQueues.BallotBox, 'BallotBox', time, (p, t) => p.TimeFinishedBallotBoxQueue = t);
    processQueue(AllQueues, options, AllQueues.VotingBooth, AllQueues.BallotBoxQueue, 'BallotBoxQueue', time, (p, t) => p.TimeFinishedVotingBooth = t);
    processQueue(AllQueues, options, AllQueues.VotingBoothQueue, AllQueues.VotingBooth, 'VotingBooth', time, (p, t) => p.TimeFinishedVotingBoothQueue = t);
    processQueue(AllQueues, options, AllQueues.RegisterDesk, AllQueues.VotingBoothQueue, 'VotingBoothQueue', time, (p, t) => p.TimeFinishedRegisterDesk = t);
    processQueue(AllQueues, options, AllQueues.RegisterDeskQueue, AllQueues.RegisterDesk, 'RegisterDesk', time, (p, t) => p.TimeFinishedRegisterDeskQueue = t);
    processQueue(AllQueues, options, AllQueues.BuildingQueue, AllQueues.RegisterDeskQueue, 'RegisterDeskQueue', time, (p, t) => p.TimeEnteredRegisterDeskQueue = t);
  }

function processQueue(AllQueues: AllQueues, options: SimulatorOptions, currentLocationQueue: Queue<Person>, nextLocationQueue: Queue<Person>, nextLocation: StationLocation, currentTime: Dayjs, updateTimeFunc: (person: Person, time: Dayjs) => void){
    if(currentLocationQueue.length === 0){
      return;
    }
    
    var nextPerson = currentLocationQueue.front;
    if(nextPerson && canPersonMove(nextPerson, currentTime, AllQueues, options)){
      const person = currentLocationQueue.dequeue();
      updateTimeFunc(person, currentTime);
      person.CurrentLocation = nextLocation;
      nextLocationQueue.enqueue(person);
    }
  }

  //TODO - currently all people move at same speed.  Need to generate random actual time each one spends at each location
function canPersonMove(person: Person, currentTime: Dayjs, AllQueues: AllQueues, options: SimulatorOptions){
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
    timeFinishedPreviousLocation: Dayjs | undefined, 
    currentTime: Dayjs, 
    minimumSecondsToCompleteCurrentLocation: number) {
    
      return (
        nextLocationCurrentSize < nextLocationMaxSize
        && timeFinishedPreviousLocation != undefined
        && (timeFinishedPreviousLocation?.add(minimumSecondsToCompleteCurrentLocation, 'second') ?? currentTime.add(1, 'minute')) <= currentTime);
  }

  export {runSimulation };