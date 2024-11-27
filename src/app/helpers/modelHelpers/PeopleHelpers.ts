import dayjs from "dayjs";
import { Person } from "../../models/Person";

function deepCopyPerson(array: Person[]){
  const copy = JSON.parse(JSON.stringify(array)) as Person[];
  copy.forEach(p => {
    p.TimeArrived = p.TimeArrived ? dayjs(p.TimeArrived) : undefined;
    p.TimeEnteredRegisterDeskQueue = p.TimeEnteredRegisterDeskQueue ? dayjs(p.TimeEnteredRegisterDeskQueue) : undefined;
    p.TimeFinishedRegisterDeskQueue = p.TimeFinishedRegisterDeskQueue ? dayjs(p.TimeFinishedRegisterDeskQueue) : undefined;
    p.TimeFinishedRegisterDesk = p.TimeFinishedRegisterDesk ? dayjs(p.TimeFinishedRegisterDesk) : undefined;
    p.TimeFinishedVotingBoothQueue = p.TimeFinishedVotingBoothQueue ? dayjs(p.TimeFinishedVotingBoothQueue) : undefined;
    p.TimeFinishedVotingBooth = p.TimeFinishedVotingBooth ? dayjs(p.TimeFinishedVotingBooth) : undefined;
    p.TimeFinishedBallotBoxQueue = p.TimeFinishedBallotBoxQueue ? dayjs(p.TimeFinishedBallotBoxQueue) : undefined;
    p.TimeFinishedBallotBox = p.TimeFinishedBallotBox ? dayjs(p.TimeFinishedBallotBox) : undefined;
    p.TimeExited = p.TimeExited ? dayjs(p.TimeExited) : undefined;
  });

  return copy;
};

export {
    deepCopyPerson
};
