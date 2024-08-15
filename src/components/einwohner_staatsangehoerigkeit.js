import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function staatsangehoerigkeit_plot(einwohner_staatsAHK_csv, stt_id, width) {

    const ts_data = d3.filter(einwohner_staatsAHK_csv, (r) => r.STT_ID == stt_id);

    const transformedData = ts_data.flatMap(item => {
      const total = item.Deutsch + item.Nichtdeutsch;
      const jahr = item.Jahr;
      return [
        { jahr, status: "Deutsch", value: item.Deutsch / total },
        { jahr, status: "Sonstige", value: item.Nichtdeutsch / total}
      ];
    });
    console.log('transformedData', transformedData)
    return Plot.plot({
      width: width,
      color: { scheme: "Observable10", legend: true },
      x: {
        label: "Jahr",
        tickFormat:"",
        ticks: width < 600 ? 5 : undefined
      },
      y: {
        label: "Anteil (in Prozent %)",
        tickFormat: x => `${x * 100}%`,
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
          y: "value", 
          fill: "status", 
          title: d => `Status: ${d.status}\n Jahr: ${d.jahr}\n Anteil: ${(d.value *100).toFixed(0) }%`,
          tip: true
        }),        
        Plot.ruleY([0])
      ]
    })
}

