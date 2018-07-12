#!/usr/bin/env python
import re
import os
import json
import requests

#Assume that we're in the root directory of the ui-configuration repo

#TODO: Handle updating

#Traverse all directories in this area
h = re.compile('[A-Z]+-[A-Z,0-9]+$')

for f in os.listdir("./"):
    if os.path.isdir(f) and h.match(f):
        print "pushing " + f
        #We need to do a translation
        d = json.loads(open(f+"/config.json").read())

        #Now we push it up to couch
        r = requests.put(os.environ["COUCH_ADDR"]+"/ui-configuration/"+f, json = d, auth=(os.environ["COUCH_USER"], os.environ["COUCH_PASS"]), )
        if r.status_code / 100 != 2:
            print "Error:", r.text
        else:
            print "done", r.text
