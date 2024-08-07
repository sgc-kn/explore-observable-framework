import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

const caption = `
Ich glaube hier sollten wir noch ein paar Worte verlieren. Was sind
die Achsen? Wo kommen die Daten her? Kann man die irgendwo downloaden?
Etc...
`
export function entwicklung_plot(einwohner_csv, stt_id, width) {
  const ts_data = d3.filter(einwohner_csv, (r) => r.STT_ID == stt_id);

  const maxValue = Math.max(...ts_data.map(d => d.Einwohner));
  const minValue = Math.min(...ts_data.map(d => d.Einwohner));  
  
  return Plot.plot({
    width,
    caption,
    x: {tickFormat: ""},
    marks: [
      Plot.axisY({
        tickFormat: d => d.toLocaleString('de-DE').replace(',', '.'),
        ticks: 4
      }),
      Plot.lineY(ts_data, {
        x: "Jahr",
        y: "Einwohner",
        stroke: "var(--theme-foreground-focus)",        
      }),
      
      Plot.dot(ts_data.filter(d => d.Einwohner === maxValue), 
        {x: "Jahr", y: "Einwohner", stroke: "orange", r: 3}),
      Plot.text(ts_data.filter(d => d.Einwohner === maxValue), 
        {x: "Jahr", y: "Einwohner", text: d => `Max: ${d.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}\n${d.Jahr}`, dy: 0, stroke: "orange", strokeWidth:0.7, fontSize: 16, fontWeight: 0.1,}),
      Plot.crosshairX(ts_data, {x: "Jahr", y: "Einwohner"}),
      // Mark min value
      Plot.dot(ts_data.filter(d => d.Einwohner === minValue), {x: "Jahr", y: "Einwohner", stroke: "black", r: 3}),
      Plot.text(ts_data.filter(d => d.Einwohner === minValue), {x: "Jahr", y: "Einwohner", text: d => `Min: ${d.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}\n${d.Jahr}`,
        dy: 23, stroke: "green", fontVariant: "tabular-nums", fontSize: 16, fontWeight: 0.1, strokeWidth:0.7})
    ],
  });
}