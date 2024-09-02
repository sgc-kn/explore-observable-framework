import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function absolut_plot(einwohner_csv, stt_id, width) {
    const ts_data = d3.filter(einwohner_csv, (r) => r.STT_ID == stt_id);
    
    return Plot.plot({        
        width: width,
        marginLeft: 60,
        x: {
            label: "Jahr",
            tickFormat: "",
            labelOffset: 29
        },
        y: {
            label:"EinwohnerInnen (Anzahl)",
            grid: true,
            tickFormat: d => d.toLocaleString(),
        },
        marks: [
            Plot.rectY(ts_data.filter((d, i) => {
                if (width < 600) return i % 3 === 0;
                return true;
              }), 
                { 
                    x: "Jahr",
                    y: "Einwohner", 
                    fill: "var(--theme-foreground-focus)",  
                    title: d => `Jahr: ${d.Jahr}\nEinwohner: ${d.Einwohner.toLocaleString()}\nWachstum: ${d.Wachstum.toLocaleString(undefined, {maximumFractionDigits: 1})}%`,
                    tip: true 
                }
            ),          
        
            Plot.text(ts_data.filter((d, i) => {
                if (width < 600) return i % 3 === 0;
                return true;
              }), {
                x: d => d.Jahr, 
                y: d => d.Einwohner, 
                text: d => `${d.Wachstum.toLocaleString(undefined, {maximumFractionDigits: 1})}%`, 
                textAnchor: "middle",
                dy: -15, 
                fill: d => d.Wachstum >= 0 ? "var(--theme-green)" : "var(--theme-red)",
            }),
        ],          
    })    
}
    
