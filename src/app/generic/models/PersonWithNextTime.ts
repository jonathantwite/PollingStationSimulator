import { Dayjs } from "dayjs";
import { Person } from "./Person";

export class PersonWithNextTime extends Person {
    NextTime?:Dayjs;
}