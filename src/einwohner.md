# Einwohner in Konstanz

<link rel="stylesheet" type="text/css" href="styles/einwohner.css">

```js
const data = FileAttachment("data/einwohner.csv").csv();
//const map = FileAttachment("data/map.csv").csv();
const geojson = FileAttachment("data/map.geojson").json(); 
```

```js
//display(data);
//display(map);
//display(geojson);
```
```js
//Inputs.table(data)
```
```js
const fontSize = 16
const fontFamily = 'Arial, sans-serif'
const yellowColor = '#efb118'
```
```js
// string to number
const clearData = data.map(item => {  
  return {
    ...item,
    Einwohner: item.Einwohner ? Number(item.Einwohner) : "NaN",
    //Jahr: item.Jahr && !isNaN(item.Jahr) ? parseInt(item.Jahr, 10) : "NaN",
    Wachstum: item.Wachstum ? parseFloat(item.Wachstum) : "NaN"    
  };
});
```

```js
// at the first place "Gesamtstadt"
const groupedData = d3.group(clearData, d => d.STT);
const sortedData = Array.from(groupedData).sort((a, b) => {
  if (a[0] === "Gesamtstadt") return -1;
  if (b[0] === "Gesamtstadt") return 1;
  return a[0].localeCompare(b[0]);
});
```
```js
// at the first place "Gesamtstadt"
const combinedData = sortedData.flatMap(item => item[1]);
```
```js
 //get last year (for example "2023")
//const latestYear = Math.max(...data.map(item => parseInt(item.Jahr, 10))).toString();
// 
const years = data.map(item => {
  const year = parseInt(item.Jahr, 10);
  if (isNaN(year)) {
    console.error(`Invalid year value: ${item.Jahr}`);
  }
  return year;
}).filter(year => !isNaN(year)); // Filter out any invalid years

// Find the maximum year
const latestYear = Math.max(...years).toString();

const earliestYear = Math.min(...years).toString();
//console.log(`Latest year: ${latestYear}`);
```
```js
html`
<div class="grid grid-cols-1" style="">
  <h1>Bevölkerungsstatistik der Stadtteile von Konstanz (${earliestYear}-${latestYear})</h1>
  <h2> <i> - Bevölkerungsentwicklung in den Stadtteile ab ${earliestYear} </i> </h2>
</div>
`
```
```js
//get select
const select_ort = view( 
  Inputs.select(
    d3.group(combinedData, (d) => d.STT),
    {label: html`<h2>Stadtteile:</h2>`, unique: true, fontSize: `${fontSize}`}
  )
);
```
```js
const ort = select_ort[0].STT; //"Gesamtstadt"

const einwohner = select_ort.filter(d => d.Jahr === latestYear.toString());
const maxValue = Math.max(...select_ort.map(d => d.Einwohner));
const maxValueJahrEntries = select_ort.filter(d => d.Einwohner === maxValue);
const maxValueJahr = maxValueJahrEntries.map(d => d.Jahr);

const minValue = Math.min(...select_ort.map(d => d.Einwohner));
const minValueJahrEntries = select_ort.filter(d => d.Einwohner === minValue);
const minValueJahr = minValueJahrEntries.map(d => d.Jahr);

const intermediateValue = (maxValue + minValue) / 2;
```
```js
html`
<div class="grid grid-cols-2" style="display: grid; grid-template-columns: 1.5fr 2.5fr; gap: 16px;">
  <div class="card">
    <h1 <span style="color: #efb118;">${ort}</h1>
    <p style="font-size: 16px;">Die Gesamtzahl der Einwohner im Jahr ${latestYear}: <span style="color: #efb118; font-size: 18px;">${einwohner[0].Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span></p>
    <p style="font-size: 16px;">Maximale Einwohnerzahl: <span style="color: #efb118; font-size: 18px;">${maxValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span> im Jahr <span style="color: #efb118; font-size: 18px;">${maxValueJahr}</span></p>
    <p style="font-size: 16px;">Manimale Einwohnerzahl : <span style="color: green; font-size: 18px;">${minValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} </span>im Jahr <span style="color: green; font-size: 18px;"> ${minValueJahr}</span></p>
  </div>
  <div class="card grid-rowspan-2" style="font-size: 16px;">${plotEinwohner} </div>
</div>
`
```
```js
//get chart with all Einwohner
const plotEinwohner = Plot.plot({  
  width: 850,
  margin: 60, 
  title: "Title des Chartes",
  marks: [
    Plot.ruleY([0], {stroke: "black"}),
    Plot.axisX({fontSize: `${fontSize}`, tickRotate: -45, fontFamily: `${fontFamily}`}),
    Plot.axisY({fontSize: `${fontSize}`, anchor: "right", ticks: 4, label: "Einwohner", fontFamily: `${fontFamily}`, tickFormat: d => d.toLocaleString('de-DE').replace(',', '.'), tickSize: 0
    }),    
    Plot.lineY(select_ort, {x: "Jahr", y: "Einwohner", stroke: "STT", strokeWidth: 4}),
    Plot.ruleX(select_ort, Plot.pointerX({x: "Jahr", py: "Einwohner", stroke: "red"})),
    Plot.dot(select_ort, Plot.pointerX({x: "Jahr", y: "Einwohner", stroke: "red"})),
    Plot.text(select_ort, Plot.pointerX({px: "Jahr", py: "Einwohner", dy: -17, 
    frameAnchor: "top-left", fontSize: `${fontSize}`, fontWeight: .1, strokeWidth: 2,
    text: (d) => [
      `Stadtteile: ${d.STT}`,
      `Jahr: ${new Date(d.Jahr).getFullYear()}`, 
      `Einwohner: ${d.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
    ].join(", ")
    })),
    // Mark max value
    Plot.dot(select_ort.filter(d => d.Einwohner === maxValue), 
    {x: "Jahr", y: "Einwohner", stroke: "orange", r: 3}), 
    Plot.text(select_ort.filter(d => d.Einwohner === maxValue), 
    {x: "Jahr", y: "Einwohner", text: d => `Max: ${d.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}\n${d.Jahr}`, dy: 0, stroke: "orange", strokeWidth:0.7, fontSize: 20, fontWeight: 0.1,}),
    
    // Mark min value
    Plot.dot(select_ort.filter(d => d.Einwohner === minValue), {x: "Jahr", y: "Einwohner", stroke: "black", r: 3}),
    Plot.text(select_ort.filter(d => d.Einwohner === minValue), {x: "Jahr", y: "Einwohner", text: d => `Min: ${d.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}\n${d.Jahr}`,
     dy: 23, stroke: "green", fontVariant: "tabular-nums", fontSize: 20, fontWeight: 0.1, strokeWidth:0.7})    
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
  }},
)
```
```js
//color for charts
const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
  .domain(d3.group(combinedData, d => d.STT).keys());
