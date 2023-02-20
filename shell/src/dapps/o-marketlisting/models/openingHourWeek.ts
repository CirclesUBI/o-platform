import {OpeningHourDay} from "./openingHourDay";
import {Maybe, Scalars} from "../../../shared/api/data/types";
import {HourAndMinute} from "./hourAndMinute";

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

  static parseOpeningHours(business:{
    businessHoursMonday?: Maybe<Scalars['String']>;
    businessHoursTuesday?: Maybe<Scalars['String']>;
    businessHoursWednesday?: Maybe<Scalars['String']>;
    businessHoursThursday?: Maybe<Scalars['String']>;
    businessHoursFriday?: Maybe<Scalars['String']>;
    businessHoursSaturday?: Maybe<Scalars['String']>;
    businessHoursSunday?: Maybe<Scalars['String']>;
  }) {
    const week = new OpeningHourWeek();
    function parseBusinessHourString(day: OpeningHourDay, windowStr:string) {
      // 8:30-12:00;13:00-22:30
      const windows = windowStr.split(";");
      windows.forEach((window, i) => {
        const startEndPair = window.split("-");
        const start = parseTime(startEndPair[0]);
        const end = parseTime(startEndPair[1]);
        day.windows.push({
          id: i.toString(),
          isPersisted: true,
          isEmpty: false,
          from: start,
          to: end
        });
      });
      if (day.windows.length) {
        day.isOpen = true;
      }
    }

    function parseTime(str:string) : HourAndMinute {
      const hourMinutePair = str.split(":");
      const hour = parseInt(hourMinutePair[0]);
      const minute = parseInt(hourMinutePair[1]);
      return new HourAndMinute(hour, minute);
    }

    if (business.businessHoursMonday) parseBusinessHourString(week.monday, business.businessHoursMonday);
    if (business.businessHoursTuesday) parseBusinessHourString(week.tuesday, business.businessHoursTuesday);
    if (business.businessHoursWednesday) parseBusinessHourString(week.wednesday, business.businessHoursWednesday);
    if (business.businessHoursThursday) parseBusinessHourString(week.thursday, business.businessHoursThursday);
    if (business.businessHoursFriday) parseBusinessHourString(week.friday, business.businessHoursFriday);
    if (business.businessHoursSaturday) parseBusinessHourString(week.saturday, business.businessHoursSaturday);
    if (business.businessHoursSunday) parseBusinessHourString(week.sunday, business.businessHoursSunday);

    return week;
  }

  serializeWeek(): {
    businessHoursMonday?: Maybe<Scalars['String']>;
    businessHoursTuesday?: Maybe<Scalars['String']>;
    businessHoursWednesday?: Maybe<Scalars['String']>;
    businessHoursThursday?: Maybe<Scalars['String']>;
    businessHoursFriday?: Maybe<Scalars['String']>;
    businessHoursSaturday?: Maybe<Scalars['String']>;
    businessHoursSunday?: Maybe<Scalars['String']>;
  } {
    function serializeDay(day:OpeningHourDay) : string {
      if (day.windows.length == 0 || !day.isOpen) {
        return "";
      }
      return day.windows.map(w => `${addLeadingZero(w.from.hour)}:${addLeadingZero(w.from.minute)}-${addLeadingZero(w.to.hour)}:${addLeadingZero(w.to.minute)}`).join(";");
    }

    function addLeadingZero(number) {
      return number.toString().padStart(2, '0');
    }

    return {
      businessHoursMonday: serializeDay(this.monday),
      businessHoursTuesday: serializeDay(this.tuesday),
      businessHoursWednesday: serializeDay(this.wednesday),
      businessHoursThursday: serializeDay(this.thursday),
      businessHoursFriday: serializeDay(this.friday),
      businessHoursSaturday: serializeDay(this.saturday),
      businessHoursSunday: serializeDay(this.sunday),
    };
  };
}