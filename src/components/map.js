import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import { select } from "d3-selection";
import { map_csv, geojson, clearData, groupedData, latestYear, previousYear } from "./data.js";
import { updateSttId } from './emitter.js'; 

// to calculate %% on the map
const getGesamtstadt = groupedData.get("Gesamtstadt"); 
const gesamtEinwohner_latestYear = getGesamtstadt ? getGesamtstadt.find(d => d.Jahr === latestYear)?.Einwohner : "NaN";

//to get Shape__Area, Shape__Length from map_csv
const mapWithArea = {};
map_csv.forEach(item => {
  mapWithArea[item.STT_NR] = {
    Shape__Area: parseFloat(item.Shape__Area),
    Shape__Length: parseFloat(item.Shape__Length)
  };
});

//get an array with data for latestYear (z.B. '2023') 
export const filtered_DA_latestYear = clearData.filter(item => item.Jahr === latestYear);
//get an array with data for latestYear (z.B. '2022')
export const filtered_DA_previousYear = clearData.filter(item => item.Jahr === previousYear);
// Merge the arrays
const mergedFilteredData = [...filtered_DA_latestYear, ...filtered_DA_previousYear];

// merged arrays geojson + clearData
function mergeData(clearData, geojson, mapWithArea) {  
  const dataMap = {};
  
  //group by STT_ID and Jahr, and adding to the dataMap
  clearData.forEach(item => {
    if (!dataMap[item.STT_ID]) {
      dataMap[item.STT_ID] = {};
    }
    if (!dataMap[item.STT_ID][item.Jahr]) {
      dataMap[item.STT_ID][item.Jahr] = [];
    }
    dataMap[item.STT_ID][item.Jahr].push(item);
  });
  
  //searching STT_NR in geojson.features and matching with dataMap
  geojson.features.forEach(feature => {
    const stt_nr = feature.properties.STT_NR;
    const correspondingDataLatestYear = dataMap[stt_nr] ? dataMap[stt_nr][latestYear] : null;
    const correspondingDataPreviousYear = dataMap[stt_nr] ? dataMap[stt_nr][previousYear] : null;
    const additionalProps = mapWithArea[stt_nr];
    
    const combinedData = {};
    // Добавить данные за последний год, если они есть
    if (correspondingDataLatestYear) {
      correspondingDataLatestYear.forEach(item => {
        Object.keys(item).forEach(key => {
          combinedData[key + '_latestYear'] = item[key];
        });
      });
    }
    
    // Добавить данные за предыдущий год, если они есть
    if (correspondingDataPreviousYear) {
      correspondingDataPreviousYear.forEach(item => {
        Object.keys(item).forEach(key => {
          combinedData[key + '_previousYear'] = item[key];
        });
      });
    }
    
    // Добавить объединенные данные в свойства feature
    if (Object.keys(combinedData).length > 0) {
      const populationPercent = (combinedData.Einwohner_latestYear / gesamtEinwohner_latestYear) * 100; // %%
      feature.properties = { ...feature.properties, ...combinedData, populationPercent };
    } 
    //to add Shape__Area, Shape__Length to the geojson
    if (additionalProps) {
      feature.properties = { ...feature.properties, ...additionalProps };
      // Population density
      const areaInSqKm = additionalProps.Shape__Area / 1_000_000; // to sq.km.
      const populationDensity = correspondingDataLatestYear ? correspondingDataLatestYear[0].Einwohner / areaInSqKm : 0; // Einwohner pro sq.km.
      feature.properties.areaInSqKm = areaInSqKm.toFixed(1).replace('.', ','); //adding areaInSqKm to the geojson
      feature.properties.populationDensity = populationDensity.toFixed(0); //adding populationDensity to the geojson
    }    
  });
  return geojson;      
}

export const mergedData = mergeData(mergedFilteredData, geojson, mapWithArea); // merged arrays geojson + clearData
//console.log('mergedData', mergedData)

