# Einwohner in Konstanz
<link rel="stylesheet" type="text/css" href="style/einwohner.css">

```js
import { data, map_csv, geojson, fontSizelabel, fontFamily, yellowColor, clearData, groupedData, sortedData, combinedData, latestYear, earliestYear} from "./components/data.js";
import { map, mergedData, filteredDataArray, defaultData } from "./components/map.js";
import { initializeModal, familienStand_plot, familienStand_plot_2, closeModal, openAdditinaInfo} from "./components/familienstand.js";

```
```js
document.getElementById('closeModalWind').addEventListener('click', closeModal);
document.getElementById('toggle_info_link').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the default link behavior
  openAdditinaInfo();
});
```
```js
html`<div id="myModal" class="modal">
  <div class="modal-content">
    <span class="close" id="closeModalWind">&times;</span>
    <div id="modalTableContainer">
      <div id="familienStand_plot" class="card"></div>      
      <div id="additional_info"> 
        <a href="#" id="toggle_info_link"> Mehr erfahren <span>&raquo;</span> </a>
        <div id="familienStand_table" class="card"></div>
      </div>
    </div>
  </div>
</div>`

```

```js
/*
//initializeModal(table);
//document.getElementById("familienStand_plot").appendChild(plot);
  // Получаем элементы
  var modal = document.getElementById("myModal");
  var btn = document.getElementById("myBtn");
  var span = document.getElementsByClassName("close")[0];
  var modalTableContainer = document.getElementById("modalTableContainer");
 // var familienStand_plot = document.getElementById("familienStand_plot");
  
  modalTableContainer.appendChild(table);
  familienStand_plot.appendChild(familienStand_plot);
  // Когда пользователь кликает на кнопку, открываем модальное окно
  d3.select("#myBtn").on("click", function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение ссылки
    modal.style.display = "block";    
  });

  // Когда пользователь кликает на <span> (x), закрываем модальное окно
  d3.select(".close").on("click", function() {
    modal.style.display = "none";    
  });

  // Когда пользователь кликает вне модального окна, закрываем его
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";      
    }
  }; */
```

```js
//map
html`<div class="grid grid-cols-1">
      <h1></h1>
      <h2 class="category-title"> <i>- Kennzahlen der Stadtteile im Jahr ${latestYear}</i></h2>
    </div>
    <div class="grid grid-cols-2" style="display: grid; grid-template-columns: 1.5fr 2.5fr; gap: 16px;">
      <div class="card" id="infoBox"> </div>
      <div class="card">
        ${document.body.appendChild(map)} 
      </div>
    </div>`
```
```js
display(mergedData)
//display(groupedData)
//display(defaultData)
```

```js
//<h1>Bevölkerungsstatistik der Stadtteile von Konstanz (${earliestYear}-${latestYear})</h1>
```
```js
html`
<div class="grid grid-cols-1" style="">
  <h1></h1>
  <h2 class="category-title"> <i> - Bevölkerungsentwicklung in den Stadtteile ab ${earliestYear} </i> </h2>
