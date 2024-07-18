import { groupedData } from "../einwohner"
//map

const getGesamtstadt = groupedData.get("Gesamtstadt");
const gesamtEinwohner2023 = getGesamtstadt ? getGesamtstadt.find(d => d.Jahr === "2023")?.Einwohner : "NaN";

//get Einwohner by STT_NAME in stateGeojson
const einwohner_map = updatedStateGeojson.features.map(feature => {
  const ort_name = feature.properties.STT_NAME;
  const populationData = groupedData.get(ort_name);

  const population2023 = populationData ? populationData.find(d => d.Jahr === "2023")?.Einwohner : "NaN";
  const percentage = population2023 !== "NaN" && gesamtEinwohner2023 !== "NaN"
    ? ((population2023 / gesamtEinwohner2023) * 100).toFixed(2)
    : "NaN";

    return {
      ort_name: ort_name,
      einwohner: population2023,
      percentage: percentage
    };
  }
);

// combined array
const combined_Data = updatedStateGeojson.features.map(feature => {
  const cityName = feature.properties.STT_NAME;
  const einwohnerData = einwohner_map.find(d => d.ort_name === cityName);
  return {
    ...feature,
    properties: {
      ...feature.properties,
      einwohner: einwohnerData ? einwohnerData.einwohner : "NaN",
      percentage: einwohnerData ? einwohnerData.percentage : "NaN"
    }
  };
});

//change "combined_Data" for Plot (from array to objekt) 
const combined_Data_obj = {
  type: "FeatureCollection",
  features: combined_Data
};


export default function PlotMap(combined_Data_obj) {
    return Plot.plot({
        height: 1200,
        width: 900,
        projection: {type: "identity", domain: combined_Data_obj},

    marks: [
        Plot.geo(combined_Data_obj, {
        fill: "white",
        stroke: "black",  
        }),
        Plot.text(combined_Data_obj.features, 
        Plot.centroid(
            {
            text: (d) => [
                `${d.properties.STT_NAME}`,
                `${d.properties.einwohner}` ,
                `(${d.properties.percentage} %)`
            ].join("\n"),
            fontextAnchor: "middle",
            fill: "red",
            fontWeight: "bold",
            fontSize: 12,     
            // transform: "scale(-1, -1)"
            }
        ))
    ],
    style: {  
        transformOrigin: "center",
        transform: "scale(1, -1)"
    }})
}
