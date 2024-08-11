import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import * as Inputs from "npm:@observablehq/inputs";
import { html } from "npm:htl";
  
export function relativ_plot(einwohner_csv, select_ort, stt_id, width) {   
    const ts_data = d3.filter(einwohner_csv, (r) => r.STT_ID == stt_id);    
    
    if (select_ort) {
        const filteredData = select_ort.filter(d => d.STT_ID !== 0);
        ts_data.push(...filteredData);
    }
    
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(d3.group(ts_data, d => d.STT));
    
    ts_data.forEach(d => {
        d.color = colorScale(d.STT);
    });


    //add color to the array with Einwohner
   
    /* 
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(d3.group(ts_data, d => d.STT).keys());

    //add color to the array with Einwohner
    ts_data.forEach(d => {
        d.color = colorScale(d.STT);
    });
    */
    return Plot.plot({  
        width: width,
        color: {
            color: { scheme: "Observable10" },
            //domain: sortedData.map(([key]) => key)
        }
        ,
        marks: [
           // Plot.ruleY([0], {stroke: "black"}),
           // Plot.axisX({tickRotate: -45}),
            Plot.axisY({
                anchor: "left",
                tickFormat: d => d.toLocaleString('de-DE').replace('.', ','), 
                //tickSize: 0
            }),
            Plot.lineY(ts_data, 
                {x: "Jahr", y: "Wachstum", stroke: "STT", strokeWidth: 3, stroke: d => colorScale(d.STT)}),   
            Plot.ruleX(ts_data, Plot.pointerX({x: "Jahr", py: "Wachstum", stroke: "red"})),
            Plot.dot(ts_data, Plot.pointerX({x: "Jahr", y: "Wachstum", stroke: "red"})),
            Plot.text(ts_data, 
                Plot.pointerX({px: "Jahr", py: "Wachstum", dy: -17, frameAnchor: "top-left", fontWeight: 0.1, strokeWidth: 2,
                text: (d) => [
                    `Stadtteile: ${d.STT}`,
                    `Jahr: ${d.Jahr}`,
                    `Wachstum: ${d.Wachstum.toFixed(1)} %`,
                    `Einwohner: ${d.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`    
                ].join(", ")
            })),
            
            ...d3.groups(ts_data, d => d.STT).map(([key, values], i) =>
                Plot.text(
                [values[values.length - 1]], 
                {
                    x: "Jahr",
                    y: "Wachstum",
                    text: d => d.STT,
                    dx: 5, 
                    dy: i * 15 - 50,
                    fontWeight: "bold",
                    fill: colorScale(key)
                })
            ),
        ],
        x: {
            label: "Jahr",
            tickFormat: "",
            //tickRotate: -45, // drehen Jahr
            labelAnchor: "center", // move the label along the X axis
            labelOffset: 40, // move the label along the Y axis    
        }, 
        y: {    
            grid: true, 
            nice: true,
            ticks: 5,
        }
    },
)}