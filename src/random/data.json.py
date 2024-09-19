import json
import random
import sys

# Simulate random walk; record values
value = 0
steps = [ ]
for step in range(42):
    e = random.uniform(-0.7, 1)
    value += e
    steps.append(dict(step=step, value=value))

# write data to standard output in JSON format
# this will be served as data/random-walk.json
json.dump(steps, sys.stdout)
