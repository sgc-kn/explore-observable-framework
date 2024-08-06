import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

const caption = `
Ich glaube hier sollten wir noch ein paar Worte verlieren. Was sind
die Achsen? Wo kommen die Daten her? Kann man die irgendwo downloaden?
Etc...
`
export function entwicklung_plot(einwohner_csv, stt_id, width) {
  
  const ts_data = d3.filter(einwohner_csv, (r) => r.STT_ID == stt_id);
  
  return Plot.plot({
    width,
    caption,
    marks: [
      Plot.lineY(ts_data, {
        x: "Jahr",
        y: "Einwohner",
        stroke: "var(--theme-foreground-focus)",
      }),
      Plot.crosshairX(ts_data, {x: "Jahr", y: "Einwohner"}),
    ],
  });
}