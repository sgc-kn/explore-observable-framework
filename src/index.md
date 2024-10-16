---
toc:
  label: 'Neuigkeiten'
sql:
  long_ma30y: ./dwd/data/long_ma30y.parquet
---

# Willkommen bei den Stadtdaten Konstanz

Hier entstehen öffentliche Dashboard zu interessanten Daten der Stadt
Konstanz. Diese Arbeit ist Teil des [Projekts zur Einrichtung einer
Klimadatenplattform][project] im [Smart Green City Programm][sgc].

Dieses Projekt ist open-source; wir veröffentlichen unseren Code auf
[Github][repo].

[project]: https://smart-green-city-konstanz.de/klimadatenplattform
[sgc]: https://smart-green-city-konstanz.de/
[repo]: https://github.com/sgc-kn/explore-observable-framework/

---

## Oktober 2024

Wir arbeiten an einem Dashboard zu den Beobachtungsdaten des deutschen
Wetterdienstes (DWD) in Konstanz.

[➜ Hier geht's zum Dashboard !](dwd/index.html)

Wusstest du, dass es zunehmend mehr heiße Tage in Konstanz gibt?

```sql id=klindex
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_EISTAGE', 'JA_FROSTTAGE', 'JA_HEISSE_TAGE',
                   'JA_SOMMERTAGE', 'JA_TROPENNAECHTE')
order by year asc, variable asc
```

```js
const klindex_variables = {
  "JA_EISTAGE": "Eistage (Maximum unter 0°C)",
  "JA_FROSTTAGE": "Frosttage (Minimum unter 0°C)",
  "JA_HEISSE_TAGE": "Heiße Tage (Maximum über 30°C)",
  "JA_SOMMERTAGE": "Sommertage (Maximum über 25°C)",
  "JA_TROPENNAECHTE": "Tropennächte (Minimum über 20°C)",
};

function label_klindex(variable) {
  if (variable in klindex_variables) {
    return klindex_variables[variable]
  } else {
    return variable
  }
};
```

<div class="card">
  <h2>Klimakenntage</h2>
  <h3>Anzahl Tage pro Jahr mit 30-jährigem gleitendem Durchschnitt</h3>
  ${resize((width) => Plot.plot({
      width,
      grid: true,
      inset: 10,
      x: {
        label: 'Jahr',
        labelAnchor: 'center',
        labelArrow: 'none',
      },
      y: {
        label: null,
        labelArrow: 'none',
        tickFormat: Plot.formatNumber("de-DE"),
      },
      color: {
        domain: ["JA_SOMMERTAGE", "JA_HEISSE_TAGE", "JA_TROPENNAECHTE"],
        legend: true,
        tickFormat: label_klindex,
      },
      marks: [
        Plot.frame(),
        Plot.dot(klindex, {
          x: "year",
          y: "value",
          stroke: "variable",
        }),
        Plot.line(klindex, {
          x: "year",
          y: "ma30y",
          stroke: "variable"},
        ),
      ]
    }))}
</div>