</div>
`
```
```js
//get select
const select_ort = view( 
  Inputs.select(
    d3.group(combinedData, (d) => d.STT),
    {label: html`<div class="st-title">Stadtteile:</div>`, unique: true, fontSize: `${fontSizelabel}`}
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
    <h1 class="ort_name_card"> <span class="stadtteil_name">${ort}</span></h1>
    <table>
      <tr>
        <td ><span class="field_name">Die Gesamtzahl der Einwohner im Jahr ${latestYear}: </span></td>
        <td><span style="color: ${yellowColor}; font-size: ${fontSizelabel}px;">${einwohner[0].Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span></td>
      </tr>
      <tr>
        <td><span class="field_name" >Maximale Einwohnerzahl im Jahr <span style="color: ${yellowColor};">${maxValueJahr}</span>: </span></td>
        <td><span style="color: ${yellowColor}; font-size: ${fontSizelabel}px;">${maxValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span></td>
      </tr>
      <tr>
        <td><span class="field_name">Manimale Einwohnerzahl im Jahr <span style="color: green; font-size: ${fontSizelabel}px;"> ${minValueJahr} </span>:</span></td>
        <td><span style="color: green; font-size: ${fontSizelabel}px;">${minValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} </span></td>
      </tr>
    </table>
  </div>
  <div class="card grid-rowspan-2" class="field_name">${plotEinwohner} </div>
</div>
`
```
```js
//get chart with all Einwohner
const plotEinwohner = Plot.plot({  
  width: 850,
  margin: 60, 
  title: "Bevölkerungsentwicklung in den Stadtteile ab 1995",
  marks: [
    Plot.ruleY([0], {stroke: "black"}),
    Plot.axisX({fontSize: `${fontSizelabel}`, tickRotate: -45, fontFamily: `${fontFamily}`}),
    Plot.axisY({fontSize: `${fontSizelabel}`, anchor: "right", ticks: 4, label: "Einwohner", fontFamily: `${fontFamily}`, tickFormat: d => d.toLocaleString('de-DE').replace(',', '.'), tickSize: 0
    }),    
    Plot.lineY(select_ort, {x: "Jahr", y: "Einwohner", stroke: "STT", strokeWidth: 4}),
    Plot.ruleX(select_ort, Plot.pointerX({x: "Jahr", py: "Einwohner", stroke: "red"})),
    Plot.dot(select_ort, Plot.pointerX({x: "Jahr", y: "Einwohner", stroke: "red"})),
    Plot.text(select_ort, Plot.pointerX({px: "Jahr", py: "Einwohner", dy: -17, 
    frameAnchor: "top-left", fontSize: `${fontSizelabel}`, fontWeight: .1, strokeWidth: 2,
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
html`
<div class="grid grid-cols-1" style="">
  <h1></h1>
  <h2 class="category-title"> <i> - Prozentuale Bevölkerungsentwicklung in den Stadtteile im Vergleich zu ${earliestYear} </i> </h2>
</div>`
```
```js
//color for charts
const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
  .domain(d3.group(combinedData, d => d.STT).keys());

//add color to the array with Einwohner
combinedData.forEach(d => {
  d.color = colorScale(d.STT);
});

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
//get checkbox
const check_orts = view(Inputs.checkbox(
  checkboxEntries,
  {
    label: html`<div class="st-title">Stadtteile:</div>`,
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


//display chart ????? 
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const isAnyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
//document.getElementById('chart_check').style.display = isAnyChecked ? 'block' : 'none';
```
```js
//get chart with all   
const plot_checked = Plot.plot({  
    width: 1200,
    margin: 60,  
    marks: [
      Plot.ruleY([0], {stroke: "black"}),
      Plot.axisX({fontSize: `${fontSizelabel}`, tickRotate: -45, fontFamily: `${fontFamily}`}),
      Plot.axisY({fontSize: `${fontSizelabel}`, anchor: "right", fontFamily: `${fontFamily}`, tickFormat: d => d.toLocaleString('de-DE').replace('.', ','), tickSize: 0
      }),
      Plot.lineY(check_orts_pr, {x: "Jahr", y: "Wachstum", stroke: "STT", strokeWidth: 3, stroke: d => colorScale(d.STT)}),   
      Plot.ruleX(check_orts_pr, Plot.pointerX({x: "Jahr", py: "Wachstum", stroke: "red"})),
      Plot.dot(check_orts_pr, Plot.pointerX({x: "Jahr", y: "Wachstum", stroke: "red"})),
      Plot.text(check_orts_pr, Plot.pointerX({px: "Jahr", py: "Wachstum", dy: -17, 
      frameAnchor: "top-left", fontSize: `${fontSizelabel}`, fontWeight: 0.1, strokeWidth: 2,
      text: (d) => [
        `Stadtteile: ${d.STT}`,
        `Jahr: ${new Date(d.Jahr).getFullYear()}`,
        `Wachstum: ${d.Wachstum.toFixed(1)} %`,      
        `Einwohner: ${d.Einwohner.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`    
      ].join(",")
      })),
      
      ...d3.groups(check_orts_pr, d => d.STT).map(([key, values], i) =>
        Plot.text(
          [values[values.length - 1]], 
          {
            x: "Jahr",
            y: "Wachstum",
            text: d => d.STT,
            dx: 5, 
            dy: i * 15 - 50, 
            fontSize: `${fontSizelabel}`,
            fontWeight: "bold",
            fill: colorScale(key)
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
//checkbox 
html`
    <div id="chart_check"  class="grid grid-cols-1">
      <div class="card grid-rowspan-2">${plot_checked}</div>
    </div>`
```
```js
html`
<div class="grid grid-cols-1" style="">
  <h1></h1>
  <h2 class="category-title"> <i> - Veränderung der Bevölkerung in den Stadtteile im Vergleich zu ${earliestYear} </i> </h2>
</div>`
```


```js
//get select
const select_ort_new = view( 
  Inputs.select(
    d3.group(combinedData, (d) => d.STT),
    {label: html`<div class="st-title">Stadtteile:</div>`, unique: true}
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
  fontSize: `${fontSizelabel}`
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
        <h1 class="ort_name_card"> ${d.Stadtteil} </h1>
        <table>
          <tr>
            <td><span class="field_name">Die Gesamtzahl der Einwohner im Jahr ${d.Jahr}: </span></td>
            <td><span style="color: ${yellowColor}; font-size: ${fontSizelabel}px;">${d.Einwohner}</span></td>
          </tr>
          <tr>
            <td><span class="field_name">Wachstum: </span></td>
            <td><span style="color: ${growthColor}; font-size: ${fontSizelabel}px;"> ${d["Wachstum%"]}% ${growth}</span></td>
          </tr>
        </table>      
         
        </p>
      </div>`
  })}
    <span>
      <div class="card" class="tableStyle">       
        ${Inputs.table(filteredData_table, tableOptions)}        
      </div>
    <span>  
</div>
`
```


