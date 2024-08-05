import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

let staatsAK = null;

export function updateStaatsAK(transformed_SAK) {

    const container = document.getElementById('StaatsAK');
    
    function renderPlot() {
        if (staatsAK) {
            staatsAK.remove();
        }
        const width = container.clientWidth;

        const new_staatsAK_plot = Plot.plot({
            title: "Staatsangehörigkeit",
            width: width,            
            y: { axis: null }, 
            x: { grid: true, ticks: 5, label: "Einwohner" }, 
            color: { scheme: "Paired", legend: true },
            marks: [
                Plot.barX(transformed_SAK, {
                    y: "status", 
                    x: "value",
                    fill: "status",
                    fy: "Jahr",
                    sort: { color: null }
                }),
                Plot.text(transformed_SAK, {
                    y: "status", 
                    x: "value",
                    fy: "Jahr",
                    text: d => d.value.toLocaleString(),
                    fill: "black",
                    textAnchor: "middle",
                    dy: 0,
                    dx: 15
                }),
                Plot.ruleX([0])
            ]
        });
        document.getElementById('StaatsAK').appendChild(new_staatsAK_plot);
        staatsAK = new_staatsAK_plot;
    }    
    
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            renderPlot();
        }
    });

    resizeObserver.observe(container);
    renderPlot();
}