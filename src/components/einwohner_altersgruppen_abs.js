import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import * as Inputs from "npm:@observablehq/inputs";

export function altersgruppen_abs_plot(einwohner_altersgruppen_csv, stt_id, width) {
  // filter two selected stadtteile
  const ts_data = d3.filter(
    einwohner_altersgruppen_csv,
    (r) => stt_id == r.Stadtteil_Nr
  );

  //ohne "Erwerbsfähige (15 bis 64 Jahre)"
  const filteredData = ts_data.filter(item => item.Gruppe !== "Erwerbsfähige (15 bis 64 Jahre)"); 
  /*
  return Plot.plot({
    width: width,
    marginLeft: 50,
    color: { scheme: "Observable10", legend: true },
    facet: { data: filteredData, x: "Jahr"},
    y: { 
      label: "Anzahl", 
      grid: true, 
      tickFormat: d => d.toLocaleString()
    },
    x: { 
      label: "Jahr",      
      domain: Array.from(new Set(filteredData.map(d => d.Gruppe))), 
      axis: null,
      tickFormat: d => d.replace(',', '')
    },
    marks: [
      Plot.ruleX(filteredData, {
        x: "Gruppe",  
        y: "Anzahl",
        stroke: "Gruppe",
        strokeWidth: 3,
        tickFormat: d => d.toLocaleString()              
      }),
      Plot.dot(filteredData, {
        x: "Gruppe", 
        y: "Anzahl",
        fill: "Gruppe",
        r: 5,
        sort: { fx: "y", reduce: "sum", reverse: false }
      }),
      Plot.ruleY([0])
    ]
  });  
  */

  return Plot.plot({
      width: width,
      y: { grid: true, label: "Anzahl", tickFormat: d => d.toLocaleString() },
      x: { 
      label: "Jahr",
      tickFormat: ""
      },
      color: { legend: true },
      marks: [
        Plot.barY(filteredData, {
        x: "Jahr",
        y: "Anzahl", 
        fill: "Gruppe",
        title: d => `Gruppe: ${d.Gruppe}\n Jahr:  ${d.Jahr}\n Anzahl: ${d.Anzahl.toLocaleString()}` 
        }),
        Plot.ruleY([0]),
      ]
    }
  )
}
