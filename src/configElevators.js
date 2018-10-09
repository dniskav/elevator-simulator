import runElevator from './elevatorController';
import floorParameters from './floorParameters';

export default function configElevators(nElevators, nFloors) {
  const floorParams = floorParameters(nFloors);
  const engine = {
    floorParameters: floorParams,
    startEngine: runElevator,
  };
  const elevators = [];
  for (let i = 1; i <= nElevators; i++) {
    const elevator = Object.create(engine, {
      elevator: {
        value: i,
        writable: true,
        enumerable: true,
      },
      floor: {
        value: 1,
        writable: true,
        enumerable: true,
      },
      dir: {
        value: 0,
        writable: true,
        enumerable: true,
      },
      queue: {
        value: { 2: [], 1: [] },
        writable: true,
        enumerable: true,
      },
    });
    elevators.push(elevator);
  }
  return elevators;
}
