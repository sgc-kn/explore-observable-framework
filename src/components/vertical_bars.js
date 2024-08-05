import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

let vertical_plot = null;

export function updateVerticalBars(einwohner_Data) {
    const container = document.getElementById('verticalBars');
    
    function renderPlot() {
        if (vertical_plot) {
            vertical_plot.remove();
        }
    const width = container.clientWidth;

    const new_einwohnerPlot =  Plot.plot({
        title: "Bevölkerungsentwicklung in den Stadtteile ab 1995",
        x: {label: "Jahr"},
        y: {label: "Einwohner", grid: 4, ticks: 4},
        width: width,
        marginBottom: 50,
        marks: [
            Plot.rectY(einwohner_Data, 
                { 
                x: "Jahr", 
                y: "Einwohner", 
                fill: "var(--theme-foreground-focus)",  
                title: d => `Einwohner: ${d.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}` 
                }),
            //Plot.dot(select_ort_new, { x: "Jahr", y: "Einwohner", stroke: "red", fill: "white", r: 6, thresholds: 20, title: d => `Einwohner: ${d.Einwohner}` }),
            Plot.axisX({tickRotate: -45}),
            Plot.axisY({
                anchor: "left", 
                tickFormat: d => d.toLocaleString('de-DE').replace(',', '.'), 
                tickSize: 0,
                ticks: 4
            }), 
        
            Plot.text(einwohner_Data, {
                x: d => d.Jahr, 
                y: d => d.Einwohner, 
                text: d => `${d.Wachstum.toFixed(1).replace('.', ',')}`, 
                textAnchor: "middle",
                dy: -15, 
                fill: d => d.Wachstum >= 0 ? "black" : "red",
            }),
        ]  
    })
    document.getElementById('verticalBars').appendChild(new_einwohnerPlot);
    vertical_plot = new_einwohnerPlot;
    }
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            renderPlot();
        }
    });

    resizeObserver.observe(container);
    renderPlot();
}  