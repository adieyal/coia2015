import parse_dp as parse
from misc import clean_filename
import urllib
import os

EXEC = '/usr/local/bin/wkhtmltopdf'
URL1 = 'http://localhost:8080/donor?donor=%s'

data = parse.parse()
for d in ['output', 'output/donor']:
    if not os.path.exists(d):
        os.mkdir(d)

for donor in data.keys():
    cleaned = clean_filename(donor)
    if os.path.exists('donor_logos/%s.png' % cleaned):
        encoded = donor.encode('utf8')
        if not os.path.exists('output/donor/%s.pdf' % cleaned):
            url1 = URL1 % urllib.quote(donor.encode("utf8"))
            cmd = '%s %s "output/donor/%s.pdf"' % (EXEC, url1, cleaned.encode("utf8"))
            os.system(cmd)

