import { Dayjs } from "dayjs";

export class TimeLineEntry {
    constructor(
        public Time: Dayjs,
        public TotalInBuilding: number,
        public BuildingQueueLength: number
    ) {}
}