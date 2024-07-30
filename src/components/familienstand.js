import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import * as Inputs from "npm:@observablehq/inputs";
import { familienstand_csv } from "./data.js";
import { sttIdObservable } from './emitter.js';

//group by STT_ID
const familienStand_gb = d3.group(familienstand_csv, d => d.STT_ID);
const familienStand_array = Array.from(familienStand_gb.entries()).map(([key, values]) => ({
  key: key,
  values: values    
}));
/// get 000
const dataObjectForKey000 = familienStand_array.find(item => item.key === '000')?.values || [];
// Object to array
export const dataArrayForKey000 = Object.values(dataObjectForKey000);

//-------------------------------------------------------------------------------------------

//get ID by clicking on Stadtteil map from map.js
sttIdObservable.subscribe(sttId => {
  if (sttId !== null) {
    const transformedData = handleSttId(sttId);
    createPlot(transformedData);
    createTable(transformedData);
    openModal();
  }
});

// get familienStand_array for Chart
function handleSttId(sttId) {
  const foundElement = familienStand_array.find(element => element.key === sttId);  
  if (foundElement) {
    const familienStand_values = foundElement.values;    
    const transformedData = familienStand_values.flatMap(item => {
      const year = item.Jahr;
      const Stadtteil = item.STT;
      return [
        { Stadtteil, year, status: "Geschieden", value: parseInt(item["Fam_Stand_Geschieden_LP_aufgehoben"], 10) },
        { Stadtteil, year, status: "Verheiratet", value: parseInt(item["Fam_Stand_Verheiratet_Lebenspartnerschaft"], 10) },
        { Stadtteil, year, status: "Gestorben", value: parseInt(item["Fam_Stand_Verwitwet_LP_gestorben"], 10) },
        { Stadtteil, year, status: "Ledig", value: parseInt(item["Fam_Stand_ledig"], 10) },
        { Stadtteil, year, status: "Unbekannt", value: parseInt(item["Fam_Stand_unbekannt"], 10) }
      ];
    });
    console.log('familienStand_values', familienStand_values)
    
    return transformedData;
  }
  return [];
}
//get Chat with familienStand
function createPlot(data) {
  const plot = Plot.plot({
    y: { 
      grid: true, 
      label: "Einwohner",
      tickFormat: d => d.toLocaleString('de-DE').replace(/\./g, ",").replace(/,/g, "."),
      fontSize: 17
    },
    x: { label: "Jahr", fontSize: 17 },
    title: "Familienstand (Einwohnerlnnen ab 18 Jahre)",
    color: { legend: true, label: "" },
    marks: [
      //Plot.axisX({fontSize: 20, tickRotate: -45}),
      Plot.rectY(data, {
        x: "year",
        y: "value",
        fill: "status",
        title: d => `${d.status}: ${d.value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
      }),
      Plot.ruleY([0], { stroke: "black" })   

    ]
});
  //get DOM-el by ID
  const plotContainer = document.getElementById('familienStand_plot');
  //remote previous Chart
  plotContainer.innerHTML = '';
  //add new Chart by click
  plotContainer.appendChild(plot);
}
//table with familienStand
function formatNumberWithDot(value) {
  return new Intl.NumberFormat('de-DE', { useGrouping: true }).format(value);
}

function createTable(data){
  const formattedData = data.map(row => {
    return {
      ...row,
      value: formatNumberWithDot(row.value)
    };
  });
  const table = Inputs.table(formattedData,{
      columns: [
        "Stadtteil",
        "year",
        "status",
        "value"
      ],
      header: {
        Stadtteil: "STT",
        year: "Jahr",
        status: "Status",
        value: "Einwohner"
      }
    }
  )
  //get DOM-el by ID
  const tableContainer = document.getElementById('familienStand_table');
  //remote previous Chart
  tableContainer.innerHTML = '';
  //add new Chart by click
  tableContainer.appendChild(table);
}


//-----------Modal Window--------------
function openModal() {
  const modal = document.getElementById('myModal');
  modal.style.display = "block";
  modal.style.opacity = "1";

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      modal.style.opacity = "0";
    }
  }
}

export function closeModal() {
  const modal = document.getElementById('myModal');
  modal.style.opacity = "0";
  setTimeout(() => {
    modal.style.display = "none";
  }, 500); // Match the transition duration
}

export function openAdditinaInfo() {
  const familienStand_TablBlock = document.getElementById('familienStand_table');
  if (familienStand_TablBlock.style.display === 'none' || familienStand_TablBlock.style.display === '') {
    familienStand_TablBlock.style.display = 'block'; // Show the div
    setTimeout(() => {
      familienStand_TablBlock.style.opacity = '1';
    }, 0); // Ensure the opacity transition applies
  } else {
    familienStand_TablBlock.style.opacity = '0';
    setTimeout(() => {
      familienStand_TablBlock.style.display = 'none'; // Hide the div
    }, 100); // Match the transition duration
  }
}
//-----------------//Modal Window--------------- */