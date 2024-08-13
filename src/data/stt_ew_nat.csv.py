import pandas as pd
import csv
import sys

baseurl = "https://offenedaten-konstanz.de/sites/default/files/"

dfG = pd.read_csv(baseurl + 'Einwohner_deutsch-nichtdeutsch_Konstanz_1975-2023.csv',
                  sep=';', dtype=str)
dfS = pd.read_csv(baseurl + 'Einwohner_deutsch-nichtdeutsch_Stadtteile_2010-2023.csv',
                  sep=';', dtype=str)

df = pd.concat([dfS, dfG])

df = df.rename(columns={'AGS': 'AGS','Stadtteil_Nr': 'STT_ID','Stadtteil': 'STT',
                        'Quelle': 'Quelle',
                        'Wohnbev_insg': 'Wohnbev_insg',
                        'Deutsch': 'Deutsch',
                        'Nichtdeutsch': 'Nichtdeutsch'})

df['STT_ID'] = df['STT_ID'].str.zfill(3)

df['Jahr'] = 0
df['Jahr'] = df['Stichtag'].str.extract(r'(19\d{2}|20\d{2})')
del df['Stichtag']

df['Jahr']= pd.to_numeric(df['Jahr'])
df =df[df['Jahr']>=2010]

df['Jahr'] = df['Jahr'].astype(str)


df['STT'] = df['STT'].str.replace("Fuerstenberg", "Fürstenberg")
df['STT'] = df['STT'].str.replace("Koenigsbau", "Königsbau")
df['STT'] = df['STT'].str.replace("Stadt Konstanz gesamt", "Gesamte Stadt")

df.to_csv(sys.stdout, quoting=csv.QUOTE_NONNUMERIC, index=False)
