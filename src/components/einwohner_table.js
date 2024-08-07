import * as d3 from "npm:d3";
import { html } from "npm:htl";

export function table(einwohner_csv, einwohner_famStd_csv, einwohner_staatsangehörigkeit_csv, stt_id, width) {
    
    const maxYear = Math.max(...einwohner_csv.map(obj => obj.Jahr));        
    const previousYear = maxYear - 1;

    const ts_data = d3.filter(einwohner_csv, (r) => r.STT_ID == stt_id);
    //Max - min values
    const maxValue = Math.max(...ts_data.map(d => d.Einwohner));
    const minValue = Math.min(...ts_data.map(d => d.Einwohner));
    const maxValueJahrEntries = ts_data.filter(d => d.Einwohner === maxValue);
    const maxValueJahr = maxValueJahrEntries.map(d => d.Jahr);
    const minValueJahrEntries = ts_data.filter(d => d.Einwohner === minValue);
    const minValueJahr = minValueJahrEntries.map(d => d.Jahr);
    
    const einwohnerMaxYear = ts_data.filter(obj => obj.Jahr === maxYear);
    const einwohnerPreviousYear = ts_data.filter(obj => obj.Jahr === previousYear);    
    const wachstum = (einwohnerMaxYear[0].Einwohner - einwohnerPreviousYear[0].Einwohner) * 100 / einwohnerPreviousYear[0].Einwohner;
    const growthColor = wachstum > 0 ? 'green' : 'red';
    const growth = wachstum > 0 ? '↗︎' : ' ↘︎';

    const famStd_maxYear = einwohner_famStd_csv.filter(d => d.STT_ID === stt_id && d.Jahr === maxYear); 
    
    const transformedData = famStd_maxYear.flatMap(item => { 
        const total = item.Fam_Stand_Geschieden_LP_aufgehoben + item.Fam_Stand_Verheiratet_Lebenspartnerschaft + item.Fam_Stand_Verwitwet_LP_gestorben + item.Fam_Stand_ledig + item.Fam_Stand_unbekannt;     
        const year = item.Jahr;
        return [
          { year, status: "Geschieden", prozent: item.Fam_Stand_Geschieden_LP_aufgehoben / total, absolut: item.Fam_Stand_Geschieden_LP_aufgehoben},
          { year, status: "Verheiratet", prozent: item.Fam_Stand_Verheiratet_Lebenspartnerschaft / total, absolut: item.Fam_Stand_Verheiratet_Lebenspartnerschaft},
          { year, status: "Verwitwet", prozent: item.Fam_Stand_Verwitwet_LP_gestorben / total, absolut: item.Fam_Stand_Verwitwet_LP_gestorben},
          { year, status: "Ledig", prozent: item.Fam_Stand_ledig / total, absolut: item.Fam_Stand_ledig},
          { year, status: "Unbekannt", prozent: item.Fam_Stand_unbekannt / total, absolut: item.Fam_Stand_unbekannt}
        ];
    });

    const staatsAHK_maxYear = einwohner_staatsangehörigkeit_csv.filter(d => d.STT_ID === stt_id && d.Jahr === maxYear);
    const transformedData_sahk = staatsAHK_maxYear.flatMap(item => { 
        const total = item.Deutsch + item.Nichtdeutsch;
        const year = item.Jahr;
        return [
          { year, status: "Deutsch", prozent: item.Deutsch / total, absolut: item.Deutsch},
          { year, status: "Sonstige", prozent: item.Nichtdeutsch / total, absolut: item.Nichtdeutsch},
          
        ];
    });
    
    return html`<table style="width: ${width};">
            <tr>
                <td><h1 class="ort_name_card"> ${einwohnerMaxYear.STT} </h1> </td><td></td>
            </tr>
            <tr>
                <td>Gesamt der Einwohner:</td>
                <td> ${einwohnerMaxYear[0].Einwohner} </td>
            </tr>            
            <tr>
                <td>Wachstum im Vergleich zu ${previousYear}:</td>
                <td><span style="color: ${growthColor};"> ${wachstum.toFixed(2)} % ${growth}</span></td>
            </tr>
            <tr>
                <td>Maximale Einwohnerzahl: </td>
                <td>${maxValue} im Jahr ${maxValueJahr}</td>
            </tr>
            <tr>
                <td>Manimale Einwohnerzahl:</td>
                <td> ${minValue} im Jahr ${minValueJahr}</td>
            </tr>
            <tr>
                <td>Familienstand (EinwohnerInnen ab 18 Jahre):</td>
                <td>${transformedData.map(item =>`
                    <div>
                        <span>${item.status}:</span>
                        <span>${item.absolut}</span>
                        <span>(${item.prozent.toFixed(3) * 100 }%) </span>
                    </div>
                `)}
                </td>
            </tr>
            <tr>
                <td>Staatsangehörigkeit:</td>
                <td>${transformedData_sahk.map(item =>`
                    <div>
                        <span>${item.status}:</span>
                        <span>${item.absolut}</span>
                        <span>(${item.prozent.toFixed(3) * 100 }%) </span>
                    </div>`)}
                </td>
            </tr>
        </table>
    `
}