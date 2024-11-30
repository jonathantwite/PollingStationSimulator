/// <reference lib="webworker" />

import { runSimulation } from "./services/runSimulation";
import { SimulatorOptions } from "./types/SimulatorOptions";

addEventListener('message', ({ data }: {data: SimulatorOptions}) => {
  console.log(data);
  const simulation = runSimulation(data);
  postMessage(simulation);
});
