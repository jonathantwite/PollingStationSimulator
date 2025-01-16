export type TimeUnit = 'Hours' | 'Minutes' | 'Seconds';

export class Time {
    constructor(public hour: number, public minutes: number, public seconds: number){}

    static fromTime(time: Time){
        const copy = JSON.parse(JSON.stringify(time)) as Time;
        return new this(copy.hour, copy.minutes, copy.seconds);
    }

    static parse(time: string){
        const timeSplit = time.split(':');
        return new this(
            parseInt(timeSplit[0]),
            parseInt(timeSplit[1]),
            timeSplit.length < 3 ? 0 : parseInt(timeSplit[2])
        );
    }

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
        return this;
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

    isLessThan = (t2: Time) => 
        t2.hour > this.hour
        || (t2.hour === this.hour && t2.minutes > this.minutes)
        || (t2.hour === this.hour && t2.minutes === this.minutes && t2.seconds > this.seconds);
    
    isLessThanOrEqualTo = (t2: Time) => 
        t2.hour > this.hour
        || (t2.hour === this.hour && t2.minutes > this.minutes)
        || (t2.hour === this.hour && t2.minutes === this.minutes && t2.seconds >= this.seconds);

    isGreaterThan = (t2: Time) => 
        t2.hour < this.hour
        || (t2.hour === this.hour && t2.minutes < this.minutes)
        || (t2.hour === this.hour && t2.minutes === this.minutes && t2.seconds < this.seconds);

    isGreaterThanOrEqualTo = (t2: Time) => 
        t2.hour < this.hour
        || (t2.hour === this.hour && t2.minutes < this.minutes)
        || (t2.hour === this.hour && t2.minutes === this.minutes && t2.seconds <= this.seconds);

    asJsDate = () => new Date(2024, 1, 1, this.hour, this.minutes, this.seconds);

    private displayHour = () => `${(this.hour < 10 ? '0' : '')}${this.hour}`;
    private displayMinutes = () => `${(this.minutes < 10 ? '0' : '')}${this.minutes}`;
    private displaySeconds = () => `${(this.seconds < 10 ? '0' : '')}${this.seconds}`;

    display = () => `${this.displayHour()}:${this.displayMinutes()}`;
    displays = () => `${this.display()}:${this.displaySeconds()}`;

    private asMinutesFromMidnight = () => (this.hour * 60) + this.minutes;
    private asSecondsFromMidnight = () => (this.hour * 3600) + (this.minutes * 60) + this.seconds;

    public static fromObject = (object: any) => {
        if(!object){
            return undefined
        }
        
        return new this (object.hour, object.minutes, object.seconds);
    }
}