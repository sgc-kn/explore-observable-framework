# Einwohner in Konstanz

We load the data as defined in `src/data/pkel-test.csv.py`. This Python
script extracts a relevant subset of `data/merged_speed.csv`.

```js
const data = FileAttachment("data/einwohner.csv").csv();

display(data)
```
```js
const map = FileAttachment("data/map.csv").csv();
```
```js
display(map)
```
```js
display(data)
```
The framework allows us to render the whole table.

```js
const geojson = FileAttachment("data/map.geojson").json();
```
```js
display(geojson);
```


```js
Inputs.table(data)
```
---
s
```js
const fontSize = 16
const fontFamily = 'Arial, sans-serif'
const yellowColor = '#efb118'
```
We can also write arbitrary **Markdown**.

And create plots with Observable Plot. This is a basic scatter plot.

```js
// string to number
const clearData = data.map(item => {
  return {
      ...item,
      //Jahr: Number(item.Jahr),
      Einwohner: Number(item.Einwohner),
      WachstumPCT: parseFloat(item.WachstumPCT)
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
const combinedData = sortedData.flatMap(item => item[1]);
```
```js
//get select
const select_ort = view( 
  Inputs.select(
    d3.group(combinedData, (d) => d.STT),
    {label: "Ort:", unique: true}
  )
);
```
```js
const ort = select_ort[0].STT;
const einwohner = select_ort.filter(d => d.Jahr === "2023");
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
    <p>Die Gesamtzahl der Einwohner im Jahr 2023: <span style="color: #efb118; font-size: 18px;">${einwohner[0].Einwohner}</span></p>
    <p>Maximale Einwohnerzahl im Jahr ${maxValueJahr}: <span style="color: #efb118; font-size: 18px;">${maxValue}</span></p>
    <p>Manimale Einwohnerzahl im Jahr ${minValueJahr}: <span style="color: green; font-size: 18px;">${minValue}</span></p>
  </div>
  <div class="card grid-rowspan-2">${plotEinwohner} </div>
</div>
`
```
```js
//get chart with all Einwohner
const plotEinwohner = Plot.plot({
  
  width: 850,
  margin: 60, 
  marks: [
    Plot.ruleY([0], {stroke: "orange"}),
    Plot.axisX({fontSize: `${fontSize}`, tickRotate: -45, fontFamily: `${fontFamily}`}),
    Plot.axisY({fontSize: `${fontSize}`, anchor: "right", ticks: 4, label: "Einwohner", fontFamily: `${fontFamily}`, tickFormat: d => d.toLocaleString('de-DE').replace(',', '.')
    }),    
    Plot.lineY(select_ort, {x: "Jahr", y: "Einwohner", stroke: "STT", strokeWidth: 4}),
    Plot.ruleX(select_ort, Plot.pointerX({x: "Jahr", py: "Einwohner", stroke: "red"})),
    Plot.dot(select_ort, Plot.pointerX({x: "Jahr", y: "Einwohner", stroke: "red"})),
    Plot.text(select_ort, Plot.pointerX({px: "Jahr", py: "Einwohner", dy: -17, 
    frameAnchor: "top-left", fontSize: `${fontSize}`, fontWeight: .1, strokeWidth: 2,
    text: (d) => [
      `Ort: ${d.STT}`,
      `Jahr: ${new Date(d.Jahr).getFullYear()}`, 
      `Einwohner: ${d.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
    ].join(", ")
    })),
    // Mark max value
    Plot.dot(select_ort.filter(d => d.Einwohner === maxValue), 
    {x: "Jahr", y: "Einwohner", stroke: "orange", r: 3}), 
    Plot.text(select_ort.filter(d => d.Einwohner === maxValue), 
    {x: "Jahr", y: "Einwohner", text: d => `Max: ${d.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`, dy: -10, stroke: "orange", strokeWidth:0.7, fontSize: `${fontSize}`, fontWeight: 0.1,}),
    
    // Mark min value
    Plot.dot(select_ort.filter(d => d.Einwohner === minValue), {x: "Jahr", y: "Einwohner", stroke: "black", r: 3}),
    Plot.text(select_ort.filter(d => d.Einwohner === minValue), {x: "Jahr", y: "Einwohner", text: d => `Min: ${d.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`, dy: 10, stroke: "green", fontVariant: "tabular-nums", fontSize: `${fontSize}`, fontWeight: 0.1, strokeWidth:0.7})    
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
  },  
  },
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
const groupedData_new = d3.group(combinedData, (d) => d.STT);
```
```js
//get checkbox
const check_orts = view(Inputs.checkbox(
  Array.from(groupedData_new.entries()).map(([key, values]) => ({
    key: key,
    values: values,
    color: values[0].color
  })),
  {
    label: "Ort:",
    unique: true,
    format: (entry) => {
      return Object.assign(document.createElement('span'), {
        textContent: entry.key,
        style: `border-bottom: 2px solid ${entry.color};`
      });
    }
  }
));
```
```js
let arr = check_orts.map(item => item.values);
const check_orts_pr = arr.flat(); //transform the data

//const einwohner = check_orts.filter(d => d.Jahr === "2023");
const ORT_ = check_orts_pr.map(d => d.STT);
const maxValue_checked = Math.max(...check_orts_pr.map(d => d.WachstumPCT));

const maxValueJahrEntries_checked = check_orts_pr.filter(d => d.Einwohner === maxValue_checked);
const maxValueJahr_checked = maxValueJahrEntries_checked.map(d => d.Jahr);

const minValue_checked = Math.min(...check_orts_pr.map(d => d.WachstumPCT));
//const minValueJahrEntries = select_ort.filter(d => d.Einwohner === minValue);
//const minValueJahr = minValueJahrEntries.map(d => d.Jahr);
```

```js

```
```js
  display(ORT_)
```
```js
html`
  <div class="grid" style="display: grid; grid-template-columns: 1.5fr 2.5fr; gap: 16px;">    
    <div class="card">
      1
    </div>  
    <div class="card grid-rowspan-2">${plot_check}</div>
  </div>`
```


```js
//get chart with all 
const plot_check = Plot.plot({  
  width: 850,
  margin: 60,  
  marks: [
    Plot.ruleY([0], {stroke: "black"}),
    Plot.axisX({fontSize: `${fontSize}`, tickRotate: -45, fontFamily: `${fontFamily}`}),
    Plot.axisY({fontSize: `${fontSize}`, anchor: "right", fontFamily: `${fontFamily}`, tickFormat: d => d.toLocaleString('de-DE').replace('.', ',')
    }),
    Plot.lineY(check_orts_pr, {x: "Jahr", y: "WachstumPCT", stroke: "STT", strokeWidth: 3, stroke: d => colorScale(d.STT)}),   
    Plot.ruleX(check_orts_pr, Plot.pointerX({x: "Jahr", py: "WachstumPCT", stroke: "red"})),
    Plot.dot(check_orts_pr, Plot.pointerX({x: "Jahr", y: "WachstumPCT", stroke: "red"})),
    Plot.text(check_orts_pr, Plot.pointerX({px: "Jahr", py: "WachstumPCT", dy: -17, 
    frameAnchor: "top-left", fontSize: `${fontSize}`, fontWeight: 0.1, strokeWidth: 2,
    text: (d) => [
      `Ort: ${d.STT}`,
      `Jahr: ${new Date(d.Jahr).getFullYear()}`,
      `Wachstum: ${d.WachstumPCT.toFixed(2)} %`,      
      `Einwohner: ${d.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`    
    ].join(",")
    })),      
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
  },
  },
)
```
```js
//get select
const select_ort_new = view( 
  Inputs.select(
    d3.group(combinedData, (d) => d.STT),
    {label: "Ort:", unique: true}
  )
);
```
```js
const einwohnerPlot = Plot.plot({
  height: 350,
  width: 1400,
  margin: 80,  
  x: {
    label: "Jahr",
    tickRotate: -45,    
  },
  y: {    
    label: "Einwohner",
    grid: 4
  },
  marks: [
    Plot.ruleY([0]),
    Plot.axisX({fontSize: 20, tickRotate: -45, fontFamily: `${fontFamily}`}),
    Plot.axisY({fontSize: 20, anchor: "right", fontFamily: `${fontFamily}`, tickFormat: d => d.toLocaleString('de-DE').replace(',', '.')}),  
    Plot.barY(select_ort_new, {
      x: "Jahr",
      y: "Einwohner",
      sort: { x: "x", reverse: false },
      fill: "steelblue",
    }),
    // legends (%) above columns
    Plot.text(select_ort_new, {
      x: d => d.Jahr, 
      y: d => d.Einwohner, 
      text: d => `${d.WachstumPCT.toFixed(2).replace('.', ',')}`, 
      textAnchor: "middle",
      dy: -15, 
      fill: d => d.WachstumPCT >= 0 ? "black" : "red", 
      fontSize: 18,
    }),      
  ]
})
```
```js
html`
<div class="grid grid-cols-1">
  <div class="card">
    ${einwohnerPlot}
  </div>  
</div>`
```
```js
const filteredData = select_ort_new.map(d => ({ 
  Stadtteil: d.STT, 
  Jahr: d.Jahr, 
  Einwohner: d.Einwohner.toLocaleString('de-DE'), //put a dot at the thousandth number
  "Wachstum%": d.WachstumPCT.toFixed(2).replace('.', ',')
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
  "Wachstum%": d.WachstumPCT.toFixed(2).replace('.', ',')
}));
const year = "2023";
const previousYear = "2022";

const dataForYear = filteredData_table.filter(d => d.Jahr === year);
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
//table
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
function filterStates(geojson) {
  return {
    ...geojson,
    features: geojson.features.filter(feature => feature.properties.STT_NAME)
  };
}
// Gefilterte GeoJSON-Daten für "states"
const stateGeojson = filterStates(geojson);
```

```js
//map
Plot.plot({
  width: 975,
  height: 610,
  projection: "identity",
  color: {
    type: "quantize",
    n: 9,
    domain: [1, 10],
    scheme: "blues",
    label: "Unemployment rate (%)",
    legend: true
  },
  marks: [
    Plot.geo(stateGeojson, {fill: "lightgrey", stroke: "white", strokeWidth: 0.5})
  ]
})
```