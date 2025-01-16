import { Time } from "./Time";

export class TimeLineEntry {
    constructor(
        public Time: Time,
        public TotalInBuilding: number,
        public BuildingQueueLength: number
    ) {}
}