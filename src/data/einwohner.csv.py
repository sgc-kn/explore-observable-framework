#import json
#import pandas
#import sys

#wide = pandas.read_csv('raw_data/EW_STT1995ff_cleaned.csv', sep=',')
#long = wide.melt(id_vars=['STT_ID', 'STT'], var_name='Jahr', value_name='Einwohner')
#long.to_csv(sys.stdout, index=False)
#wide.to_csv(sys.stdout, index=False)

with open('raw_data/EW_STT1995ff_cleaned.csv', 'r') as f:
   print(f.read(), end='')

   

    