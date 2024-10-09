from util import read_tables_from_zip, zip_tables_to_buf
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

zip_file = zip_tables_to_buf(tables)

sys.stdout.buffer.write(zip_file)
