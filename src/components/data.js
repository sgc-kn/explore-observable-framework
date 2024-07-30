import {FileAttachment} from "npm:@observablehq/stdlib";
import * as d3 from "npm:d3";

export const data = await FileAttachment("../data/einwohner.csv").csv();
export const map_csv = await FileAttachment("../data/map.csv").csv();
export const geojson = await FileAttachment("../data/stadtteile.geojson").json();
export const familienstand_csv = await FileAttachment("../data/familienstand.csv").csv();

export const fontSizelabel = 16
export const fontFamily = 'Arial, sans-serif'
export const yellowColor = '#efb118'

// string to number
export const clearData = data.map(item => {
    return {
      ...item,
      Einwohner: item.Einwohner ? Number(item.Einwohner) : "NaN",
      //Jahr: item.Jahr && !isNaN(item.Jahr) ? parseInt(item.Jahr, 10) : "NaN",
      Wachstum: item.Wachstum ? parseFloat(item.Wachstum) : "NaN"
    };
});
//group by STT
export const groupedData = d3.group(clearData, d => d.STT);
// at the first place "Gesamtstadt"
export const sortedData = Array.from(groupedData).sort((a, b) => {
  if (a[0] === "Gesamtstadt") return -1;
  if (b[0] === "Gesamtstadt") return 1;
  return a[0].localeCompare(b[0]);
});

// at the first place "Gesamtstadt"
export const combinedData = sortedData.flatMap(item => item[1]);

//get last year (for example "2023")
//const latestYear = Math.max(...data.map(item => parseInt(item.Jahr, 10))).toString();
const years = data.map(item => {
    const year = parseInt(item.Jahr, 10);
    if (isNaN(year)) {
      console.error(`Invalid year value: ${item.Jahr}`);
    }
    return year;
}).filter(year => !isNaN(year)); // Filter out any invalid years

// Find the maximum year (z.B. '2023')
export const latestYear = Math.max(...years).toString();

//vorheriges Jahr aus letztes Jahr (z.B. '2022')
export const previousYear = (parseInt(latestYear, 10) - 1).toString();

// Find the first year (z.B. '1995')
export const earliestYear = Math.min(...years).toString();
