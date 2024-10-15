from util import read_tables_from_zip, zip_tables_to_buf
import duckdb
import httpx
import sys

path = 'https://opendata.dwd.de/climate_environment/CDC/observations_germany/'
path += 'climate/annual/climate_indices/kl/historical/'
path += 'jahreswerte_KLINDEX_02712_19721101_20231231_hist.zip'

r = httpx.get(path)
r.raise_for_status()

klindex_tables = read_tables_from_zip(r)

# ---

path = 'https://opendata.dwd.de/climate_environment/CDC/observations_germany/'
path += 'climate/annual/kl/historical/'
path += 'jahreswerte_KL_02712_19470101_20231231_hist.zip'

r = httpx.get(path)
r.raise_for_status()

kl_tables = read_tables_from_zip(r)

# ---

tables = { 'kl_' + k: v for k, v in kl_tables.items() }
tables |= { 'klindex_' + k: v for k, v in klindex_tables.items() }

# ---

kl_data = tables['kl_data']
kl_variables = tables['kl_meta_parameter']['Parameter'].drop_duplicates()

sql_long_ma30y = f"""
with
long as (
  select
    MESS_DATUM_BEGINN as year,
    variable,
    cast(value as double) as value,
  from kl_data
  unpivot (
    value for variable in ({", ".join(kl_variables)})
  )
  where value != -999
),
ma as (
  select
      year,
      variable,
      case
        when year - min(year) over (partition by variable) >= interval 30 year
        then avg(value)
        over (
          partition by variable
          order by year
          range between interval 29 year preceding and current row
        )
        else null
      end as ma30y,
  from long
)
select a.year, a.variable, a.value, b.ma30y
from long as a
left join ma as b
on a.variable = b.variable and a.year = b.year
"""

tables['long_ma30y'] = duckdb.query(sql_long_ma30y).df()

zip_file = zip_tables_to_buf(tables)

sys.stdout.buffer.write(zip_file)
