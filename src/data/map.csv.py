import pandas
import sys

df = pandas.read_csv('raw_data/Kleinräumige_Gliederung_-8612653205752667378.csv', sep=',')
df.to_csv(sys.stdout, index=False)