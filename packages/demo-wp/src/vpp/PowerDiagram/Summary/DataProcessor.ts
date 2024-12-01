import dayjs, { Dayjs } from 'dayjs';
import { tSolaxData } from '../../Solax/Types';

type tTariff = {
  time: Dayjs;
  rate: number;
};

class DataProcessor {
  getDataForDate(data: tSolaxData[], date: Dayjs) {
    const filtered = data.filter((elem) => {
      const elemDate = dayjs(elem.uploadTime);
      const sameDay = elemDate.isSame(date, 'day');
      return elemDate.isBefore(date) && sameDay;
    });
    return filtered;
  }

  getAccumulatedYield(data: tSolaxData[]) {
    return data.reduce((accum, curr) => accum + curr.yieldtoday, 0);
  }

  calculateRate(_time: Dayjs, _tariffs: tTariff[]) {
    return 1;
  }

  getAccumulatedExport(data: tSolaxData[], tariffs: tTariff[]) {
    return data.reduce(
      (accum, curr) =>
        accum +
        curr.feedinenergy * this.calculateRate(dayjs(curr.uploadTime), tariffs),
      0
    );
  }
}

export { DataProcessor };
