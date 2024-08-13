# -*- coding: utf-8 -*-
"""
Created on Fri Jul  5 09:58:29 2024

@author: DigIT-DuS1
"""

import json
import pandas
import sys
import os
import csv

os.getcwd()
os.chdir('H:\Desktop\Python')

wide = pandas.read_csv('raw/EW_STT_1995ff.csv', sep=';',dtype=str)

# Laden des Dfs als All-String
long = wide.melt(id_vars=['STT_ID', 'STT'], var_name='Jahr', value_name='Einwohner')
#del long['STT_ID'] 

# Löschen Tausendertrennzeichen
long['Einwohner'] = long['Einwohner'].str.replace('.','')

# Bilden numerische Variablen
long['Jahr'] = pandas.to_numeric(long['Jahr'])
long['Einwohner'] = pandas.to_numeric(long['Einwohner'])

# Jährl. Summe EW. Gesamtstadt 
yearly_sum = long.groupby('Jahr')['Einwohner'].sum().reset_index()
yearly_sum['STT'] = 'Gesamtstadt'

# Appenden des Datensatzes der Gesamtstadt
long = pandas.concat([long, yearly_sum])
long.sort_values(by=['STT', 'Jahr'])

# Relatives Wachstum zum Vorjahr in%
long['Wachstum'] = long.groupby('STT')['Einwohner'].pct_change() * 100

# NAs für das erste Jahr hinzufügen
long['Wachstum'] = long['Wachstum'].fillna(0)

long["STT_ID"] = long["STT_ID"].fillna('000')

long = long[long['Jahr']>=2010]
long.to_csv('out/EW_STT2010ff_cleaned.csv', quoting=csv.QUOTE_NONNUMERIC, index=False)
