import {HourAndMinute} from "./hourAndMinute";

export interface OpeningHourWindow {
  isEmpty: boolean;
  isPersisted: boolean;
  id:string;
  from: HourAndMinute;
  to: HourAndMinute;
}