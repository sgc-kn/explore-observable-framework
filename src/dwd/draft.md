---
draft: true
sql:
  kl_meta_parameter: ./data/kl_meta_parameter.parquet
  klindex_meta_parameter: ./data/klindex_meta_parameter.parquet
  kl_meta_geo: ./data/kl_meta_geo.parquet
---

# DWD Dashboard


- Inspiration: https://klimadashboard.de/auswirkungen/temperatur
- Datenquelle: https://opendata.dwd.de/climate_environment/CDC/observations_germany/climate/annual/climate_indices/kl/
- Code (WIP): https://github.com/sgc-kn/explore-observable-framework/pull/9

```sql id=kl_meta display
select distinct
  Parameter as variable,
  Parameterbeschreibung as label,
  Einheit as unit,
  'kl' as tab,
from kl_meta_parameter
union
select distinct
  Parameter as variable,
  Parameterbeschreibung as label,
  Einheit as unit,
  'klindex' as tab,
from klindex_meta_parameter
```
