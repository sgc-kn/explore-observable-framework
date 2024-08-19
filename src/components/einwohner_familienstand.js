import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function familienstand_plot(einwohner_famStd_csv, stt_id, width, toggled_value_famStand) {

    const ts_data = d3.filter(einwohner_famStd_csv, (r) => r.STT_ID == stt_id);

    const transformedData = ts_data.flatMap(item => { 
      const total = item.Fam_Stand_Geschieden_LP_aufgehoben + item.Fam_Stand_Verheiratet_Lebenspartnerschaft + item.Fam_Stand_Verwitwet_LP_gestorben + item.Fam_Stand_ledig + item.Fam_Stand_unbekannt;     
      const year = item.Jahr;
      return [
        { year, status: "Geschieden", value_rel: item.Fam_Stand_Geschieden_LP_aufgehoben / total, value_abs: item.Fam_Stand_Geschieden_LP_aufgehoben },
        { year, status: "Verheiratet", value_rel: item.Fam_Stand_Verheiratet_Lebenspartnerschaft / total, value_abs: item.Fam_Stand_Verheiratet_Lebenspartnerschaft},
        { year, status: "Verwitwet", value_rel: item.Fam_Stand_Verwitwet_LP_gestorben / total, value_abs: item.Fam_Stand_Verwitwet_LP_gestorben},
        { year, status: "Ledig", value_rel: item.Fam_Stand_ledig / total, value_abs: item.Fam_Stand_ledig},
        { year, status: "Unbekannt", value_rel: item.Fam_Stand_unbekannt / total, value_abs: item.Fam_Stand_unbekannt}
      ];
    });    

    const rel = Plot.plot({
      width: width,
      marginLeft: 70,
      color: { scheme: "Observable10", legend: true },
      x: {
        label: "Jahr",
        tickFormat: ""        
      },
      y: {        
        label: "Anteil (in Prozent %)",
        tickFormat: x => `${x * 100}%`,
        labelAnchor: "center"
      },
      marks: [
        Plot.barY(transformedData.filter((d, i, arr) => {
          if (width < 600) {           
            const uniqueYears = [...new Set(arr.map(item => item.year))];           
            return uniqueYears.indexOf(d.year) % 2 === 0;
          }
          return true;
        }), 
          {x: "year", y: "value_rel", fill: "status", 
          title: d => `Status: ${d.status}\nJahr: ${d.year}\nAnteil: ${(d.value_rel *100).toFixed(0) }%`,
          tip: true
        }),
      ]
    });

    const abs = Plot.plot({
      width: width,
      marginLeft: 90,
      color: { scheme: "Observable10", legend: true },
      x: {
        label: "Jahr",
        tickFormat: ""        
      },
      y: {        
        label: "Einwohnerinnen (Anzahl)",
        tickFormat: d => d.toLocaleString(),
        labelAnchor: "center"
      },
      marks: [
        Plot.barY(transformedData.filter((d, i, arr) => {
          if (width < 600) {           
            const uniqueYears = [...new Set(arr.map(item => item.year))];           
            return uniqueYears.indexOf(d.year) % 2 === 0;
          }
          return true;
        }), 
          {x: "year", y: "value_abs", fill: "status", 
          title: d => `Status: ${d.status}\nJahr: ${d.year}\nAnteil: ${d.value_abs.toLocaleString() }`,
          tip: true
        }),
      ]
    })
  return toggled_value_famStand ? abs : rel;  
}