import dayjs from "dayjs";
import { Person } from "../../models/Person";

function deepCopyPerson(array: Person[]){
  const copy = JSON.parse(JSON.stringify(array)) as Person[];
  return copy.map(p => {
    const pCopy = new Person();
    pCopy.CurrentLocation = p.CurrentLocation
    pCopy.TimeArrived = p.TimeArrived ? dayjs(p.TimeArrived) : undefined;
    pCopy.TimeEnteredRegisterDeskQueue = p.TimeEnteredRegisterDeskQueue ? dayjs(p.TimeEnteredRegisterDeskQueue) : undefined;
    pCopy.TimeFinishedRegisterDeskQueue = p.TimeFinishedRegisterDeskQueue ? dayjs(p.TimeFinishedRegisterDeskQueue) : undefined;
    pCopy.TimeFinishedRegisterDesk = p.TimeFinishedRegisterDesk ? dayjs(p.TimeFinishedRegisterDesk) : undefined;
    pCopy.TimeFinishedVotingBoothQueue = p.TimeFinishedVotingBoothQueue ? dayjs(p.TimeFinishedVotingBoothQueue) : undefined;
    pCopy.TimeFinishedVotingBooth = p.TimeFinishedVotingBooth ? dayjs(p.TimeFinishedVotingBooth) : undefined;
    pCopy.TimeFinishedBallotBoxQueue = p.TimeFinishedBallotBoxQueue ? dayjs(p.TimeFinishedBallotBoxQueue) : undefined;
    pCopy.TimeFinishedBallotBox = p.TimeFinishedBallotBox ? dayjs(p.TimeFinishedBallotBox) : undefined;
    pCopy.TimeExited = p.TimeExited ? dayjs(p.TimeExited) : undefined;

    return pCopy;
  });
};

export {
    deepCopyPerson
};
