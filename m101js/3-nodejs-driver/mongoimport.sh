#!/bin/bash

# mongo crunchbase --eval "db.dropDatabase()"
# mongoimport -d crunchbase -c companies companies.json

mongoimport --drop -d crunchbase -c companies companies.json
