import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export type MenuSelection = {
  selectedDate: Dayjs;
  fHour: number;
  selectedPlot: string;
}

export type MapViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
};