type tSTDLInfo = {
  rate?: number;
};

function SDTLInfo({ rate = 0 }: tSTDLInfo) {
  return (
    <span>
      <span className="pr-4 font-extralight">at</span> {rate}%
    </span>
  );
}

export { SDTLInfo };
