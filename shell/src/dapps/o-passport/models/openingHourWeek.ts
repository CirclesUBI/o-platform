import {OpeningHourDay} from "./openingHourDay";

export class OpeningHourWeek {
  monday: OpeningHourDay;
  tuesday: OpeningHourDay;
  wednesday: OpeningHourDay;
  thursday: OpeningHourDay;
  friday: OpeningHourDay;
  saturday: OpeningHourDay;
  sunday: OpeningHourDay;

  get asArray() : OpeningHourDay[] {
    return [this.monday, this.tuesday, this.wednesday, this.thursday, this.friday, this.saturday, this.sunday];
  }

  constructor() {
    this.monday = new OpeningHourDay("monday");
    this.tuesday = new OpeningHourDay("tuesday");
    this.wednesday = new OpeningHourDay("wednesday");
    this.thursday = new OpeningHourDay("thursday");
    this.friday = new OpeningHourDay("friday");
    this.saturday = new OpeningHourDay("saturday");
    this.sunday = new OpeningHourDay("sunday");
  }
}