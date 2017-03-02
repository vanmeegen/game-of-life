export class Point {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  //noinspection JSUnusedGlobalSymbols
  minus(p: Point): Point {
    return new Point(this.x - p.x, this.y - p.y);
  }

  //noinspection JSUnusedGlobalSymbols
  plus(p: Point): Point {
    return new Point(this.x + p.x, this.y + p.y);
  }

  //noinspection JSUnusedGlobalSymbols
  isZero(): boolean {
    return this.x === 0 && this.y === 0;
  }

  //noinspection JSUnusedGlobalSymbols
  scale(scale: number): Point {
    return new Point(this.x * scale, this.y * scale);
  }
}

//noinspection JSUnusedGlobalSymbols
export class Rectangle {
  readonly a: Point;
  readonly b: Point;

  //noinspection JSUnusedGlobalSymbols
  /**
   * create minimal rect with these two points inside, i.e. topleft and bottomright corner
   * @param a
   * @param b
   */
  constructor(a: Point, b: Point) {
    this.a = a;
    this.b = b;
  }


  /**
   * true if point is contained in rectangle
   * @param point
   */
  containsPoint(point: Point): boolean {
    return (point.x >= this.a.x && point.x <= this.b.x || point.x >= this.b.x && point.x <= this.a.x) && (point.y >= this.a.y && point.y <= this.b.y || point.y >= this.b.y && point.y <= this.a.y);
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * true if rect is contained in rectangle
   * @param rect
   */
  containsRect(rect: Rectangle): boolean {
    return this.containsPoint(rect.a) && this.containsPoint(rect.b);
  }

  static from(x: number, y: number, width: number, height: number): Rectangle {
    return new Rectangle(new Point(x, y), new Point(x + width, y + height));
  }
}