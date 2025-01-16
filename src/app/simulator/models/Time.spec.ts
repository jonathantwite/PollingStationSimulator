import { Time, TimeUnit } from "./Time"

describe('Time', () => {
    describe('add', () => {
        [
            { initial: new Time(10, 25, 0), value: 15, unit: 'Seconds' as TimeUnit, expected: new Time(10, 25, 15) },
            { initial: new Time(10, 25, 0), value: 150, unit: 'Seconds' as TimeUnit, expected: new Time(10, 27, 30) },
            { initial: new Time(10, 59, 0), value: 60, unit: 'Seconds' as TimeUnit, expected: new Time(11, 0, 0) },
            { initial: new Time(10, 25, 0), value: 15, unit: 'Minutes' as TimeUnit, expected: new Time(10, 40, 0) },
            { initial: new Time(10, 55, 0), value: 15, unit: 'Minutes' as TimeUnit, expected: new Time(11, 10, 0) },
            { initial: new Time(10, 25, 0), value: 3, unit: 'Hour' as TimeUnit, expected: new Time(13, 25, 0) },
        ].forEach(({ initial, value, unit, expected }) => {
            initial.add(value, unit);
            expect(initial.hour).toBe(expected.hour);
            expect(initial.minutes).toBe(expected.minutes);
            expect(initial.seconds).toBe(expected.seconds);
        });
    });

    describe('diff', () => {
        [
            { t1: new Time(10, 0, 0), t2: new Time(14, 0, 0), unit: 'Hour' as TimeUnit, expected: 4},
            { t1: new Time(18, 0, 0), t2: new Time(14, 0, 0), unit: 'Hour' as TimeUnit, expected: 4},
            { t1: new Time(16, 0, 0), t2: new Time(14, 25, 0), unit: 'Hour' as TimeUnit, expected: 1},
            { t1: new Time(12, 0, 0), t2: new Time(14, 25, 0), unit: 'Hour' as TimeUnit, expected: 2},
            { t1: new Time(12, 0, 0), t2: new Time(12, 25, 0), unit: 'Minute' as TimeUnit, expected: 25},
            { t1: new Time(12, 25, 0), t2: new Time(12, 0, 0), unit: 'Minute' as TimeUnit, expected: 25},
            { t1: new Time(12, 0, 0), t2: new Time(12, 25, 15), unit: 'Minute' as TimeUnit, expected: 25},
            { t1: new Time(12, 25, 15), t2: new Time(12, 0, 0), unit: 'Minute' as TimeUnit, expected: 25},
            { t1: new Time(12, 0, 15), t2: new Time(12, 25, 0), unit: 'Minute' as TimeUnit, expected: 24},
            { t1: new Time(12, 25, 0), t2: new Time(12, 0, 15), unit: 'Minute' as TimeUnit, expected: 24},
            { t1: new Time(12, 25, 0), t2: new Time(13, 10, 0), unit: 'Minute' as TimeUnit, expected: 45},
            { t1: new Time(13, 10, 0), t2: new Time(12, 25, 0), unit: 'Minute' as TimeUnit, expected: 45},
            { t1: new Time(13, 50, 10), t2: new Time(14, 55, 5), unit: 'Second' as TimeUnit, expected: 3895},
            { t1: new Time(14, 55, 5), t2: new Time(13, 50, 10), unit: 'Second' as TimeUnit, expected: 3895},
        ].forEach(({ t1, t2, unit, expected }) => {
            expect(t1.diff(t2, unit)).toBe(expected);
        });
    });
});