```
```js
//add color to the array with Einwohner
combinedData.forEach(d => {
  d.color = colorScale(d.STT);
});
```
```js
//add color to the array with Einwohner
combinedData.forEach(d => {
  d.color = colorScale(d.STT);
});
```
```js
//set default value
//group by STT
const groupedData_new = d3.group(combinedData, (d) => d.STT);

// set default value "Gesamtstadt"
const defaultSelections = [Array.from(groupedData_new.keys())[0]];

// create array key - value
const checkboxEntries = Array.from(groupedData_new.entries()).map(([key, values]) => ({
key: key,
values: values,
color: values[0].color
}));

const defaultValue = checkboxEntries.filter(entry => defaultSelections.includes(entry.key));
```

```js
html`
<div class="grid grid-cols-1" style="">
  <h1></h1>
  <h2> <i> - Prozentuale Bevölkerungsentwicklung in den Stadtteile im Vergleich zu ${earliestYear} </i> </h2>
</div>`
```
```js
//get checkbox
const check_orts = view(Inputs.checkbox(
  checkboxEntries,
  {
    label: html`<h2>Stadtteile:</h2>`,
    unique: true,
    format: (entry) => {
      return Object.assign(document.createElement('span'), {
        textContent: entry.key,
        style: `border-bottom: 2px solid ${entry.color}; font-size: 18px`
    });
  },
  value: defaultValue // default value 
  }
));
```

```js
let arr = check_orts.map(item => item.values);
const check_orts_pr = arr.flat(); //transform the data
//check_orts_pr = defaultSelections.flatMap(key => groupedData_new.get(key));
```
```js
//get chart with all   
const plot_checked = Plot.plot({  
    width: 1200,
    margin: 60,  
    marks: [
      Plot.ruleY([0], {stroke: "black"}),
      Plot.axisX({fontSize: `${fontSize}`, tickRotate: -45, fontFamily: `${fontFamily}`}),
      Plot.axisY({fontSize: `${fontSize}`, anchor: "right", fontFamily: `${fontFamily}`, tickFormat: d => d.toLocaleString('de-DE').replace('.', ','), tickSize: 0
      }),
      Plot.lineY(check_orts_pr, {x: "Jahr", y: "Wachstum", stroke: "STT", strokeWidth: 3, stroke: d => colorScale(d.STT)}),   
      Plot.ruleX(check_orts_pr, Plot.pointerX({x: "Jahr", py: "Wachstum", stroke: "red"})),
      Plot.dot(check_orts_pr, Plot.pointerX({x: "Jahr", y: "Wachstum", stroke: "red"})),
      Plot.text(check_orts_pr, Plot.pointerX({px: "Jahr", py: "Wachstum", dy: -17, 
      frameAnchor: "top-left", fontSize: `${fontSize}`, fontWeight: 0.1, strokeWidth: 2,
      text: (d) => [
        `Stadtteile: ${d.STT}`,
        `Jahr: ${new Date(d.Jahr).getFullYear()}`,
        `Wachstum: ${d.Wachstum.toFixed(1)} %`,      
        `Einwohner: ${d.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`    
      ].join(",")
      })),
      // Добавляем подписи названий к графику в одном месте для каждой линии
      ...d3.groups(check_orts_pr, d => d.STT).map(([key, values], i) =>
        Plot.text(
          [values[values.length - 1]], // выбираем последнюю точку для каждой группы
          {
            x: "Jahr",
            y: "Wachstum",
            text: d => d.STT,
            dx: 5, // смещение по X для отступа от точки
            dy: i * 15 - 30, // смещение по Y для отступа от точки с учетом индекса группы
            fontSize: `${fontSize}`,
            fontWeight: "bold",
            fill: colorScale(key) // цвет текста соответствует цвету линии
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
```
```js
html`
    <div id="chart_check"  class="grid grid-cols-1">
      <div class="card grid-rowspan-2">${plot_checked}</div>
    </div>`
```

```js
//display chart ????? 
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const isAnyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
//document.getElementById('chart_check').style.display = isAnyChecked ? 'block' : 'none';
```
```js
html`
<div class="grid grid-cols-1" style="">
  <h1></h1>
  <h2> <i> - Veränderung der Bevölkerung in den Stadtteile im Vergleich zu ${earliestYear} </i> </h2>
</div>`
```


```js
//get select
const select_ort_new = view( 
  Inputs.select(
    d3.group(combinedData, (d) => d.STT),
    {label: html`<h2>Stadtteile:</h2>`, unique: true}
  )
);
```
```js
html`
<div class="grid grid-cols-1" >
  <div class="card">
    ${einwohnerPlot}
  </div>  
</div>`
```

```js
//v-2
const parsedData = select_ort_new.map(d => ({
  ...d,
  Jahr: parseInt(d.Jahr)
}));
```
```js
const einwohnerPlot =  Plot.plot({
  height: 350,
  width: 1400,
  margin: 80,
  x: {label: "Jahr"},
  y: {label: "Einwohner", grid: 4},
  marks: [
    Plot.rectY(select_ort_new, 
      { x: "Jahr", y: "Einwohner", fill: "steelblue",  
      title: d => `Einwohner: ${d.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}` }),
    //Plot.dot(select_ort_new, { x: "Jahr", y: "Einwohner", stroke: "red", fill: "white", r: 6, thresholds: 20, title: d => `Einwohner: ${d.Einwohner}` }),
    Plot.axisX({fontSize: 20, tickRotate: -45, fontFamily: `${fontFamily}`}),
    Plot.axisY({fontSize: 20, anchor: "right", fontFamily: `${fontFamily}`, tickFormat: d => d.toLocaleString('de-DE').replace(',', '.'), tickSize: 0}), 

    Plot.text(select_ort_new, {
      x: d => d.Jahr, 
      y: d => d.Einwohner, 
      text: d => `${d.Wachstum.toFixed(1).replace('.', ',')}`, 
      textAnchor: "middle",
      dy: -15, 
      fill: d => d.Wachstum >= 0 ? "black" : "red", 
      fontSize: 18,
    }),
  ]  
})
```

```js
//table
const filteredData = select_ort_new.map(d => ({ 
  Stadtteil: d.STT, 
  Jahr: d.Jahr, 
  Einwohner: d.Einwohner.toLocaleString('de-DE'), //put a dot at the thousandth number
  "Wachstum%": d.Wachstum.toFixed(1).replace('.', ',')
}));
```
```js
const tableOptions = {
  sort: "Jahr",
  reverse: false,
  fontFamily: `${fontFamily}`,
  fontSize: `${fontSize}`
};
```
```js
const filteredData_table = select_ort_new.map(d => ({ 
  Stadtteil: d.STT, 
  Jahr: d.Jahr, 
  Einwohner: d.Einwohner.toLocaleString('de-DE'), //put a dot at the thousandth number
  "Wachstum%": d.Wachstum.toFixed(1).replace('.', ',')
}));

const previousYear = (parseInt(latestYear) - 1).toString();

const dataForYear = filteredData_table.filter(d => d.Jahr === latestYear);
const dataForPreviousYear = filteredData_table.filter(d => d.Jahr === previousYear);

const growthData = dataForYear.map(current => {
  const previous = dataForPreviousYear.find(prev => prev.Stadtteil === current.Stadtteil);
  const growthPercent = previous ? ((current.Einwohner - previous.Einwohner) / previous.Einwohner) * 100 : 0;
  
  return {
    Stadtteil: current.Stadtteil,
    Jahr: current.Jahr,
    Einwohner: current.Einwohner.toLocaleString('de-DE'),
    "Wachstum%": growthPercent.toFixed(2).replace('.', ',')
  };
});
```
```js
//card + table
html`
<div class="grid grid-cols-2" >
  ${growthData.map(d => {
    const growthValue = parseFloat(d["Wachstum%"].replace(',', '.'));
    const growthColor = growthValue > 0 ? 'green' : 'red';
    const growth = growthValue > 0 ? '↗︎' : ' ↘︎';
    return html`
      <div class="card">
        <h1 style="color: #efb118"> ${d.Stadtteil} </h1>
        <p>Die Gesamtzahl der Einwohner im Jahr ${d.Jahr}: <span style="color: #efb118; font-size: 18px;">${d.Einwohner}</span></p>
        <p>Wachstum: <span style="color: ${growthColor}; font-size: 18px;"> ${d["Wachstum%"]}% ${growth}</span>
        </p>  
      </div>`
  })}
      <div class="card" >    
        ${Inputs.table(filteredData_table, tableOptions)}
      </div>
</div>
`
```
```js
//get geojson daten

// Gefilterte GeoJSON-Daten für "states" ?????
const stateGeojson = geojson;
```
```js
//change ortname ?????
const updatedStateGeojson = {
  ...stateGeojson  
};
```
```js
//map
// to calculate %% on the map
const getGesamtstadt = groupedData.get("Gesamtstadt"); 
const gesamtEinwohner_latestYear = getGesamtstadt ? getGesamtstadt.find(d => d.Jahr === latestYear)?.Einwohner : "NaN"; 

//get an array with data for 2023
const filteredDataArray = clearData.filter(item => item.Jahr === latestYear);

// merged arrays geojson + clearData
function mergeData(clearData, geojson) {  
  const dataMap = {};
  clearData.forEach(item => {
    dataMap[item.STT_ID] = item;
  });  
  geojson.features.forEach(feature => {
    const stt_nr = feature.properties.STT_NR;
    const correspondingData = dataMap[stt_nr];
    if (correspondingData) {
      const populationPercent = (correspondingData.Einwohner / gesamtEinwohner_latestYear) * 100;
      feature.properties = { ...feature.properties, ...correspondingData, populationPercent };
    }
  });
  return geojson;
}
const mergedData = mergeData(filteredDataArray, geojson); // merged arrays geojson + clearData
```
```js
display(mergedData)
```
```js
//map - plot
const map = Plot.plot({
  height: 1200,
  width: 900,  
  x: {axis: null},
  y: {axis: null},  
  //projection: {type: "identity", domain: combined_Data_obj}, 
  marks: [
    Plot.geo(mergedData, {
      fill: "#bdd4e5",
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
      `(${d.properties.populationPercent.toFixed(1).replace('.', ',')} %)`
    ].join("\n"),  

    fontextAnchor: "middle",
    fill: "#000000",
    fontWeight: "bold",
    fontSize: 12    
  }
))],
})
```

```js 
html`
<div class="grid grid-cols-1">
  <h1></h1>
  <h2> <i>- Kennzahlen der Stadtteile im Jahr ${latestYear}</i></h2>
</div>
<div class="grid grid-cols-2" style="display: grid; grid-template-columns: 1.5fr 2.5fr; gap: 16px;">
  <div class="card" id="infoBox"> </div>
  <div class="card">
    ${document.body.appendChild(map)} 
  </div>
</div>`
```
```js

```
```js
const infoBox = d3.select("#infoBox");

d3.select(map).selectAll("path")
  .data(mergedData.features)  
  .on("mouseover", function(event, d) {
    d3.select(this)
      .transition()
      .duration(300)
      .ease(d3.easeLinear)
      .attr("opacity", 0.7)
      .attr("stroke-width", 3)
      .style("cursor", "pointer");  // Change cursor to pointer on hover    
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
    
    infoBox
      .style("display", "block")
      .html(`
        <table>
        <tr>
          <td>ID:</td>
          <td>${d.properties.STT_NR}</td>           
        </tr>
        <tr>
          <td><h1 style="color: ${yellowColor}"> ${d.properties.STT} </h1> </td>
        </tr>
        <tr>
          <td>Gesamt der Einwohner:</td><td> ${d.properties.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} </td>
        </tr>
        <tr> 
          <td>Anteil der Einwohner:</td><td> ${d.properties.populationPercent.toFixed(2).replace('.', ',') }% </td>
        </tr>
        <tr>
          <td>Wachstum im Vergleich zu ${earliestYear}:</td>
          <td > ${d.properties.Wachstum.toFixed(2).replace('.', ',')}% </td>          
        </tr>
        </table>
      `);      
  });

```

