import json
import pandas
import sys

wide = pandas.read_csv('raw_data/EW_STT1995ff_cleaned_2.csv', sep=',')
#long = wide.melt(id_vars=['STT_ID', 'STT'], var_name='Jahr', value_name='Einwohner')
#long.to_csv(sys.stdout, index=False)
wide.to_csv(sys.stdout, index=False)