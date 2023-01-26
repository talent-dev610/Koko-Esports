import moment from 'moment';
import { Timestamp } from 'firebase/firestore'

/**
 * format "HH:mm:ss"  return today's date time in Moment
 * @param timeStr
 * @return Date
 */
export const kokoTimeStrToDate = (timeStr: string) => {
  const currentDate = moment().format("YYYY/MM/DD");
  return moment(currentDate + " " + timeStr);
};

export const kokoChatTimeFormat = (fsTime: Timestamp) => {
  if (fsTime === undefined) return "N/A";
  const date = moment(fsTime.toDate());
  const today = moment();
  if (date.year() === today.year() && date.month() === today.month() && date.date() === today.date()) {
    return date.format("HH:mm");
  } else if (date.year() === today.year()) {
    return date.format("MM/DD HH:mm");
  } else {
    return date.format("YYYY/MM/DD HH:mm");
  }
};

export const isChatTimeRecentUpdated = (timestamp: Timestamp) => {
  if (timestamp === null) return true;
  const date = moment(timestamp.toDate());
  const current = moment();
  return current.diff(date, "second") < 10;
};

export const getEnglishOrderString = (order: number) => {
  switch (order) {
    case 1:
      return `${order}st`;
    case 2:
      return `${order}nd`;
    case 3:
      return `${order}rd`;
    default:
      return `${order}th`;
  }
};

export const convertNumberString = (inputStr: string) => {
  if (inputStr.length > 3)
    return inputStr.replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,")
  else
    return inputStr
}

export const formatDurationSecond = (duration: number) => {
  var h = Math.floor(duration / 3600);
  var m = Math.floor(duration % 3600 / 60);
  var s = Math.floor(duration % 3600 % 60);

  var hDisplay = h > 0 ? h > 9 ? `${h}:` : `0${h}:` : "";
  var mDisplay = m > 0 ? m > 9 ? `${m}:` : `0${m}:` : "00:";
  var sDisplay = s > 0 ? s > 9 ? `${s}` : `0${s}` : "00";
  return hDisplay + mDisplay + sDisplay;
}
