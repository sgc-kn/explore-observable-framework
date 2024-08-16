import * as d3 from "npm:d3";

export function Table({einwohner_csv, einwohner_famStd_csv, einwohner_staatsangehoerigkeit_csv, stt_ew_alt_csv, id, width}={}) {
    const maxYear = Math.max(...einwohner_csv.map(obj => obj.Jahr));
    const minYear = Math.min(...einwohner_csv.map(obj => obj.Jahr));
    const previousYear = maxYear - 1;
    const ts_data = d3.filter(einwohner_csv, (r) => r.STT_ID == id);
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
    const famStd_maxYear = einwohner_famStd_csv.filter(d => d.STT_ID === id && d.Jahr === maxYear);

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

    const staatsAHK_maxYear = einwohner_staatsangehoerigkeit_csv.filter(d => d.STT_ID === id && d.Jahr === maxYear);
    const transformedData_sahk = staatsAHK_maxYear.flatMap(item => {
        const total = item.Deutsch + item.Nichtdeutsch;
        const year = item.Jahr;
        return [
          { year, status: "Deutsch", prozent: item.Deutsch / total, absolut: item.Deutsch},
          { year, status: "Sonstige", prozent: item.Nichtdeutsch / total, absolut: item.Nichtdeutsch},

        ];
    });

    const stt_ew_alt_data = d3.filter(stt_ew_alt_csv, (r) => r.Stadtteil_Nr == id);
    const ew_alt_last = stt_ew_alt_data.filter(item => item.Jahr === maxYear);
    //const ew_alt_previousYear = stt_ew_alt_data.filter(item => item.Jahr === previousYear);
    
    const updatedArray = ew_alt_last.map(item => {
        return {
          ...item,
          Gruppe: item.Gruppe.substring(3) // Entfernt die ersten drei Zeichen
        };
    });   

    return(<div class="grid grid-cols-2">
    <div class="card">
                <h2><b>Bevölkerungsentwicklung</b></h2>
                <h3>{einwohnerMaxYear[0].STT}, {minYear} bis {maxYear}</h3>
                <table>
                    <tbody>
                        <tr>
                            <td>Einwohner im Jahr {maxYear}</td>
                            <td>{einwohnerMaxYear[0].Einwohner.toLocaleString()} </td>
                        </tr>
                        <tr>
                            <td>Wachstum zum Vorjahr</td>
                            <td><span style={{ color: `${growthColor}` }}> {wachstum.toFixed(2).replace('.', ',') } % {growth}</span></td>
                        </tr>
                        <tr>
                            <td>Höchststand</td>
                            <td>{maxValue.toLocaleString()} im Jahr {maxValueJahr}</td>
                        </tr>
                        <tr>
                            <td>Minimum</td>
                            <td>{minValue.toLocaleString()} im Jahr {minValueJahr}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="card">
                <h2><b>Familienstand</b></h2> 
                <h3>{einwohnerMaxYear[0].STT}, {maxYear}, EinwohnerInnen ab 18 Jahren</h3>           
                <table>
                    <tbody>                        
                        {transformedData.map(item =>
                            <tr>
                                <td>{item.status} </td>
                                <td>{item.absolut.toLocaleString()}</td>
                                <td>{(item.prozent *100).toFixed(1).replace('.', ',') }% </td>
                            </tr>
                        )}                        
                    </tbody>
                </table>
            </div>
            <div class="card">
                <h2><b>Staatsangehörigkeit</b></h2>
                <h3>{einwohnerMaxYear[0].STT}, {maxYear}</h3>
                <table>
                    <tbody>
                       {transformedData_sahk.map(item =>
                            <tr>
                                <td>{item.status}</td>
                                <td> {item.absolut.toLocaleString()}</td>
                                <td> {(item.prozent *100).toFixed(1).replace('.', ',') }%</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div class="card">
                <h2><b>Altersstruktur</b></h2>
                <h3>{einwohnerMaxYear[0].STT}, {maxYear}</h3>
                <table>
                    <tbody>
                        {updatedArray.map(item =>
                            <tr>
                                <td>{item.Gruppe}</td>
                                <td> {item.Anzahl.toLocaleString()}</td>
                                <td> {(item.Anteil *100).toFixed(1).replace('.', ',') }%</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

