import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import * as Inputs from "npm:@observablehq/inputs";

export function altersgruppen_abs_plot(einwohner_altersgruppen_csv, stt_id, width, toggled_value_alt) {
  // filter two selected stadtteile
  const ts_data = d3.filter(
    einwohner_altersgruppen_csv,
    (r) => stt_id == r.Stadtteil_Nr
  );
  
  const filteredData = ts_data.filter(item => item.Gruppe !== "Z. Erwerbsfähige (15 bis 64 Jahre)"); 
    
  const abs = Plot.plot({
      width: width,
      marginLeft: 60,
      y: { 
        grid: true, 
        label: "EinwohnerInnen (Anzahl)", 
        tickFormat: d => d.toLocaleString(),        
      },
      x: { 
        label: "Jahr",
        tickFormat: "",
        labelOffset: 29
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
    marginLeft: 50,
    y: { 
      grid: true, 
      label: "Anteil (in Prozent %)", 
      tickFormat: x => `${x * 100}%`,     
    },
    x: { 
      label: "Jahr",
      tickFormat: "",
      labelOffset: 29
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
      title: d => `Gruppe: ${d.Gruppe.substring(3)}\nJahr: ${d.Jahr}\nAnteil: ${(d.Anteil * 100).toLocaleString(undefined, {maximumFractionDigits: 0})}%`, 
      tip: true
    }),
      Plot.ruleY([0]),
    ]
  }
)
return toggled_value_alt ? abs : rel

}
