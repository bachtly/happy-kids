import { injectable } from "tsyringe";
import moment from "moment";

interface TimeServiceInterface {
  getStartOfDay: (date: Date) => Date;
  getEndOfDay: (date: Date) => Date;
}

@injectable()
class TimeService implements TimeServiceInterface {
  getStartOfDay = (date: Date) =>
    moment(moment(date).format("MM/DD/YYYY")).toDate();
  getEndOfDay = (date: Date) =>
    moment(moment(date).format("MM/DD/YYYY")).add(1, "day").toDate();
}

export type { TimeServiceInterface };
export { TimeService };
