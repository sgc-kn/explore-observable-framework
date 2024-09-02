import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import * as Inputs from "npm:@observablehq/inputs";

export function relativ_plot(einwohner_csv, stt_id, compare_id, width) {

  // filter two selected stadtteile
  const ts_data = d3.filter(
    einwohner_csv,
    (r) => [stt_id, compare_id].includes(r.STT_ID)
  );  
  
  return Plot.plot({
    width: width,
    marginLeft: 30,    
    x: {
      label: "Jahr", interval: 1, tickFormat: '', labelAnchor: "center", labelOffset: 29
    },
    y: {
      label: "Wachstum (prozentuale Änderung im Vergleich zum Vorjahr)",      
      grid: true,
      tickFormat: d => d.toLocaleString(),      
    },    
    marks: [
      Plot.lineY(ts_data,{
        x: "Jahr",
        y: "Wachstum",
        stroke: "STT",           
      }),
      Plot.ruleX(ts_data, 
        Plot.pointerX({x: "Jahr", py: "Wachstum", stroke: "var(--theme-foreground-muted)"})
      ),
      Plot.dot(ts_data, 
        Plot.pointerX({x: "Jahr", y: "Wachstum", stroke: "var(--theme-foreground-muted)"})
      ),
      Plot.text(ts_data, 
        Plot.pointerX(
          {
            px: "Jahr", 
            py: "Wachstum",
            frameAnchor: "top-right",
            fontVariant: "tabular-nums",
            dy: -5,           
            text: (d) => [
              `${d.STT},`, 
              `${d.Jahr}`,
              `\nEinwohner: ${d.Einwohner.toLocaleString()}`,              
              `(${d.Wachstum.toLocaleString(undefined, {maximumFractionDigits: 1})}%)`              
            ].join(" ")            
          }
        )
      ),     
    ],
    color: {legend: true},
  },
)}
