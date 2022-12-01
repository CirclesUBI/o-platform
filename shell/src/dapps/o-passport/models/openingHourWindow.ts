import {HourAndMinute} from "./hourAndMinute";

export class OpeningHourWindow {
  isEmpty: boolean;
  from: HourAndMinute;
  to: HourAndMinute;

  constructor() {
    this.isEmpty = true;
  }
}