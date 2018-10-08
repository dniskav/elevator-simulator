import config from './config';

export function floorButton(floor, dir) {
  return `<button class="floor-button" data-dir="${dir}">Floor ${floor}</button>`;
}

export const elevatorUI = '<div></div>';

export const form = (
  `<section class="settings">
    <form class="initial-setting-form">
      <div class="form-group">
        <label>How many Floors</label>
        <div>
          <input id="floors" type="number" class="form-control" value="4" placeholder="Type a Number">
        </div>
      </div>
      <div class="form-group">
        <label>How many elevators</label>
        <div>
          <input id="elevators" type="number" class="form-control" value="1" placeholder="Type a Number">
        </div>
      </div>
      <div class="form-group button-cont">
        <button class="create-building">Build it!</button>
      </div>
    </form>
  </section>`
);

function createFloorNumbers(floors) {
  function createNumber(num) {
    return `<div class="number">${num}</div>`;
  }
  let floorsStructure = '';
  for (let i = floors; i >= 1; i--) {
    floorsStructure += createNumber(i);
  }
  return floorsStructure;
}

function createFloors(floors) {
  let floorDivider = '';
  for (let i = 2; i <= floors; i++) {
    floorDivider += '<div class="floor"></div>';
  }
  return floorDivider;
}

function createElevatorsStructure(elevators, floors) {
  let elevatorStructure = '';
  const elevatorLaneHeight = config.building.elevatorLaneHeight(floors);
  const { elevatorWidth, elevatorHeight } = config.building;
  for (let i = 1; i <= elevators; i++) {
    elevatorStructure += (
      `<div class="elevator-lane" style="height:${elevatorLaneHeight}px">
        <div class="elevator" data-elevator="${i}" style="width:${elevatorWidth}px; height:${elevatorHeight}px"></div>
      </div>`
    );
  }
  return elevatorStructure;
}

function insertControls(floor, floors) {
  const buttonUp = `<div class="floor-button up" data-dir="1"><span>${'>'}</span></div>`;
  const buttonDown = `<div class="floor-button down" data-dir="0"><span>${'>'}</span></div>`;

  if (floor === 1) {
    return buttonUp;
  }
  if (floor === floors) {
    return buttonDown;
  }
  return buttonUp + buttonDown;
}

function createFloorControl(floors) {
  let controls = '';
  for (let i = floors; i >= 1; i--) {
    controls += `<div class="control-floor">${insertControls(i, floors)}</div>`;
  }
  return controls;
}

export function buildingStructure(floors, elevators) {
  return (
    `<section class="building-area">
    <div class="building-container">
      <div class="floor-numbers">
        ${createFloorNumbers(floors)}
      </div>
      <div class="building">
        <div class="floors">
          ${createFloors(floors)}
        </div>
        <div class="elevators-cont">
          ${createElevatorsStructure(elevators, floors)}
        </div>
      </div>
      <div class="controls">
        ${createFloorControl(floors)}
      </div>
    </div>
  </section>`
  );
}