/// <reference lib="webworker" />
import { parse, stringify } from 'flatted';
import { Time } from './generic/models/Time';
import { runSimulation } from './generic/services/simulation-runner';
import { SimulatorOptions } from './generic/types/SimulatorOptions';

addEventListener('message', ({ data }) => {
  const options = parse(data) as SimulatorOptions;
  options.OpeningTime = new Time(options.OpeningTime.hour, options.OpeningTime.minutes, options.OpeningTime.seconds);
  options.ClosingTime = new Time(options.ClosingTime.hour, options.ClosingTime.minutes, options.ClosingTime.seconds);
  console.log(options);
  const response = runSimulation(options);
  postMessage(stringify(response));
});
