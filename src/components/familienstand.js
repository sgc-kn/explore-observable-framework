import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

let familienStand_plot = null;

export function updateFamilienStand(data) {
    const container = document.getElementById('famStandPlot');
    
    function renderPlot() {
        if (familienStand_plot) {
            familienStand_plot.remove();
        }
        const width = container.clientWidth;

        const new_familienStand_plot = Plot.plot({
            title: "Familienstand (EinwohnerInnen ab 18 Jahre)",
            width: width,
            height: 600,
            y: { axis: null },
            x: { grid: true, ticks: 5, label: "Einwohner" },
            color: { scheme: "spectral", legend: true },
            marks: [
                Plot.barX(data, {
                    y: "status",
                    x: "value",
                    fill: "status",
                    fy: "Jahr",
                    sort: { color: null }
                }),
                Plot.ruleX([0])
            ]
        });
        document.getElementById('famStandPlot').appendChild(new_familienStand_plot);
        familienStand_plot = new_familienStand_plot;
        
    }    
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            renderPlot();
        }
    });

    resizeObserver.observe(container);
    renderPlot();
};