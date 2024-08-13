# -*- coding: utf-8 -*-
"""
Created on Fri Jul  5 09:58:29 2024

@author: DigIT-DuS1
"""

import json
import pandas as pd
import sys
import os
import csv

os.getcwd()
os.chdir('H:\Desktop\Python')

dfG = pd.read_csv('raw/Einwohner_Familienstand_Konstanz_2010-2023.csv', sep=';',dtype=str)
dfS = pd.read_csv('raw/Einwohner_Familienstand_Stadtteile_2010-2023.csv', sep=';',dtype=str)

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

df.to_csv('out/Einwohner_Familienstand_Stadtteile_2010-2023_cleaned.csv', quoting=csv.QUOTE_NONNUMERIC, index=False)
