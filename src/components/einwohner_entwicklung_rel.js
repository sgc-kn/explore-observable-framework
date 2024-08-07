import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import * as Inputs from "npm:@observablehq/inputs";
import { html } from "npm:htl";
/*
//checkbox
const colorArray = [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    "#393b79", "#637939", "#8c6d31", "#843c39", "#7b4173", "#5254a3", "#8ca252", "#bd9e39", "#ad494a", "#a55194"
  ];

//color for charts 
const colorScale = d3.scaleOrdinal(colorArray)
  .domain(d3.group(convertedData, d => d.STT_ID).keys());
  
  //add color to the array with Einwohner
convertedData.forEach(d => {
    d.color = colorScale(d.STT_ID);
});
*/
export function relativ_plot(einwohner_csv, stt_id, width) {
    const ts_data = d3.filter(einwohner_csv, (r) => r.STT_ID == stt_id);
    //console.log('ts_data', ts_data)
    return Inputs.checkbox(
        ts_data,
        {
            label: html`<div class="st-title">Stadtteile:</div>`,
            unique: true,
            format: x => x.STT,
            /*format: (entry) => {
                return Object.assign(document.createElement('span'), {
                    textContent: entry.key,
                    style: `border-bottom: 2px solid ${entry.color};`
                });
            },*/
            value: []
            //value: defaultValue // default value
        }
    )

}