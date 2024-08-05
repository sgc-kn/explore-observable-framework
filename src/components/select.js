import * as Inputs from "npm:@observablehq/inputs";
import * as d3 from "npm:d3";
import { html } from "npm:htl";
import { selectedCityID } from './state-manager.js';
import { combinedData } from "./data.js";

//get select
export const select_ort =  Inputs.select(
    //Array.from(d3.group(combinedData, d => d.STT).keys()),
    d3.group(combinedData, (d) => d.STT),    
  { label: html`<div class="st-title" id="stadtteil_select">Stadtteile:</div>`, unique: true }
)

//get STT_ID by STT from Select
select_ort.addEventListener("input", (event) => {
    const selectedCity = select_ort.value;
    const selectedID = selectedCity[0].STT_ID;
    selectedCityID.next(selectedID);
});