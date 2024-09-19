from util import read_tables_from_zip, zip_tables_to_buf
import httpx
import io
import sys

path = 'https://opendata.dwd.de/climate_environment/CDC/observations_germany/'
path += 'climate/annual/climate_indices/kl/historical/'
path += 'jahreswerte_KLINDEX_02712_19721101_20231231_hist.zip'

r = httpx.get(path)
r.raise_for_status()

dwd_tables = read_tables_from_zip(io.BytesIO(r.content))

zip_file = zip_tables_to_buf(dwd_tables)

sys.stdout.buffer.write(zip_file)
