import cherrypy
from jinja2 import Environment, FileSystemLoader
import json
from parse import parse
import parse_dp

env = Environment(loader=FileSystemLoader('templates'))

class CountryData(object):
    def page1(self, country):
        tmpl = env.get_template('page1.html')
        data = parse()
        ctx = data[country]
        return tmpl.render(context=json.dumps(ctx))

    def page2(self, country):
        tmpl = env.get_template('page2.html')
        data = parse()
        ctx = data[country]
        return tmpl.render(context=json.dumps(ctx))

    def donor(self, donor):
        tmpl = env.get_template('donor.html')
        data = parse_dp.parse()
        ctx = data[donor]
        ctx['donor'] = {'name': donor}
        return tmpl.render(context=json.dumps(ctx, indent=4))
    
    page1.exposed = True
    page2.exposed = True
    donor.exposed = True

cherrypy.quickstart(CountryData(), '/', 'web.config')
