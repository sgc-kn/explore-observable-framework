import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import { selectedCityID } from './state-manager.js';

let extremes_plot = null;

export function updateExtremes(selectedCityID, data, maxValue, minValue) {
    const container = document.getElementById('extremes');
    
    function renderPlot() {
        if (extremes_plot) {
            extremes_plot.remove();
        }
        const width = container.clientWidth;
        const new_extremes = Plot.plot({        
            //margin: 60,
            width: width, 
            title: "Bevölkerungsentwicklung in den Stadtteile ab 1995",
            marks: [
                Plot.ruleY([0], {stroke: "black"}),
        // Plot.axisX({fontSize: `${fontSizelabel}`, tickRotate: -45, fontFamily: `${fontFamily}`}),
        // Plot.axisY({fontSize: `${fontSizelabel}`, anchor: "right", ticks: 4, label: "Einwohner", fontFamily: `${fontFamily}`, tickFormat: d => d.toLocaleString('de-DE').replace(',', '.'), tickSize: 0 }),    
                Plot.lineY(data, {x: "Jahr", y: "Einwohner", stroke: "STT", strokeWidth: 4}),
                Plot.ruleX(data, Plot.pointerX({x: "Jahr", py: "Einwohner", stroke: "red"})),
                Plot.dot(data, Plot.pointerX({x: "Jahr", y: "Einwohner", stroke: "red"})),
                Plot.text(data, Plot.pointerX({px: "Jahr", py: "Einwohner", dy: -17, 
                frameAnchor: "top-left", fontSize: 16, fontWeight: .1, strokeWidth: 2,
            text: (d) => [
                `Stadtteile: ${d.STT}`,
                `Jahr: ${new Date(d.Jahr).getFullYear()}`, 
                `Einwohner: ${d.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
            ].join(", ")
            })),
            // Mark max value
            Plot.dot(data.filter(d => d.Einwohner === maxValue), 
            {x: "Jahr", y: "Einwohner", stroke: "orange", r: 3}), 
            Plot.text(data.filter(d => d.Einwohner === maxValue), 
            {x: "Jahr", y: "Einwohner", text: d => `Max: ${d.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}\n${d.Jahr}`, dy: 0, stroke: "orange", strokeWidth:0.7, fontSize: 20, fontWeight: 0.1,}),
            
            // Mark min value
            Plot.dot(data.filter(d => d.Einwohner === minValue), {x: "Jahr", y: "Einwohner", stroke: "black", r: 3}),
            Plot.text(data.filter(d => d.Einwohner === minValue), {x: "Jahr", y: "Einwohner", text: d => `Min: ${d.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}\n${d.Jahr}`,
            dy: 23, stroke: "green", fontVariant: "tabular-nums", fontSize: 20, fontWeight: 0.1, strokeWidth:0.7})    
            ],
            x: {
                label: "Jahr",
                tickRotate: -45, // drehen Jahr
                labelAnchor: "center", // move the label along the X axis
                labelOffset: 40, // move the label along the Y axis    
            },
            y: {
                grid: true, 
                nice: true,
                ticks: 4,
            }},
        )
        document.getElementById('extremes').appendChild(new_extremes);
        extremes_plot = new_extremes;
    }
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            renderPlot();
        }
    });

    resizeObserver.observe(container);
    renderPlot();
}