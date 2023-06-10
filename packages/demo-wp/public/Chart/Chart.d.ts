/// <reference types="react" />
import createChart from './createChart';
interface Props {
    data?: unknown[];
}
declare function Chart({ data }: Props): JSX.Element;
declare namespace Chart {
    var defaultProps: {
        data: never[];
    };
}
declare function ChartContainer(): JSX.Element;
export { createChart, Chart, ChartContainer };
