import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import * as Inputs from "npm:@observablehq/inputs";

export function altersgruppen_abs_plot(einwohner_altersgruppen_csv, stt_id, width, toggled_value_alt) {
  // filter two selected stadtteile
  const ts_data = d3.filter(
    einwohner_altersgruppen_csv,
    (r) => stt_id == r.Stadtteil_Nr
  );
  /*
  //ohne "Erwerbsfähige (15 bis 64 Jahre)"
  const updatedArray = ts_data.map(item => {
    return {
      ...item,
      Gruppe: item.Gruppe.substring(3) // Entfernt die ersten drei Zeichen
    };
  });
  */
  const filteredData = ts_data.filter(item => item.Gruppe !== "Z. Erwerbsfähige (15 bis 64 Jahre)"); 
    
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
  const abs = Plot.plot({
      width: width,
      marginLeft: 90,
      y: { 
        grid: true, 
        label: "Einwohnerinnen (Anzahl)", 
        tickFormat: d => d.toLocaleString(),
        labelAnchor: "center"
      },
      x: { 
        label: "Jahr",
        tickFormat: ""
      },
      color: { legend: true },
      marks: [
        Plot.barY(filteredData.filter((d, i, arr) => {
          if (width < 600) {
            const uniqueYears = [...new Set(arr.map(item => item.Jahr))];
            return uniqueYears.indexOf(d.Jahr) % 2 === 0;
          }
          return true;
        }), {
        x: "Jahr",
        y: "Anzahl", 
        fill: "Gruppe",
        title: d => `Gruppe: ${d.Gruppe.substring(3)}\nJahr: ${d.Jahr}\nAnzahl: ${d.Anzahl.toLocaleString()}`, 
        tip: true
      }),
        Plot.ruleY([0]),
      ]
    }
  );  
  
  const rel = Plot.plot({
    width: width,
    marginLeft: 70,
    y: { 
      grid: true, 
      label: "Anteil (in Prozent %)", 
      tickFormat: x => `${x * 100}%`,
      labelAnchor: "center"
    },
    x: { 
      label: "Jahr",
      tickFormat: ""
    },
    color: { legend: true },
    marks: [
      Plot.barY(filteredData.filter((d, i, arr) => {
        if (width < 600) {
          const uniqueYears = [...new Set(arr.map(item => item.Jahr))];
          return uniqueYears.indexOf(d.Jahr) % 3 === 0;
        }
        return true;
      }), {
      x: "Jahr",
      y: "Anteil", 
      fill: "Gruppe",
      title: d => `Gruppe: ${d.Gruppe.substring(3)}\nJahr:  ${d.Jahr}\nAnteil: ${(d.Anteil * 100).toFixed(0)}%`, 
      tip: true
    }),
      Plot.ruleY([0]),
    ]
  }
)
return toggled_value_alt ? rel : abs

}
