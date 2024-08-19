import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function staatsangehoerigkeit_plot(einwohner_staatsAHK_csv, stt_id, width, toggled_value_sttatAK) {

    const ts_data = d3.filter(einwohner_staatsAHK_csv, (r) => r.STT_ID == stt_id);

    const transformedData = ts_data.flatMap(item => {
      const total = item.Deutsch + item.Nichtdeutsch;
      const jahr = item.Jahr;
      return [
        { jahr, status: "Deutsch", value_rel: item.Deutsch / total, value_abs: item.Deutsch },
        { jahr, status: "Sonstige", value_rel: item.Nichtdeutsch / total, value_abs: item.Nichtdeutsch}
      ];
    });
        
    const abs = Plot.plot({
      width: width,
      marginLeft: 90,
      color: { scheme: "Observable10", legend: true },
      x: {
        label: "Jahr",
        tickFormat:"",
      },
      y: {
        label: "Einwohnerinnen (Anzahl)",
        tickFormat: d => d.toLocaleString(),
        labelAnchor: "center"
      },
      marks: [
        Plot.barY(transformedData.filter((d, i, arr) => {
          if (width < 600) {
            const uniqueYears = [...new Set(arr.map(item => item.jahr))];
            return uniqueYears.indexOf(d.jahr) % 2 === 0;
          }
          return true;
        }), 
          {x: "jahr", 
          y: "value_abs", 
          fill: "status", 
          title: d => `Status: ${d.status}\nJahr: ${d.jahr}\nAnzahl: ${d.value_abs.toLocaleString()}`,
          tip: true
        }),        
        Plot.ruleY([0])
      ]
    })

    const rel = Plot.plot({
      width: width,
      marginLeft: 70,
      color: { scheme: "Observable10", legend: true },
      x: {
        label: "Jahr",
        tickFormat:"",
      },
      y: {
        label: "Anteil (in Prozent %)",
        tickFormat: x => `${x * 100}%`,
        labelAnchor: "center"
      },
      marks: [
        Plot.barY(transformedData.filter((d, i, arr) => {
          if (width < 600) {
            const uniqueYears = [...new Set(arr.map(item => item.jahr))];
            return uniqueYears.indexOf(d.jahr) % 2 === 0;
          }
          return true;
        }), 
          {x: "jahr", 
          y: "value_rel", 
          fill: "status", 
          title: d => `Status: ${d.status}\nJahr: ${d.jahr}\nAnteil: ${(d.value_rel *100).toFixed(0) }%`,
          tip: true
        }),        
        Plot.ruleY([0])
      ]
    })
  return toggled_value_sttatAK ? abs : rel;
}

