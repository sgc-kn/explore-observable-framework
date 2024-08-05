import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import { selectedCityID } from './state-manager.js';

//map - plot
let currentMap = null;

export function updateMap(cityId, geojson) {
  if (currentMap) {
    currentMap.remove();
  }
  const newMap = Plot.plot({
    height: 1200,
    width: 900,  
    x: {axis: null},
    y: {axis: null},
    marks: [
      Plot.geo(geojson, {
        fill: d => d.properties.STT_NR === cityId ? "var(--theme-foreground-focus)" : "var(--theme-foreground-muted)",       
        stroke: "var(--theme-background)",
        title: d => `${d.properties.STT_NAME}`,           
      }),   
    ]
  })  
  document.getElementById('map').appendChild(newMap);
  currentMap = newMap;

  d3.select(newMap).selectAll("path")
  .data(geojson.features)  
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
      const sttId = d.properties.STT_NR; 
      selectedCityID.next(sttId);
    }); 
}