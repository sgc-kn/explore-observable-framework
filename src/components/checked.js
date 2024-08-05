import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import * as Inputs from "npm:@observablehq/inputs";
import { html } from "npm:htl";
import { convertedData } from "./data.js";

const colorArray = [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    "#393b79", "#637939", "#8c6d31", "#843c39", "#7b4173", "#5254a3", "#8ca252", "#bd9e39", "#ad494a", "#a55194"
];

//color for charts 
const colorScale = d3.scaleOrdinal(colorArray)
.domain(d3.group(convertedData, d => d.STT).keys());

//add color to the array with Einwohner
convertedData.forEach(d => {
    d.color = colorScale(d.STT);
});

//set default value
//group by STT
const groupedData_new = d3.group(convertedData, (d) => d.STT);

// set default value "Gesamtstadt"
const defaultValue = [Array.from(groupedData_new.keys())[0]];

const checkboxEntries = Array.from(groupedData_new.entries()).map(([key, values]) => ({
    key: key,
    values: values,
    color: values[0].color
}));

const check_orts = Inputs.checkbox(
    checkboxEntries,
    {
        label: html`<div class="st-title">Stadtteile:</div>`,
        unique: true,
        format: (entry) => {
            return Object.assign(document.createElement('span'), {
                textContent: entry.key,
                style: `border-bottom: 2px solid ${entry.color};`
            });
        },
        value: defaultValue // default value
    }
);
const getSelectedData = () => {
  const selectedValues = check_orts.querySelectorAll('input[type="checkbox"]:checked');
  const selectedKeys = Array.from(selectedValues).map(input => input.value);
  console.log('Selected keys:', selectedKeys);
  const selectedData = convertedData.filter(d => selectedKeys.includes(d.STT));
  console.log('Selected data:', selectedData);
  return selectedData;
};

//get chart with all   
export const plot_checked = Plot.plot({  
    width: 1200,
    margin: 60,  
    marks: [
      Plot.ruleY([0], {stroke: "black"}),
      Plot.axisX({tickRotate: -45}),
      Plot.axisY({anchor: "right", tickFormat: d => d.toLocaleString('de-DE').replace('.', ','), tickSize: 0
      }),
      Plot.lineY(check_orts, {x: "Jahr", y: "Wachstum", stroke: "STT", strokeWidth: 3, stroke: d => colorScale(d.STT)}),   
      Plot.ruleX(check_orts, Plot.pointerX({x: "Jahr", py: "Wachstum", stroke: "red"})),
      Plot.dot(check_orts, Plot.pointerX({x: "Jahr", y: "Wachstum", stroke: "red"})),
      Plot.text(check_orts, Plot.pointerX({px: "Jahr", py: "Wachstum", dy: -17, 
      frameAnchor: "top-left", fontWeight: 0.1, strokeWidth: 2,
      text: (d) => [
        `Stadtteile: ${d.STT}`,
        `Jahr: ${new Date(d.Jahr).getFullYear()}`,
        `Wachstum: ${d.Wachstum} %`,      
        `Einwohner: ${d.Einwohner}`    
      ].join(",")
      })),
      
      ...d3.groups(check_orts, d => d.STT).map(([key, values], i) =>
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
          }
        )
      ),
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
      ticks: 5,
    }
  },
) 
