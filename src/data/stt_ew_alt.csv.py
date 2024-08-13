import pandas as pd
import sys
import csv

baseurl = "https://offenedaten-konstanz.de/sites/default/files/"

dfG = pd.read_csv(baseurl + 'Einwohner_Altersgruppen_Konstanz_2000-2023.csv',
                  sep=';', dtype=str)

dfS = pd.read_csv(baseurl + 'Einwohner_Altersgruppen_Stadtteile_2010-2023.csv',
                  sep=';', dtype=str)

df = pd.concat([dfS, dfG])

df = df.rename(columns={
    'unter 3': 'unter 3 Jahren',
    '3 - unter 6': '3 bis 5 Jahre',
    '6 - unter 10': '6 bis 9 Jahre',
    '10 - unter 18': '10 bis 17 Jahre',
    '18 - unter 25': '18 bis 25 Jahre',
    '25 - unter 65': '25 bis 64 Jahre',
    '65 - unter 85': '65 bis 84 Jahre',
    '85 und aelter': '85 Jahre und älter',
    'Erwerbsfaehige\n (15- unter 65)': 'Erwerbsfähige (15 bis 64 Jahre)',
    'Wohnbev_insg': 'insgesamt',
    })

df['Stadtteil_Nr'] = pd.to_numeric(df['Stadtteil_Nr'])

df['Jahr'] = 0
df['Jahr'] = df['Stichtag'].str.extract(r'(19\d{2}|20\d{2})')

del df['AGS']
del df['Stichtag']
del df['Quelle']

try: del df['Unnamed: 15']
except: pass

df['Jahr'] = pd.to_numeric(df['Jahr'])
df = df[df['Jahr']>=2010]

df['Stadtteil'] = df['Stadtteil'].str.replace("Fuerstenberg", "Fürstenberg")
df['Stadtteil'] = df['Stadtteil'].str.replace("Koenigsbau", "Königsbau")
df['Stadtteil'] = df['Stadtteil'].str.replace("Stadt Konstanz gesamt", "Gesamte Stadt")

long = pd.melt(df,
               id_vars = ['Stadtteil_Nr', 'Stadtteil', 'Jahr', 'insgesamt'],
               var_name = 'Gruppe',
               value_name = 'Anzahl',
               )

long['insgesamt'] = pd.to_numeric(long['insgesamt'])
long['Anzahl'] = pd.to_numeric(long['Anzahl'])
long['Anteil'] = long['Anzahl'] / long['insgesamt']

del long['insgesamt']

long.to_csv(sys.stdout, quoting=csv.QUOTE_NONNUMERIC, index=False)
