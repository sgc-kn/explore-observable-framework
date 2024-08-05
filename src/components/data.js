import {FileAttachment} from "npm:@observablehq/stdlib";
import * as d3 from "npm:d3";
import { selectedCityID } from './state-manager.js';
import { showInfo } from "./table.js";
import { updateMap } from "./map.js";
import { updateExtremes } from "./extremes.js";
import { updateVerticalBars } from "./vertical_bars.js";
import { updateFamilienStand } from "./familienstand.js";
import { updateStaatsAK } from "./deutsch.js";

export const data = await FileAttachment("../data/einwohner.csv").csv();
export const map_csv = await FileAttachment("../data/map.csv").csv();
export const geojson = await FileAttachment("../data/map.geojson").json(); 
export const familienstand_csv = await FileAttachment("../data/familienstand.csv").csv();
export const deutsch = await FileAttachment("../data/nichtdeutsch.csv").csv();

//group by STT
export const groupedData = d3.group(data, d => d.STT);

//default value "Gesamtstadt"
export const sortedData = Array.from(groupedData).sort((a, b) => {
    if (a[0] === "Gesamtstadt") return -1;
    if (b[0] === "Gesamtstadt") return 1;
    return a[0].localeCompare(b[0]);
});

// at the first place "Gesamtstadt"
export const combinedData = sortedData.flatMap(item => item[1]);

//get last year (for example "2023")
const years = data.map(item => {
    const year = parseInt(item.Jahr, 10);
    if (isNaN(year)) {
      console.error(`Invalid year value: ${item.Jahr}`);
    }
    return year;
}).filter(year => !isNaN(year)); // Filter out any invalid years
  
// Find the maximum year (z.B. '2023')
export const latestYear = Math.max(...years).toString();
//vorheriges Jahr aus letztes Jahr (z.B. '2022')
export const previousYear = (parseInt(latestYear, 10) - 1).toString();
// Find the first year (z.B. '1995')
export const earliestYear = Math.min(...years).toString();

// string to number 
export const convertStringToNumber = (data) => {
    return data.map(item => ({
        ...item,
        //Jahr: Number(item.Jahr),
        Einwohner: Number(item.Einwohner),
        Wachstum: parseFloat(item.Wachstum)
    }));
};       

//get array with number
export const convertedData = convertStringToNumber(combinedData);
//-----------------------------------------------------------------------//
//familienstand (familienstand_csv)
const groupedData_fs = d3.group(familienstand_csv, d => d.STT_ID);

function handleSttId(sttId) {
    const foundElement = Array.from(groupedData_fs).find(([key, _]) => key === sttId);  
    if (foundElement) {
        const familienStand_values = foundElement[1];    
        const transformedData = familienStand_values.flatMap(item => {
            const Jahr = item.Jahr;
            const Stadtteil = item.STT;
            const STT_ID = item.STT_ID;
            return [
                { STT_ID, Stadtteil, Jahr, status: "Geschieden", value: parseInt(item["Fam_Stand_Geschieden_LP_aufgehoben"], 10) },
                { STT_ID, Stadtteil, Jahr, status: "Verheiratet", value: parseInt(item["Fam_Stand_Verheiratet_Lebenspartnerschaft"], 10) },
                { STT_ID, Stadtteil, Jahr, status: "Gestorben", value: parseInt(item["Fam_Stand_Verwitwet_LP_gestorben"], 10) },
                { STT_ID, Stadtteil, Jahr, status: "Ledig", value: parseInt(item["Fam_Stand_ledig"], 10) },
                { STT_ID, Stadtteil, Jahr, status: "Unbekannt", value: parseInt(item["Fam_Stand_unbekannt"], 10) }
            ];
      });
      return transformedData;
    }
    return [];
}

function prozent_famStand(transformedData, STT_ID, latestYear){
    const transformedData_latestYear = transformedData.filter(d => d.STT_ID === STT_ID && d.Jahr === latestYear);    

    const totalValue_latestYear = transformedData_latestYear.reduce((sum, item) => sum + item.value, 0);
        
    const prozentFamStand = transformedData_latestYear.map(item => ({
        ...item,
        percentage: (item.value / totalValue_latestYear * 100).toFixed(2) 
    }));        
    return prozentFamStand
}
//-------------------------------------------------------------------------//
//Staatsangehörigkeit
//string to number
/*
const transformedData_SAK = deutsch.map(item => ({
    ...item, 
    Deutsch: Number(item.Deutsch),    
    Nichtdeutsch: Number(item.Nichtdeutsch),
    Wohnbev_insg: Number(item.Wohnbev_insg)
}));
*/

