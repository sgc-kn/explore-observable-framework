import pandas as pd
import sys
import csv

baseurl = "https://offenedaten-konstanz.de/sites/default/files/"

dfG = pd.read_csv(baseurl + 'Einwohner_Familienstand_Konstanz_2010-2023.csv',
                  sep=';', dtype=str)
dfS = pd.read_csv(baseurl + 'Einwohner_Familienstand_Stadtteile_2010-2023.csv',
                  sep=';', dtype=str)

df = pd.concat([dfS, dfG])

df = df.rename(columns={"Stadtteil_Nr":"STT_ID", "Stadtteil":"STT", 'Fam_Stand_ledig (ab 18J)': 'Fam_Stand_ledig',
                        'Fam_Stand_Verheiratet_Lebenspartnerschaft (ab 18J)': 'Fam_Stand_Verheiratet_Lebenspartnerschaft',
                        'Fam_Stand_Verwitwet_LP-gestorben (ab 18J)': 'Fam_Stand_Verwitwet_LP_gestorben',
                        'Fam_Stand_Geschieden_LP aufgehoben (ab 18J)' : 'Fam_Stand_Geschieden_LP_aufgehoben' ,
                        'Fam_Stand_unbekannt (ab 18J)': 'Fam_Stand_unbekannt'})


df['STT_ID'] = df['STT_ID'].str.zfill(3)

df['Jahr'] = 0
df['Jahr'] = df['Stichtag'].str.extract(r'(19\d{2}|20\d{2})')
del df['Stichtag']

df['STT'] = df['STT'].str.replace("Fuerstenberg","Fürstenberg")
df['STT'] = df['STT'].str.replace("Koenigsbau","Königsbau")
df['STT'] = df['STT'].str.replace("Stadt Konstanz gesamt","Gesamtstadt")

df.to_csv(sys.stdout, quoting=csv.QUOTE_NONNUMERIC, index=False)
