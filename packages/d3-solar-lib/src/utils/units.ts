function radiansToDegrees(radians: number) {
  return radians * (180.0 / Math.PI);
}

function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180.0);
}

function normalizeDegrees(degrees: number): number {
  const normalized = degrees % 360; // Wrap around to the range of 0 to 360
  return normalized < 180 ? normalized : normalized - 360;
}

export { radiansToDegrees, degreesToRadians, normalizeDegrees };
