export class MathUtils {
  static randRange(a: number, b: number) {
    return Math.random() * (b - a) + a;
  }

  static randNormalish() {
    const r = Math.random() + Math.random() + Math.random() + Math.random();
    return (r / 4.0) * 2.0 - 1;
  }

  static randInt(a: number, b: number) {
    return Math.round(Math.random() * (b - a) + a);
  }

  static lerp(x: number, a: number, b: number) {
    return x * (b - a) + a;
  }

  static smoothStep(x: number, a: number, b: number) {
    x = x * x * (3.0 - 2.0 * x);
    return x * (b - a) + a;
  }

  static smootherStep(x: number, a: number, b: number) {
    x = x * x * x * (x * (x * 6 - 15) + 10);
    return x * (b - a) + a;
  }

  static clamp(x: number, a: number, b: number) {
    return Math.min(Math.max(x, a), b);
  }

  static sat(x: number) {
    return Math.min(Math.max(x, 0.0), 1.0);
  }

  static inRange(x: number, a: number, b: number) {
    return x >= a && x <= b;
  }
}
