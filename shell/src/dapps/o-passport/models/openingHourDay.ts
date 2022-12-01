import {OpeningHourWindow} from "./openingHourWindow";

export type Day = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

export class OpeningHourDay {
  isOpen: boolean;

  readonly day: Day;
  readonly windows: OpeningHourWindow[] = [];

  constructor(day: Day) {
    this.day = day;
  }
}