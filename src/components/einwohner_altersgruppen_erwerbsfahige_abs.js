import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import * as Inputs from "npm:@observablehq/inputs";

export function einwohner_altersgruppen_erwerbsfähige_abs_plot(einwohner_altersgruppen_csv, stt_id, width, toggled_value) {
  // filter two selected stadtteile
  const ts_data = d3.filter(
    einwohner_altersgruppen_csv,
    (r) => stt_id == r.Stadtteil_Nr
  );  
  const filteredData = ts_data.filter(item => item.Gruppe !== "Z. Erwerbsfähige (15 bis 64 Jahre)");
  const erwerbsfaehigeData = ts_data.filter(item => item.Gruppe === "Z. Erwerbsfähige (15 bis 64 Jahre)");
    
  const summedD_ohneErwerbsfaehige = filteredData.reduce((acc, curr) => {    
    const year = curr.Jahr;
    if (!acc[year]) {
      acc[year] = { Jahr: year, GesamtAnzahl: 0, Gruppe: 'Sonstige' };
    }
    acc[year].GesamtAnzahl += curr.Anzahl;
    return acc;
  }, {});
  const summedD_ohneErwerbsfaehigeArray = Object.values(summedD_ohneErwerbsfaehige);
  
  const combinedData = erwerbsfaehigeData.flatMap(erwerbsfaehige => {
    const correspondingSonstige = summedD_ohneErwerbsfaehigeArray.find(item => item.Jahr === erwerbsfaehige.Jahr) || { GesamtAnzahl: 0 };
    
    return [
      {
        Jahr: erwerbsfaehige.Jahr,
        Gruppe: 'Erwerbsfaehige',
        Anzahl: erwerbsfaehige.Anzahl
      },
      {
        Jahr: erwerbsfaehige.Jahr,
        Gruppe: 'Sonstige',
        Anzahl: correspondingSonstige.GesamtAnzahl
      }
    ];
  });  
  // Berechnung der Gesamtsumme der Anzahl für jedes Jahr (für relative Werte)
  const jahreSumme = combinedData.reduce((acc, curr) => {
    if (!acc[curr.Jahr]) {
        acc[curr.Jahr] = 0;
    }
    acc[curr.Jahr] += curr.Anzahl;
    return acc;
  }, {});

  const combinedDataMitAnteil = combinedData.map(item => {
      return {
          ...item,
          Anteil: item.Anzahl / jahreSumme[item.Jahr] // Relativer Anteil
      };
  });  
  
  const abs = Plot.plot({
    width: width,
    marginLeft: 50,
    color: { scheme: "Observable10", legend: true },
    x: {
      label: "Jahr",
      tickFormat:"",
    },
    y: {
      label: "Einwohnerinnen (Anzahl)",
      tickFormat: d => d.toLocaleString(),     
    },
    marks: [
      Plot.barY(combinedData.filter((d, i, arr) => {
        if (width < 600) {
          const uniqueYears = [...new Set(arr.map(item => item.Jahr))];
          return uniqueYears.indexOf(d.Jahr) % 2 === 0;
        }
        return true;
      }), 
        {x: "Jahr", y: "Anzahl", fill: "Gruppe", 
        title: d => `Gruppe: ${d.Gruppe}\nJahr: ${d.Jahr}\nAnteil: ${(d.Anzahl.toLocaleString())}`,
        tip: true
      }),
      Plot.ruleY([0])
    ]
  })

  const rel = Plot.plot({
    width: width,
    color: { scheme: "Observable10", legend: true },
    x: {
      label: "Jahr",
      tickFormat:"",
    },
    y: {
      label: "Anteil (in Prozent %)",
      tickFormat: x => `${x * 100}%`
    },
    marks: [
      Plot.barY(combinedDataMitAnteil.filter((d, i, arr) => {
        if (width < 600) {
          const uniqueYears = [...new Set(arr.map(item => item.Jahr))];
          return uniqueYears.indexOf(d.Jahr) % 2 === 0;
        }
        return true;
      }), 
        {x: "Jahr", y: "Anteil", fill: "Gruppe", 
        title: d => `Gruppe: ${d.Gruppe}\nJahr: ${d.Jahr}\nAnteil: ${(d.Anteil * 100).toLocaleString(undefined, {maximumFractionDigits: 1})}%`,
        tip: true
        }),
      Plot.ruleY([0]),      
    ]
  });

  return toggled_value ? rel : abs;
}
