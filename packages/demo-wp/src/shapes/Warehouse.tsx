import * as d3 from 'd3';
import { useEffect, useState } from 'react';
// import { ShapePlot } from './Plan';
import BayDetailPlot from './BayDetail';
import BayPlot from './Bays';
// import GoogleAccess from './Google';

function Search() {
  return (
    <div className="flex flex-grow">
      <input placeholder="input" className="w-full" />
    </div>
  );
}

type tWarehouseData = {
  bays: unknown;
  bayDetail: unknown;
};

interface ITopData {
  data: tWarehouseData;
}

function TopPlan({ data }: ITopData) {
  return (
    <div className="border border-slate-600">
      <BayPlot data={data.bays} width={700} />
    </div>
  );
}

interface ISideData {
  data: tWarehouseData;
}

function SidePlan({ data }: ISideData) {
  return (
    <div className="border border-slate-600">
      <BayDetailPlot data={data.bayDetail} width={300} />
    </div>
  );
}

function StockList() {
  return <div>stock list</div>;
}

function Container() {
  const [data, setData] = useState<tWarehouseData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const jsonBayData = await d3.json('assets/bays.json');
      const jsonBayDetail = await d3.json('assets/baysDetail.json');
      setData({
        bays: jsonBayData,
        bayDetail: jsonBayDetail,
      });
    };

    // eslint-disable-next-line no-console
    fetchData().catch(console.error);
  }, []);

  if (!data) {
    return <div>loading data...</div>;
  }

  return (
    <div className="flex flex-col">
      {/* <GoogleAccess /> */}
      <Search />
      <div className="flex w-5/6 flex-row gap-1">
        <TopPlan data={data} />
        <SidePlan data={data} />
      </div>
      <div className="flex w-full border border-gray-500">
        <StockList />
      </div>
    </div>
  );
}

export default Container;
