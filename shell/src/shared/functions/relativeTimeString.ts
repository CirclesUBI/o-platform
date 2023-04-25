import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/id";

import { Environment } from "../environment";

export default function relativeTimeString(time: string, relativeDaysBase: number, showHours: boolean = false) {
  const locale: string = Environment.userLanguage.slice(0, 2);
  dayjs.locale(locale);

  if (!time) {
    return null;
  }
  const convertedTime = new Date(Date.parse(time));
  let now = new Date();

  let relativeDaysAgo = now.setDate(now.getDate() - relativeDaysBase);

  if (relativeDaysAgo > convertedTime.getTime()) {
    if (showHours) {
      return dayjs(convertedTime).format("D.MM.YYYY HH:mm");
    } else {
      return dayjs(convertedTime).format("D.MM.YYYY");
    }
  } else {
    return dayjs().to(dayjs(convertedTime));
  }
}
