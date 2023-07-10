const epochs: Array<[string, number]> = [
  ["year", 31536000],
  ["month", 2592000],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
];

export function getTimespan(origDate: string) {
  if (!(origDate.includes("+") || origDate.includes("-"))) origDate += "+00:00";
  let timeSpan = (Date.now() - Date.parse(origDate)) / 1000;
  for (let [name, seconds] of epochs) {
    if (timeSpan > seconds) {
      let timeAmount = Math.floor(timeSpan / seconds);
      return `${timeAmount} ${name}${timeAmount > 1 ? "s" : ""} ago`;
    }
  }
}

type ReadableMonths = { name: string; firstDate: Date; lastDate: Date }[];

export function getMonths(firstDate: Date): ReadableMonths {
  const today = new Date();
  let date = new Date(today.getFullYear(), today.getMonth());

  const months: ReadableMonths = [];

  while (true) {
    months.push({
      name: `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`,
      firstDate: date,
      lastDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
    });

    if (date.getMonth() === 0) {
      date = new Date(date.getFullYear() - 1, 11);
    } else {
      date = new Date(date.getFullYear(), date.getMonth() - 1);
    }

    if (firstDate > date) return months;
  }
}
