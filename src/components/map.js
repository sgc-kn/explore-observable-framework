import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import { map_csv, geojson, clearData, groupedData, latestYear, earliestYear } from "./data.js";

//mapmergedData

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

//get an array with data for 2023
export const filteredDataArray = clearData.filter(item => item.Jahr === latestYear);

// merged arrays geojson + clearData
function mergeData(clearData, geojson, mapWithArea) {  
  const dataMap = {};
  clearData.forEach(item => {
    dataMap[item.STT_ID] = item;
  });  
  geojson.features.forEach(feature => {
    const stt_nr = feature.properties.STT_NR;
    const correspondingData = dataMap[stt_nr];
    const additionalProps = mapWithArea[stt_nr];
    
    //to add Einwohner to the geojson
    if (correspondingData) {
      const populationPercent = (correspondingData.Einwohner / gesamtEinwohner_latestYear) * 100; // %%
      feature.properties = { ...feature.properties, ...correspondingData, populationPercent };
    }
    //to add Shape__Area, Shape__Length to the geojson
    if (additionalProps) {
      feature.properties = { ...feature.properties, ...additionalProps };
      // Population density
      const areaInSqKm = additionalProps.Shape__Area / 1_000_000; // to sq.km.
      const populationDensity = correspondingData.Einwohner / areaInSqKm; // Einwohner pro sq.km.
      feature.properties.areaInSqKm = areaInSqKm.toFixed(1).replace('.', ','); //add areaInSqKm to the geojson
      feature.properties.populationDensity = populationDensity.toFixed(0); //add populationDensity to the geojson
    } 
  });
  return geojson;      
}
export const mergedData = mergeData(filteredDataArray, geojson, mapWithArea); // merged arrays geojson + clearData


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
      title: d => d.properties.STT_NR,
      //fill: d => d.properties.color,          
    }),    
    Plot.text(mergedData.features, 
    Plot.centroid(
  {
    text: (d) => [
      `${d.properties.STT}`,
      `${d.properties.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}` ,
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
export const defaultData = filteredDataArray.find(item => item.STT_ID === "000");
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
        <td>Wachstum im Vergleich zu ${earliestYear}:</td>
        <td > ${defaultData.Wachstum.toFixed(1).replace('.', ',')}% </td>          
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
    infoBox
      .style("display", "block")
      .html(`
        <table>
        <tr>
          <td>ID:</td>
          <td>${d.properties.STT_NR}</td>           
        </tr> 
        <tr>
          <td><h1 class="ort_name_card"> ${d.properties.STT} </h1> </td>
        </tr>
        <tr>
          <td>Gesamt der Einwohner im ${latestYear} :</td><td> ${d.properties.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} </td>
        </tr>
        <tr> 
          <td>Anteil der Einwohner im ${latestYear}:</td><td> ${d.properties.populationPercent.toFixed(1).replace('.', ',') }% </td>
        </tr>
        <tr>
          <td>Wachstum im Vergleich zu ${earliestYear}:</td>          
            <td > ${d.properties.Wachstum.toFixed(1).replace('.', ',')}% </td>
        </tr>
        <tr>
          <td>Fläche, km²:</td>
          <td>${d.properties.areaInSqKm} </td>          
        </tr>
        <tr>
          <td>Bevölkerungsdichte im ${latestYear}:</td>
          <td>${d.properties.populationDensity} </td>          
        </tr>
        </table>
      `);
  });  
 

  