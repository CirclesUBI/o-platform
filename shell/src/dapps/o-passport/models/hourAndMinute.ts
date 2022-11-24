export class HourAndMinute {
  hour: number;
  minute: number;
  get minutes() : number {
    return this.hour * 60 + this.minute;
  }

  constructor(hour?: number, minute?: number) {
    this.hour = hour ?? 0;
    this.minute = minute ?? 0;
  }
}