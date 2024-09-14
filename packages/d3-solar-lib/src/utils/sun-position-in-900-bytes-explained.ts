export default function (dateUnixTS: number, lng: number, lat: number) {
  const { sin, cos, asin, atan2, PI } = Math;

  // convert PI from degrees to radians
  const r = PI / 180;

  // convert the Unix Timestamp into Julian Centuries from the epoch J2000.0
  // 315576e7 - no. of seconds in a julian century
  // t is fractional no. of Julian centuries since 2000
  const t = dateUnixTS / 315576e7 - 0.3;

  // calculates the mean-anomaly of the sun in radians
  // i.e. the angle between the sun's current pos and its closest point to the earth (circular orbit)
  const m = r * (357.52911 + t * (35999.05029 - t * 1537e-7));

  // c is the longitude of the perihelion ie the point in Earth's orbit closest to the sun in radians
  // also accounting for precession of earth's orbit which changes perihelion over time
  const c = r * (125.04 - 1934.136 * t);

  // apparent longitude of the Sun in radians (geometric position as seen from Earth)
  const l =
    r *
      (280.46646 +
        t * (36000.76983 + t * 3032e-7) +
        (1.914602 - t * (4817e-6 - t * 14e-6)) * sin(m) -
        569e-5 -
        478e-5 * sin(c)) +
    (0.019993 - 101e-6 * t) * sin(2 * m) +
    289e-6 * sin(3 * m);

  // the obliquity of the ecliptic in radians - the tilt of the earth's axis relative
  // to its orbit around the Sun
  const e =
    (r * (84381.448 - t * (46.815 - t * (59e-5 + 1813e-6 * t)))) / 3600 +
    r * 256e-5 * cos(c);

  // sl = sine of longitude, cr cosine of observer's latitude (radians), sr sine of observer's latitude (radians)
  const sl = sin(l);
  const cr = cos(r * lat);
  const sr = sin(r * lat);

  // declination of the Sun radians. Angular position above or below the celestial equator
  const d = asin(sin(e) * sl);

  // hour angle of the Sun in radians. Diff between local sidereal time and sun's right ascension
  // it measures how far the Sun has moved across the sky from it's highest point (local noon)
  const h =
    r * (280.46061837 + 13184999.8983375 * t + lng) -
    atan2(cos(e) * sl, cos(l));

  // sine and cosine of the declination used for later altitude and azimuth calculations
  const sd = sin(d);
  const cd = cos(d);

  // cosine of the hour angle of the Sun
  const ch = cos(h);

  // return the azimuth and altitude of the Sun
  // azimuth is the horizontal angle of the Sun's position measured clockwise from north
  // altitude the vertical angle of the Sun above the horizon
  return {
    azimuth: PI + atan2(sin(h), ch * sr - (cr * sd) / cd),
    altitude: asin(sr * sd + cr * cd * ch),
  };
}