//map - plot
export const map = Plot.plot({
  height: 1200,
  width: 900,  
  x: {axis: null},
  y: {axis: null},  
  //projection: {type: "identity", domain: combined_Data_obj}, 
  marks: [
    Plot.geo(mergedData, {
      fill: "#a2c5dd",
      stroke: "white",
      title: d => `${d.properties.STT_NAME} \n ${d.properties.Einwohner_latestYear.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      //fill: d => d.properties.color,          
    }),    
    Plot.text(mergedData.features, 
    Plot.centroid(
  {
    text: (d) => [
      `${d.properties.STT_NAME}`,
      `${d.properties.Einwohner_latestYear.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}` ,
      `(${d.properties.populationPercent.toFixed(1).replace('.', ',')} %)`,
      `(${d.properties.populationDensity} / km²)`
    ].join("\n"),  

    fontextAnchor: "middle",
    fill: "#000000",
    fontWeight: "bold",
    fontSize: 12    
  }
))],
})


//get default value with STT_ID === "000" Gesamtstadt
export const defaultData = filtered_DA_latestYear.find(item => item.STT_ID === "000");

function showInfo(defaultData){ 
  const infoBox = d3.select("#infoBox");
  infoBox
    .style("display", "block")
    .html(`
      <table>
      <tr>
        <td>ID:</td>
        <td>${defaultData.STT_ID}</td>           
      </tr> 
      <tr>
        <td><h1 class="ort_name_card"> ${defaultData.STT} </h1> </td>
      </tr>
      <tr>
        <td>Gesamt der Einwohner im ${latestYear} :</td><td> ${defaultData.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} </td>
      </tr>        
      <tr>
        <td>Wachstum im Vergleich zu ${previousYear}:</td>
        <td > ${defaultData.Wachstum.toFixed(1).replace('.', ',')}% </td>          
      </tr>
      <tr>
        <td><a href="#" id="myBtn" >Familienstand im ${latestYear} </a>:</td>
        <td> Familienstand </td>          
      </tr> 
      </table>
    `);
}

//display default value with STT_ID === "000" Gesamtstadt
setTimeout(function (){  
  showInfo(defaultData);
}, 100)


d3.select(map).selectAll("path")
  .data(mergedData.features)  
  .on("mouseover", function(event, d) {
    d3.select(this)
      .transition()
      .duration(300)
      .ease(d3.easeLinear)
      .attr("opacity", 0.7)
      .attr("stroke-width", 3)
      .style("cursor", "pointer");  // cursor: pointer by hover    
  })  
  .on("mouseout", function(event, d) {
    d3.select(this)
      .transition()
      .duration(300)
      .ease(d3.easeLinear)
      .attr("opacity", 1)
      .attr("stroke-width", 1);    
  })
  .on("click", function(event, d){
    const infoBox = d3.select("#infoBox");
    //get STT_NR and 
    const sttId = d.properties.STT_NR;   
    updateSttId(sttId);
    infoBox
      .style("display", "block")
      .html(`
        <table>
          <tr>
            <td>ID:</td>
            <td>${d.properties.STT_NR}</td>           
          </tr> 
          <tr>
            <td><h1 class="ort_name_card"> ${d.properties.STT_NAME} </h1> </td>
          </tr>
          <tr>
            <td>Gesamt der Einwohner im ${latestYear} :</td><td> ${d.properties.Einwohner_latestYear.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} </td>
          </tr>
          <tr> 
            <td>Anteil der Einwohner im ${latestYear}:</td><td> ${d.properties.populationPercent.toFixed(1).replace('.', ',') }% </td>
          </tr>
          <tr>
            <td>Wachstum im Vergleich zu ${previousYear}:</td>          
              <td > ${d.properties.Wachstum_previousYear.toFixed(1).replace('.', ',')}% </td>
          </tr>
          <tr>
            <td>Fläche, km²:</td>
            <td>${d.properties.areaInSqKm} </td>          
          </tr>
          <tr>
            <td>Bevölkerungsdichte im ${latestYear}:</td>
            <td>${d.properties.populationDensity} </td>          
          </tr>
          <tr>
            <td><a href="#" id="status-link">Familienstand:</a></td>
            <td></td>          
          </tr>
        </table>
      `);
});

