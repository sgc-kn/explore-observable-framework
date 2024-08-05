# Einwohner in Konstanz

```js
//<link rel="stylesheet" type="text/css" href="style/einwohner.css">
//import * as d3 from "npm:d3";
import * as Inputs from "npm:@observablehq/inputs";
import { html } from "npm:htl";
import { select_ort } from "./components/select.js"; //select
import { showInfo  } from "./components/table.js";
//import { stadtteil_check_input } from "./components/checked.js"
//import { check_orts, plot_checked } from "./components/checked.js";
```

```js
//show select
view(select_ort)
```
```js
```
```js
//map
html`<div class="container">      
      <div class="grid grid-cols-2">
        <div class="card" id="table"></div>
        <div class="card">
          <div id="map">
          </div>
        </div>
        
      </div>
      <div class="grid grid-cols-2">
        <div class="card">
          <div id="extremes">
          </div>
        </div>
        <div class="card">          
          <div id="verticalBars">
          </div>
        </div>
      </div>      
    </div>`
              //${document.body.appendChild(map)} 
```
```js
//view(check_orts);
```
```js
//map
html`<div class="container">
      <div class="grid grid-cols-1">
        ????
        <div class="card">          
          <div id="checkedPlot">
          </div>
        </div>
      </div>
    </div>`
              //${plot_checked}
              //${document.body.appendChild(map)} 
```

```js

html`<div class="container">
      <div class="grid grid-cols-2">        
        <div class="card">
          <div id="famStandPlot">
          </div>
        </div>
        <div class="card">
          <div id="StaatsAK">
          </div>
        </div>
      </div>
    </div>`
              //${plot_checked}
              //${document.body.appendChild(map)} 
```