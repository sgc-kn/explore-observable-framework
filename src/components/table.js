import * as d3 from "npm:d3";
import { previousYear } from "./data.js";

//infobox - table
export const showInfo = (latestYearData, previousYearData, maxValue, minValue, maxValueJahr, minValueJahr, prozent_famStand) => {     

    const infoBox = d3.select("#table");
    function renderTable() {
        //percent of the growth
        const wachstum = (latestYearData.Einwohner - previousYearData.Einwohner) * 100 / previousYearData.Einwohner;
        //changes in growth
        const growthColor = wachstum > 0 ? 'green' : 'red';
        const growth = wachstum > 0 ? '↗︎' : ' ↘︎';
        infoBox
            .style("display", "block")
            .html(`
                <table>
                    <tr>
                        <td><h1 class="ort_name_card"> ${latestYearData.STT} </h1> </td>
                    </tr>
                    <tr>
                        <td>Gesamt der Einwohner:</td><td> ${latestYearData.Einwohner} </td>
                    </tr>
                    <tr>
                        <td>Wachstum im Vergleich zu ${previousYear}:</td>
                        <td><span style="color: ${growthColor};"> ${wachstum} % ${growth}</span></td>                    
                    </tr>
                    <tr>
                        <td>Wachstum im Vergleich zu ${minValueJahr}:</td>
                        <td><span> ${minValue}</span></td>                    
                    </tr>
                    <tr>
                        <td>Wachstum im Vergleich zu ${maxValueJahr} :</td>
                        <td><span> ${maxValue}</span></td>                    
                    </tr>
                    <tr>
                        <td>Familienstand (EinwohnerInnen ab 18 Jahre):</td>
                        <td>${prozent_famStand.map(item =>`
                        <div><span>${item.status}:</span><span> ${item.value}</span><span> (${item.percentage}%) </span></div>
                    `).join('')}</td>
                    </tr>
                </table>
            `);
    }
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                renderTable();
            }
        });

    resizeObserver.observe(document.getElementById('table'));

    // Изначально рендерим таблицу
    renderTable();
}
