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
os.chdir('H:/Desktop/Python')

dfG = pd.read_csv('raw/Einwohner_Altersgruppen_Konstanz_2000-2023.csv', sep=';',dtype=str)
dfS = pd.read_csv('raw/Einwohner_Altersgruppen_Stadtteile_2010-2023.csv', sep=';',dtype=str)

df = pd.concat([dfS, dfG])

df = df.rename(columns={'AGS': 'AGS',
   'Stadtteil_Nr': 'STT_ID',
   'Stadtteil': 'STT',
   'unter 3': 'U3',
   '3 - unter 6': '3-U6',
   '6 - unter 10': '6-U10',
   '10 - unter 18': '10-U18',
   '18 - unter 25': '18-U25',
   '25 - unter 65': '25-U65',
   '65 - unter 85': '65-U85',
   '85 und aelter': 'UE85',
   'Erwerbsfaehige\n (15- unter 65)': 'Erwerbsfaehige_15-U65'})

df['STT_ID'] = df['STT_ID'].str.zfill(3)

df['Jahr'] = 0
df['Jahr'] = df['Stichtag'].str.extract(r'(19\d{2}|20\d{2})')
del df['Stichtag']
try: del df['Unnamed: 15']
except: pass

df['Jahr']= pd.to_numeric(df['Jahr'])
df =df[df['Jahr']>=2010]

df['Jahr'] = df['Jahr'].astype(str)


df['STT'] = df['STT'].str.replace("Fuerstenberg","Fürstenberg")
df['STT'] = df['STT'].str.replace("Koenigsbau","Königsbau")
df['STT'] = df['STT'].str.replace("Stadt Konstanz gesamt","Gesamtstadt")

df.to_csv('out/Einwohner_Altersgruppen_2010-2023_cleaned.csv', quoting=csv.QUOTE_NONNUMERIC, index=False)
