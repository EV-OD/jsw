
export class BaseClass {
  static staticProp: number = 24;
  instanceProp: number;

  constructor(value: number) {
    this.instanceProp = value;
  }

  add(a: number, b: number): number {
    return a + b;
  }
}

export class ExtendedClass extends BaseClass {

  extendedProp: number;

  constructor(extendedValue: number) {
    super(1);
    this.extendedProp = extendedValue;
  }

  add(a: number, b: number): number {
    return super.add(a, this.extendedProp + this.instanceProp);
  }
  
  // Overload-like behavior (different name for now as AS doesn't support direct overloading same name easily without strict types)
  addSingle(a: number): number {
      return this.add(a, 10);
  }
}

export function getStaticProp(): number {
  "use wasm";
  return BaseClass.staticProp;
}

export function testClassFeatures(value: number): number {
  "use wasm";
  let extendedClass = new ExtendedClass(value);
  return extendedClass.add(24, 0);
}
