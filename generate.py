import parse
import urllib
import os

EXEC = '/usr/local/bin/wkhtmltopdf'
URL1 = 'http://localhost:8080/page1?country=%s'
URL2 = 'http://localhost:8080/page2?country=%s'

data = parse.get_quintiles({})
for d in ['output', 'output/final', 'output/page1', 'output/page2']:
    if not os.path.exists(d):
        os.mkdir(d)
for country in data.keys():
    cleaned = parse.clean_filename(country)
    if os.path.exists('flags/%s.png' % cleaned):
        encoded = country.encode('utf8')
        if not os.path.exists('output/page1/%s.pdf' % cleaned):
            url = URL1 % urllib.quote(country.encode("utf8"))
            os.system('%s %s "output/page1/%s.pdf"' % (EXEC, url, cleaned.encode("utf8")))

        if not os.path.exists('output/page2/%s.pdf' % cleaned):
            url = URL2 % urllib.quote(country.encode("utf8"))
            os.system('%s %s "output/page2/%s.pdf"' % (EXEC, url, cleaned.encode("utf8")))