const groupedData_SAK = d3.group(deutsch, d => d.STT_ID);
console.log('groupedData_SAK', groupedData_SAK)

function handleSttId_SAK(sttId) {
    const foundElement = Array.from(groupedData_SAK).find(([key, _]) => key === sttId);
    
    if (foundElement) {
        const staatsAK_values = foundElement[1]; //array of objects       

        const transformed_SAK = staatsAK_values.flatMap(item => {
            const Jahr = item.Jahr;
            const Stadtteil = item.STT;
            const STT_ID = item.STT_ID;
                        
            return [
                { STT_ID, Stadtteil, Jahr, status: "Deutsch", value: parseInt(item.Deutsch, 10) },
                { STT_ID, Stadtteil, Jahr, status: "Sonstige", value: parseInt(item.Nichtdeutsch, 10) }
            ];
        });


        /*const transformed_SAK = staatsAK_values.flatMap(item => ({
            ...item, 
            Deutsch: Number(item.Deutsch),    
            Nichtdeutsch: Number(item.Nichtdeutsch),
            Wohnbev_insg: Number(item.Wohnbev_insg)
        }));*/
        
        return transformed_SAK;
    }
    return [];
}


//-------------------------------------------------------------------------//
//Subscribe to changes in the ID of the selected element
selectedCityID.subscribe(sttID => {    
    if (sttID) {
        //get array with data from last year / prev year
        const latestYearData = convertedData.find(d => d.STT_ID === sttID && d.Jahr === latestYear);        
        const previousYearData = convertedData.find(d => d.STT_ID === sttID && d.Jahr === previousYear);     
        const einwohner_Data = convertedData.filter(d => d.STT_ID === sttID);
        const maxValue = Math.max(...einwohner_Data.map(d => d.Einwohner));
        const minValue = Math.min(...einwohner_Data.map(d => d.Einwohner));
        const maxValueJahrEntries = einwohner_Data.filter(d => d.Einwohner === maxValue);
        const maxValueJahr = maxValueJahrEntries.map(d => d.Jahr);
        const minValueJahrEntries = einwohner_Data.filter(d => d.Einwohner === minValue);
        const minValueJahr = minValueJahrEntries.map(d => d.Jahr);
        //familienstand
        const transformedData = handleSttId(sttID);
        const prozentFamStandResult = prozent_famStand(transformedData, sttID, latestYear);
        
        const transformed_SAK = handleSttId_SAK(sttID);
                
        updateMap(sttID, geojson);
        if (latestYearData) {
            showInfo(latestYearData, previousYearData, maxValue, minValue, maxValueJahr, minValueJahr, prozentFamStandResult);
            updateExtremes(sttID, einwohner_Data, maxValue, minValue);
            updateVerticalBars(einwohner_Data);
            updateFamilienStand(transformedData);
            updateStaatsAK(transformed_SAK);
        }
    }
});
  
// Display data for the default value during initialization
const defaultID = selectedCityID.getValue();
const initialData_latestYear = convertedData.find(d => d.STT_ID === defaultID && d.Jahr === latestYear);
const initialData_previousData = convertedData.find(d => d.STT_ID === defaultID && d.Jahr === previousYear); 
const einwohner_Data = convertedData.filter(d => d.STT_ID === defaultID);
const maxValue = Math.max(...einwohner_Data.map(d => d.Einwohner));
const minValue = Math.min(...einwohner_Data.map(d => d.Einwohner));
const maxValueJahrEntries = einwohner_Data.filter(d => d.Einwohner === maxValue);
const maxValueJahr = maxValueJahrEntries.map(d => d.Jahr);
const minValueJahrEntries = einwohner_Data.filter(d => d.Einwohner === minValue);
const minValueJahr = minValueJahrEntries.map(d => d.Jahr);

//familienstand
const transformedData = handleSttId(defaultID);
const prozent_famStand_dv = prozent_famStand(transformedData, defaultID, latestYear);     

const transformed_SAK = handleSttId_SAK(defaultID);
console.log('transformed_SAK', transformed_SAK)

setTimeout(() => {
    showInfo(initialData_latestYear, initialData_previousData, maxValue, minValue, maxValueJahr, minValueJahr, prozent_famStand_dv);
    updateMap(defaultID, geojson);
    updateExtremes(defaultID, einwohner_Data, maxValue, minValue);
    updateVerticalBars(einwohner_Data);
    updateFamilienStand(transformedData);
    updateStaatsAK(transformed_SAK);
    
}, 100);


