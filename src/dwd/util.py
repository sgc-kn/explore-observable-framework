import html.parser
import io
import pandas
import zipfile

class LinkParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            for attr in attrs:
                if attr[0] == 'href':
                    self.links.append(attr[1])

def list_zip_files(url, prefix):
    r = httpx.get(url)
    r.raise_for_status()

    p = LinkParser()
    p.feed(r.text)
    return [ x for x in p.links if x.startswith(prefix) and x.endswith('.zip') ]


def read_tables_from_zip(file):
    # read csv and metadata as DataFrame from zip file
    with zipfile.ZipFile(file, 'r') as zf:
        tables = []
        for name in zf.namelist():
            if not name.endswith('.txt'):
                continue
            if name.startswith('produkt_'):
                df = pandas.read_csv(zf.open(name), sep=';', encoding='iso-8859-1',
                                     parse_dates=['MESS_DATUM_BEGINN', 'MESS_DATUM_ENDE'])
                tables.append(('data', df))
                continue
            if name.startswith('Metadaten_Parameter'):
                df = pandas.read_csv(zf.open(name), sep=';',  encoding='iso-8859-1', skipfooter=2,
                                     engine='python', parse_dates=['Von_Datum', 'Bis_Datum'])
                tables.append(('meta_parameter', df))

                # drop empty columns
                df.dropna(how='all', axis='columns', inplace=True)

                continue
            if name.startswith('Metadaten_Geographie'):
                df = pandas.read_csv(zf.open(name), sep=';',  encoding='iso-8859-1',
                                     parse_dates=['von_datum', 'bis_datum'])
                tables.append(('meta_geo', df))
                continue
            if name.startswith('Metadaten_Stationsname_Betreibername'):
                lns = zf.open(name).read().splitlines()
                split_on = lns.index(b'')
                df = pandas.read_csv(zf.open(name), sep=';',  encoding='iso-8859-1',
                                     nrows=split_on - 1, engine='python',
                                     parse_dates=['Von_Datum', 'Bis_Datum'])
                tables.append(('meta_name', df))
                df = pandas.read_csv(zf.open(name), sep=';',  encoding='iso-8859-1',
                                     skiprows=split_on, skipfooter=1, engine='python',
                                     parse_dates=['Von_Datum', 'Bis_Datum'])
                tables.append(('meta_operator', df))
                continue
            raise ValueError(f'unknown table {name}')

    for (name, df) in tables:
        # fix/remove line terminator
        if 'eor' in df.columns:
            assert (df['eor'] == 'eor').all()
            del df['eor']

        # fix columns names
        df.columns = [ x.strip() for x in df.columns ]

    return tables

def zip_tables_to_buf(tables):
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "a", zipfile.ZIP_DEFLATED, False) as zf:
        for (name, df) in tables:
            with zf.open(name + '.parquet', 'w') as f:
                df.to_parquet(f)
    return buf.getvalue()
