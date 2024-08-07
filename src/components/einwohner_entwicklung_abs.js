import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function absolut_plot(einwohner_csv, stt_id, width) {
    const ts_data = d3.filter(einwohner_csv, (r) => r.STT_ID == stt_id);

    return Plot.plot({        
        width: width,
        x: {tickFormat: ""},
        marks: [
            Plot.rectY(ts_data, 
                { 
                x: "Jahr",
                y: "Einwohner", 
                fill: "var(--theme-foreground-focus)",  
                title: d => `Einwohner: ${d.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}` 
                }),          
            
            Plot.axisY({
                anchor: "left", 
                tickFormat: d => d.toLocaleString('de-DE').replace(',', '.'), 
                tickSize: 0,
                ticks: 4
            }), 
        
            Plot.text(ts_data, {
                x: d => d.Jahr, 
                y: d => d.Einwohner, 
                text: d => `${d.Wachstum.toFixed(1).replace('.', ',')}`, 
                textAnchor: "middle",
                dy: -15, 
                fill: d => d.Wachstum >= 0 ? "black" : "red",
            }),
        ]  
    })    
}
    
