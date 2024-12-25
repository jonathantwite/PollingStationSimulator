export type TimeUnit = 'Hours' | 'Minutes' | 'Seconds';

export class Time {
    constructor(public hour: number, public minutes: number, public seconds: number){}

    add = (value: number | Time, unit?: TimeUnit) => {
        if(unit){
            switch(unit){
                case 'Hours': this.hour += (value as number); break;
                case 'Minutes': this.addMinutes(value as number); break;
                case 'Seconds': this.addSeconds(value as number); break;
            }
        }
        else if(value instanceof Time){
            this.hour += value.hour;
            this.minutes += value.minutes;
            this.seconds += value.seconds;
        }
    };

    addMinutes = (value: number) => {
        this.minutes += value;
        while(this.minutes >= 60){
            this.hour++;
            this.minutes -= 60;
        }
    };

    addSeconds = (value: number) => {
        this.seconds += value;
        while(this.seconds >= 60){
            this.addMinutes(1);
            this.seconds -= 60;
        }
    };

    diff = (t2: Time, unit: TimeUnit) => {
        switch(unit) {
            case 'Hours': return Math.abs(t2.hour - this.hour);
            case 'Minutes': return Math.abs(t2.asMinutesFromMidnight() - this.asMinutesFromMidnight());
            case 'Seconds': return Math.abs(t2.asSecondsFromMidnight() - this.asSecondsFromMidnight());
        }
    };

    private asMinutesFromMidnight = () => (this.hour * 60) + this.minutes;
    private asSecondsFromMidnight = () => (this.hour * 3600) + (this.minutes * 60) + this.seconds;
}