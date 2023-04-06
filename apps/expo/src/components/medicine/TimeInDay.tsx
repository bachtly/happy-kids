const GetHourAndMinute = (time: number) => {
  return [Math.floor(time / 60), time % 60];
};
const GetTimeNumber = (hours: number, minutes: number) => {
  return hours * 60 + minutes;
};
export { GetHourAndMinute, GetTimeNumber };
