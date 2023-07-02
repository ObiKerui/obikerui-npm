export default function (dateUnixTS: number, lng: number, lat: number) {
  const { sin, cos, asin, atan2, PI } = Math;
  const r = PI / 180;
  const t = dateUnixTS / 315576e7 - 0.3;
  const m = r * (357.52911 + t * (35999.05029 - t * 1537e-7));
  const c = r * (125.04 - 1934.136 * t);
  const l =
    r *
      (280.46646 +
        t * (36000.76983 + t * 3032e-7) +
        (1.914602 - t * (4817e-6 - t * 14e-6)) * sin(m) -
        569e-5 -
        478e-5 * sin(c)) +
    (0.019993 - 101e-6 * t) * sin(2 * m) +
    289e-6 * sin(3 * m);
  const e =
    (r * (84381.448 - t * (46.815 - t * (59e-5 + 1813e-6 * t)))) / 3600 + r * 256e-5 * cos(c);
  const sl = sin(l);
  const cr = cos(r * lat);
  const sr = sin(r * lat);
  const d = asin(sin(e) * sl);
  const h = r * (280.46061837 + 13184999.8983375 * t + lng) - atan2(cos(e) * sl, cos(l));
  const sd = sin(d);
  const cd = cos(d);
  const ch = cos(h);
  return {
    azimuth: PI + atan2(sin(h), ch * sr - (cr * sd) / cd),
    altitude: asin(sr * sd + cr * cd * ch),
  };
}
