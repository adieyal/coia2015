import parse
import urllib
import os

EXEC = '/usr/local/bin/wkhtmltopdf'
URL = 'http://localhost:8080/page1?country=%s'

data = parse.get_quintiles({})
for country in data.keys():
    cleaned = parse.clean_filename(country)
    if os.path.exists('flags/%s.png' % cleaned) and not os.path.exists('output/"%s.pdf"' % cleaned):
        url = URL % urllib.quote(country)
        print url
        os.system('%s %s "output/%s.pdf"' % (EXEC, url, cleaned))
