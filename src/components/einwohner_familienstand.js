import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function familienstand_plot(einwohner_famStd_csv, stt_id, width) {

    const ts_data = d3.filter(einwohner_famStd_csv, (r) => r.STT_ID == stt_id);

    const transformedData = ts_data.flatMap(item => { 
      const total = item.Fam_Stand_Geschieden_LP_aufgehoben + item.Fam_Stand_Verheiratet_Lebenspartnerschaft + item.Fam_Stand_Verwitwet_LP_gestorben + item.Fam_Stand_ledig + item.Fam_Stand_unbekannt;     
      const year = item.Jahr;
      return [
        { year, status: "Geschieden", value: item.Fam_Stand_Geschieden_LP_aufgehoben / total },
        { year, status: "Verheiratet", value: item.Fam_Stand_Verheiratet_Lebenspartnerschaft / total},
        { year, status: "Verwitwet", value: item.Fam_Stand_Verwitwet_LP_gestorben / total},
        { year, status: "Ledig", value: item.Fam_Stand_ledig / total},
        { year, status: "Unbekannt", value: item.Fam_Stand_unbekannt / total}
      ];
    });

    return Plot.plot({
      width: width,
      color: { scheme: "Observable10", legend: true },
      x: {
        label: "Jahr",
        tickFormat: "",
        ticks: width < 600 ? 5 : undefined
      },
      y: {        
        label: "Anteil (in Prozent %)",
        tickFormat: x => `${x * 100}%`,
      },
      marks: [
        Plot.barY(transformedData.filter((d, i, arr) => {
          if (width < 600) {           
            const uniqueYears = [...new Set(arr.map(item => item.year))];           
            return uniqueYears.indexOf(d.year) % 2 === 0;
          }
          return true;
        }), 
          {x: "year", y: "value", fill: "status", 
          title: d => `Status: ${d.status}\n Jahr: ${d.year}\n Anteil: ${(d.value *100).toFixed(0) }%`,
          tip: true
        }),
      ]
    })
}