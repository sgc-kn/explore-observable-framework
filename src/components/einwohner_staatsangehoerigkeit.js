import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function staatsangehoerigkeit_plot(einwohner_staatsAHK_csv, stt_id, width, toggled_value_sttatAK) {

    const ts_data = d3.filter(einwohner_staatsAHK_csv, (r) => r.STT_ID == stt_id);

    const transformedData = ts_data.flatMap(item => {
      const total = item.Deutsch + item.Nichtdeutsch;
      const jahr = item.Jahr;
      return [
        { jahr, status: "Deutsch", value_rel: item.Deutsch / total, value_abs: item.Deutsch },
        { jahr, status: "Nichtdeutsch", value_rel: item.Nichtdeutsch / total, value_abs: item.Nichtdeutsch}
      ];
    });
        
    const abs = Plot.plot({
      width: width,
      marginLeft: 60,
      color: { scheme: "Observable10", legend: true },
      x: {
        label: "Jahr",
        tickFormat:"",
        labelOffset: 29
      },
      y: {
        label: "EinwohnerInnen (Anzahl)",
        tickFormat: d => d.toLocaleString(),        
      },
      marks: [
        Plot.barY(transformedData.filter((d, i, arr) => {
          if (width < 600) {
            const uniqueYears = [...new Set(arr.map(item => item.jahr))];
            return uniqueYears.indexOf(d.jahr) % 3 === 0;
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
      marginLeft: 50,
      color: { scheme: "Observable10", legend: true },
      x: {
        label:"Jahr",
        tickFormat:"",
        labelOffset: 29
      },
      y: {
        label: "Anteil (in Prozent %)",
        tickFormat: x => `${x}%`,
        //tickFormat: x => `${x * 100}%`,
        percent: true       
      },
      marks: [
        Plot.barY(transformedData.filter((d, i, arr) => {
          if (width < 600) {
            const uniqueYears = [...new Set(arr.map(item => item.jahr))];
            return uniqueYears.indexOf(d.jahr) % 3 === 0;
          }
          return true;
        }), 
          {x: "jahr", 
          y: "value_rel", 
          fill: "status", 
          title: d => `Status: ${d.status}\nJahr: ${d.jahr}\nAnteil: ${(d.value_rel *100).toLocaleString(undefined, {maximumFractionDigits: 0})}%`,
          tip: true
        }),        
        Plot.ruleY([0])
      ]
    })
  return toggled_value_sttatAK ? abs : rel;
}

