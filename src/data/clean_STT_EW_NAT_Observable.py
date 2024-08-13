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

dfG = pd.read_csv('raw/Einwohner_deutsch-nichtdeutsch_Konstanz_1975-2023.csv', sep=';',dtype=str)
dfS = pd.read_csv('raw/Einwohner_deutsch-nichtdeutsch_Stadtteile_2010-2023.csv', sep=';',dtype=str)

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


df['STT'] = df['STT'].str.replace("Fuerstenberg","Fürstenberg")
df['STT'] = df['STT'].str.replace("Koenigsbau","Königsbau")
df['STT'] = df['STT'].str.replace("Stadt Konstanz gesamt","Gesamtstadt")

df.to_csv('out/Einwohner_deutsch_nichtdeutsch_Stadtteile_2010-2023_cleaned.csv', quoting=csv.QUOTE_NONNUMERIC, index=False)
