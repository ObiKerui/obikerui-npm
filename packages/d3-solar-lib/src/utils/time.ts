function dateTimeToUnixEpoch(dateTime: Date) {
  return dateTime.getTime();
}

function unixEpochToDateTime(unixEpoch: number) {
  const date = new Date(0);
  date.setSeconds(unixEpoch); // set the seconds since Unix epoch
  return date;
}

function unixEpochToJulianDay(unixEpoch: number) {
  return unixEpoch / 1000 / 86400.0 + 2440587.5;
}

function julianDayToJulianCentury(julianDay: number) {
  return (julianDay - 2451545.0) / 36525.0;
}

function julianCenturyToJulianDay(julianCentury: number) {
  return 36525.0 * julianCentury + 2451545.0;
}

function julianDayToUnixEpoch(julianDay: number) {
  const date = new Date(86400.0 * (julianDay - 2440587.5) * 1000);
  return date.getTime();
}

export {
  dateTimeToUnixEpoch,
  unixEpochToJulianDay,
  julianDayToJulianCentury,
  julianCenturyToJulianDay,
  julianDayToUnixEpoch,
  unixEpochToDateTime,
};
