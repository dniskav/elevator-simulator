import _ from 'lodash';
import config from './config';
import { insertLog } from './ui';

const {
  messages: {
    nextFloors, closingDoors, waitingMs, arrived, moving,
  },
  times: { openCloseDoors, waiting },
} = config;

export function moveElevator() {
  const elevatorId = this.elevator;
  const elevator = document.querySelectorAll(`[data-elevator="${elevatorId}"]`)[0];
  const position = this.floorParameters[this.next];
  elevator.style.bottom = `${position}px`;
}

function removeLog(elevator) {
  const logContainer = document.querySelector(`.log-${elevator} ul`);
  logContainer.innerHTML = '';
}

export function runElevator() {
  this.selectNextFloor();
  const { next, elevator } = this;
  if (next) {
    insertLog(`${nextFloors} ${next}`, elevator);
    insertLog(`${waitingMs}`, elevator);
    setTimeout(() => {
      insertLog(`${closingDoors}`, elevator);
      setTimeout(() => {
        moveElevator.call(this);
        insertLog('Moving...', elevator);
        setTimeout(() => {
          removeLog(elevator);
          runElevator.call(this);
        }, 4000);
      }, openCloseDoors);
    }, waiting);
  }
}

export function selectElevator(floorCall, elevators, floors) {
  const stoppedElevators = {};
  for (const key in elevators) {
    if (elevators[key].dir === 0) {
      stoppedElevators[key] = elevators[key];
    }
  }
  elevators = (_.isEmpty(stoppedElevators)) ? elevators : stoppedElevators;

  const dirCall = floorCall.dir;
  let closestElevator;
  let distance = 0;

  _.forEach(elevators, (elevator, key) => {
    const elevatorFloor = elevator.floor;
    const { dir } = elevator;
    const id = key;

    if (dirCall === 2) {
      // Called to Go up
      if (dir === 1) {
        distance = (floorCall.floor - 1) + (elevatorFloor - 1);
      } else if (dir === 2) {
        if (elevatorFloor < floorCall.floor) {
          distance = floorCall.floor - elevatorFloor;
        } else {
          distance = floors - elevatorFloor - 1 + floors + floorCall.floor - 1;
        }
      }
    } else if (dirCall === 1) {
      if (dir === 2) { // Elevator going Up
        distance = (floors - elevatorFloor) + (floors - floorCall.floor);
      } else if (dir === 1) { // Elevator going Down
        if (elevatorFloor > floorCall.floor) {
          distance = elevatorFloor - floorCall.floor;
        } else {
          distance = floors - 1 + floorCall.floor - 1 + elevatorFloor - 1;
        }
      }
    }

    if (dir === 0 && (dirCall === 1 || dirCall === 2)) {
      if (floorCall.floor > elevatorFloor) {
        distance = floorCall.floor - elevatorFloor;
      } else {
        distance = floorCall.floor - elevatorFloor;
      }
    }

    const tempElevator = { id, distance };
    if (_.isEmpty(closestElevator)) {
      closestElevator = tempElevator;
    } else {
      closestElevator = closestElevator.distance > distance ? tempElevator : closestElevator;
    }
  });
  return closestElevator.id;
}

export function asignFloorToElevator(params) {
  const { floor, dir } = params;
  const isTheFloorAlready = this.queue[dir].find(el => el === floor);
  if (!isTheFloorAlready) {
    this.queue[dir].push(floor);
    this.queue[1].sort((a, b) => b - a);
    this.queue[2].sort((a, b) => a - b);
  }
}

export function selectNextFloor() {
  let next;
  const { dir, floor } = this;
  const queueUp = this.queue[2];
  const queueDown = this.queue[1];
  if (dir === 0) {
    if (queueUp.length && !queueDown.length) {
      [next] = queueUp;
    } else if (!queueUp.length && queueDown.length) {
      [next] = queueDown;
    } else {
      const options = [queueUp[0], queueDown[0]];
      next = options.reduce((a, b) => (Math.abs(floor - a) < Math.abs(floor - b) ? a : b));
    }
  } else if (dir === 2) {
    if (queueUp.length) {
      const higherFloor = queueUp.find(el => el > floor);
      if (higherFloor) {
        next = higherFloor;
      } else if (!higherFloor && queueDown.length) {
        [next] = queueDown;
      } else {
        [next] = queueUp;
      }
    } else if (queueDown.length) {
      [next] = queueDown;
    }
  } else if (queueDown.length) {
    const lowerFloor = queueDown.find(el => el < floor);
    if (lowerFloor) {
      next = lowerFloor;
    } else if (!lowerFloor && queueUp.length) {
      [next] = queueUp;
    } else {
      [next] = queueDown;
    }
  } else if (queueUp.length) {
    [next] = queueUp;
  }
  this.next = next;
  if (!next) {
    this.dir = 0;
  } else {
    this.dir = floor > next ? 1 : 2;
  }
}
