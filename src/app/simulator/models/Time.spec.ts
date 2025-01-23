import { Time, TimeUnit } from "./Time"

describe('Time', () => {
    describe('add', () => {
        const testCases: { initial: Time, value: number, unit: TimeUnit, expected: Time }[] = [
            { initial: new Time(10, 25, 0), value: 15, unit: 'Seconds', expected: new Time(10, 25, 15) },
            { initial: new Time(10, 25, 0), value: 150, unit: 'Seconds', expected: new Time(10, 27, 30) },
            { initial: new Time(10, 59, 0), value: 60, unit: 'Seconds', expected: new Time(11, 0, 0) },
            { initial: new Time(10, 25, 0), value: 15, unit: 'Minutes', expected: new Time(10, 40, 0) },
            { initial: new Time(10, 55, 0), value: 15, unit: 'Minutes', expected: new Time(11, 10, 0) },
            { initial: new Time(10, 25, 0), value: 3, unit: 'Hours', expected: new Time(13, 25, 0) },
        ] ;
        testCases.forEach(({ initial, value, unit, expected }) => {
            it(`Adds ${value} ${unit} to ${initial.displays()} correctly`, () => {
                initial.add(value, unit);
                expect(initial.hour).toBe(expected.hour);
                expect(initial.minutes).toBe(expected.minutes);
                expect(initial.seconds).toBe(expected.seconds);
            });
        });
    });

    describe('diff', () => {
        const testCases: {t1: Time, t2: Time, unit: TimeUnit, expected: number}[] = [
            { t1: new Time(10, 0, 0), t2: new Time(14, 0, 0), unit: 'Hours', expected: 4},
            { t1: new Time(18, 0, 0), t2: new Time(14, 0, 0), unit: 'Hours', expected: 4},
            { t1: new Time(16, 0, 0), t2: new Time(14, 25, 0), unit: 'Hours', expected: 1},
            { t1: new Time(12, 0, 0), t2: new Time(14, 25, 0), unit: 'Hours', expected: 2},
            { t1: new Time(12, 0, 0), t2: new Time(12, 0, 0), unit: 'Hours', expected: 0},
            { t1: new Time(12, 0, 0), t2: new Time(12, 25, 0), unit: 'Hours', expected: 0},
            { t1: new Time(12, 0, 0), t2: new Time(12, 25, 0), unit: 'Minutes', expected: 25},
            { t1: new Time(12, 25, 0), t2: new Time(12, 0, 0), unit: 'Minutes', expected: 25},
            { t1: new Time(12, 0, 0), t2: new Time(12, 25, 15), unit: 'Minutes', expected: 25},
            { t1: new Time(12, 25, 15), t2: new Time(12, 0, 0), unit: 'Minutes', expected: 25},
            { t1: new Time(12, 0, 15), t2: new Time(12, 25, 0), unit: 'Minutes', expected: 24},
            { t1: new Time(12, 25, 0), t2: new Time(12, 0, 15), unit: 'Minutes', expected: 24},
            { t1: new Time(12, 25, 0), t2: new Time(13, 10, 0), unit: 'Minutes', expected: 45},
            { t1: new Time(13, 10, 0), t2: new Time(12, 25, 0), unit: 'Minutes', expected: 45},
            { t1: new Time(13, 10, 0), t2: new Time(13, 10, 0), unit: 'Minutes', expected: 0},
            { t1: new Time(13, 50, 10), t2: new Time(14, 55, 5), unit: 'Seconds', expected: 3895},
            { t1: new Time(14, 55, 5), t2: new Time(13, 50, 10), unit: 'Seconds', expected: 3895},
            { t1: new Time(14, 55, 5), t2: new Time(14, 55, 5), unit: 'Seconds', expected: 0},
        ];
        testCases.forEach(({ t1, t2, unit, expected }) => {
            it(`diff between ${t1.displays()} and ${t2.displays()} in ${unit} is correct`, () => {
                expect(t1.diff(t2, unit)).toBe(expected);
            });
        });
    });

    describe('isLessThan', () => {
        const testCases: { t1: Time, t2: Time, expected: boolean}[] = [
            { t1: new Time(10, 0, 0), t2: new Time(14, 0, 0), expected: true},
            { t1: new Time(14, 0, 0), t2: new Time(10, 0, 0), expected: false},
            { t1: new Time(10, 20, 0), t2: new Time(10, 30, 0), expected: true},
            { t1: new Time(10, 31, 0), t2: new Time(10, 30, 0), expected: false},
            { t1: new Time(10, 31, 10), t2: new Time(10, 31, 19), expected: true},
            { t1: new Time(10, 31, 11), t2: new Time(10, 31, 10), expected: false},
            { t1: new Time(10, 31, 11), t2: new Time(10, 32, 10), expected: true},
            { t1: new Time(10, 32, 10), t2: new Time(10, 31, 11), expected: false},
            { t1: new Time(10, 32, 15), t2: new Time(10, 32, 15), expected: false},
        ];
        testCases.forEach(({ t1, t2, expected}) => {
            it(`isLessThan ${t1.displays()} and ${t2.displays()} is correct`, () => {
                expect(t1.isLessThan(t2)).toBe(expected);
            });
        });
    });
});
