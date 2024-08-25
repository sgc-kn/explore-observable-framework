import * as d3 from "npm:d3";

export function Table({einwohner_csv, einwohner_famStd_csv, einwohner_staatsangehoerigkeit_csv, stt_ew_alt_csv, id, width, svgLink}={}) {
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
          { year, status: "Nichtdeutsch", prozent: item.Nichtdeutsch / total, absolut: item.Nichtdeutsch},

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
                <h2>Entwicklung EinwohnerInnen</h2>
                <h3><span class="teil_name">{einwohnerMaxYear[0].STT}</span>, {minYear} bis {maxYear}</h3>
                <table>
                    <tbody>
                        <tr>
                            <td>EinwohnerInnen im Jahr {maxYear}</td>
                            <td class="align-right">{einwohnerMaxYear[0].Einwohner.toLocaleString()} </td>
                        </tr>
                        <tr>
                            <td>Wachstum im Vergleich zum Vorjahr</td>
                            <td class="align-right"><span style={{ color: `${growthColor}` }}> {wachstum.toLocaleString(undefined, {maximumFractionDigits: 2}) } % {growth}</span></td>
                        </tr>
                        <tr>
                            <td>Höchste Einwohnerzahl</td>
                            <td class="align-right">{maxValue.toLocaleString()} im Jahr {maxValueJahr}</td>
                        </tr>
                        <tr>
                            <td>Niedrigste Einwohnerzahl</td>
                            <td class="align-right">{minValue.toLocaleString()} im Jahr {minValueJahr}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="card">
                <h2>Familienstand</h2> 
                <h3><span class="teil_name">{einwohnerMaxYear[0].STT}</span>, {maxYear}, EinwohnerInnen ab 18 Jahren</h3>           
                <table>
                    <tbody>                        
                        {transformedData.map(item =>
                            <tr>
                                <td>{item.status} </td>
                                <td class="align-right">{item.absolut.toLocaleString()}</td>
                                <td class="align-right">{(item.prozent *100).toLocaleString(undefined, {maximumFractionDigits: 1}) }% </td>
                            </tr>
                        )}
                        <tr>
                            <td>
                                <a href="https://offenedaten-konstanz.de/dataset/einwohner-nach-familienstand" target="_blank" title="Einwohner in Konstanz nach Familienstand">
                                    Datenquelle
                                    <img src={svgLink} alt="link" />
                                </a>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>                    
                </table>
            </div>
            <div class="card">
                <h2>Staatsangehörigkeit</h2>
                <h3><span class="teil_name">{einwohnerMaxYear[0].STT}</span>, {maxYear}</h3>
                <table>
                    <tbody>
                       {transformedData_sahk.map(item =>
                            <tr>
                                <td>{item.status}</td>
                                <td class="align-right">{item.absolut.toLocaleString()}</td>
                                <td class="align-right">{(item.prozent *100).toLocaleString(undefined, {maximumFractionDigits: 1})}%</td>
                            </tr>
                        )}
                        <tr>
                            <td>
                                    <a href="https://offenedaten-konstanz.de/dataset/einwohner-deutsch-nichtdeutsch" target="_blank" title="Einwohner in Konstanz deutsch - nichtdeutsch

    ">                                   Datenquelle
                                        <img src={svgLink} alt="link" />
                                    </a>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="card">
                <h2>Altersstruktur</h2>
                <h3><span class="teil_name">{einwohnerMaxYear[0].STT}</span>, {maxYear}</h3>
                <table>
                    <tbody>
                        {updatedArray.map(item =>
                            <tr>
                                <td>{item.Gruppe}</td>
                                <td class="align-right"> {item.Anzahl.toLocaleString()}</td>
                                <td class="align-right"> {(item.Anteil *100).toLocaleString(undefined, {maximumFractionDigits: 1}) }%</td>
                            </tr>
                        )}
                        <tr>
                            <td>
                                    <a href="https://offenedaten-konstanz.de/dataset/einwohner-nach-altersgruppen" target="_blank" title="Einwohner in Konstanz nach Altersgruppen">                                   Datenquelle
                                        <img src={svgLink} alt="link" />
                                    </a>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

