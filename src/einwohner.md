# Einwohner in Konstanz

We load the data as defined in `src/data/pkel-test.csv.py`. This Python
script extracts a relevant subset of `data/merged_speed.csv`.

```js
const data = FileAttachment("data/einwohner.csv").csv();

display(data)
```

`data` json object:

```js
display(data)

```

The framework allows us to render the whole table.

```js
Inputs.table(data)
```
---

```js
const fontSize = 16

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
display(clearData)
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
const maxValue = Math.max(...select_ort.map(d => d.Einwohner));
const minValue = Math.min(...select_ort.map(d => d.Einwohner));
const intermediateValue = (maxValue + minValue) / 2;
```
```js
//get chart with all Einwohner
Plot.plot({
  height: 350,
  width: 850,
  margin: 60, 
  marks: [
    Plot.ruleY([0], {stroke: "orange"}),
    Plot.axisX({fontSize: `${fontSize}`, tickRotate: -45,}),
    Plot.axisY({fontSize: `${fontSize}`, anchor: "right", ticks: 4, label: "Einwohner", tickFormat: d => d.toLocaleString('de-DE').replace(',', '.')
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
    Plot.dot(select_ort.filter(d => d.Einwohner === minValue), {x: "Jahr", y: "Einwohner", stroke: "yellow", r: 3}),
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
//const uniqueKeys = Array.from(d3.group(combinedData, d => d.STT).keys());
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
```

```js
//get chart with all 
Plot.plot({
  height: 350,
  width: 850,
  margin: 60,  
  marks: [
    Plot.ruleY([0], {stroke: "black"}),
    Plot.axisX({fontSize: `${fontSize}`, tickRotate: -45,}),
    Plot.axisY({fontSize: `${fontSize}`, anchor: "right", tickFormat: d => d.toLocaleString('de-DE').replace('.', ',')
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
Plot.plot({
  height: 250,
  width: 1400,
  margin: 60,  
  x: {
    label: "Jahr",
    tickRotate: -45
  },
  y: {    
    label: "Einwohner",    
    grid: 4         
  },
  marks: [
    Plot.ruleY([0]),
    Plot.axisX({fontSize: `${fontSize}`, tickRotate: -45}),
    Plot.axisY({fontSize: `${fontSize}`, anchor: "left", tickFormat: d => d.toLocaleString('de-DE').replace(',', '.')}),  
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
      fontSize: `${fontSize}`,
    })    
  ]
})
```
```js
const filteredData = select_ort_new.map(d => ({ 
  STT: d.STT, 
  Jahr: d.Jahr, 
  Einwohner: d.Einwohner.toLocaleString('de-DE'), //put a dot at the thousandth number
  Wachstum: d.WachstumPCT.toFixed(2).replace('.', ',')
}));
```
```js
Inputs.table(
  filteredData,  
  {sort: "Jahr", reverse: false}
)
```






