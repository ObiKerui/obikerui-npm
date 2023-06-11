/* eslint-disable @typescript-eslint/no-explicit-any */

function AttrsGenerator() {
  let retVal = null as any;
  let obj = null as any;

  function generateAccessor(attr: keyof typeof obj) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    function accessor<Type>(value: Type): any {
      if (!arguments.length) {
        return obj[attr];
      }
      obj[attr] = value as never;

      return retVal;
    }
    return accessor;
  }

  function toExport(attrName: string) {
    return generateAccessor(attrName);
  }

  toExport.attachTo = function (_x: any) {
    if (arguments.length > 0) {
      obj = _x;
      return toExport;
    }
    return obj;
  };

  toExport.setterReturnValue = function (_x: any) {
    if (arguments.length > 0) {
      retVal = _x;
      return toExport;
    }
    return retVal;
  };

  return toExport;
}

export default AttrsGenerator;
