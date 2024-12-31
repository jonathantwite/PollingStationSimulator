import { Person } from "../../generic/models/Person";
import { Time } from "../../generic/models/Time";

function deepCopyPerson(array: Person[]){
  const copy = JSON.parse(JSON.stringify(array)) as Person[];
  return copy.map(p => {
    const pCopy = new Person();
    pCopy.CurrentLocation = p.CurrentLocation
    pCopy.TimeArrived = p.TimeArrived ? Time.fromTime(p.TimeArrived) : undefined;
    pCopy.TimeEnteredRegisterDeskQueue = p.TimeEnteredRegisterDeskQueue ? Time.fromTime(p.TimeEnteredRegisterDeskQueue) : undefined;
    pCopy.TimeFinishedRegisterDeskQueue = p.TimeFinishedRegisterDeskQueue ? Time.fromTime(p.TimeFinishedRegisterDeskQueue) : undefined;
    pCopy.TimeFinishedRegisterDesk = p.TimeFinishedRegisterDesk ? Time.fromTime(p.TimeFinishedRegisterDesk) : undefined;
    pCopy.TimeFinishedVotingBoothQueue = p.TimeFinishedVotingBoothQueue ? Time.fromTime(p.TimeFinishedVotingBoothQueue) : undefined;
    pCopy.TimeFinishedVotingBooth = p.TimeFinishedVotingBooth ? Time.fromTime(p.TimeFinishedVotingBooth) : undefined;
    pCopy.TimeFinishedBallotBoxQueue = p.TimeFinishedBallotBoxQueue ? Time.fromTime(p.TimeFinishedBallotBoxQueue) : undefined;
    pCopy.TimeFinishedBallotBox = p.TimeFinishedBallotBox ? Time.fromTime(p.TimeFinishedBallotBox) : undefined;
    pCopy.TimeExited = p.TimeExited ? Time.fromTime(p.TimeExited) : undefined;

    return pCopy;
  });
};

export {
    deepCopyPerson
};
