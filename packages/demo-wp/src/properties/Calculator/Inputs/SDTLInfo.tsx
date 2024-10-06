type tSTDLInfo = {
  rate?: number;
};

function SDTLInfo({ rate = 0 }: tSTDLInfo) {
  return (
    // <span>
    //   <span className="font-extralight">at</span> {rate}%
    // </span>
    <span>{rate}%</span>
  );
}

SDTLInfo.defaultProps = {
  rate: 0,
};

export { SDTLInfo };
