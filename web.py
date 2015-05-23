import cherrypy
from jinja2 import Environment, FileSystemLoader
import json
env = Environment(loader=FileSystemLoader('templates'))

ctx = {
    'country_name': 'Azerbaijan',
    'total-population': 9999,
    'under5-population': 9999,
    'births': 9999,
    'adolescent-birth': 9999,
    'quintile': {
        'contraception': {'bottom': 20, 'value': 40, 'top': 60},
        'antenatal': {'bottom': 20, 'value': 40, 'top': 60},
        'prevention': {'bottom': 20, 'value': 40, 'top': 60},
        'birth-attendants': {'bottom': 20, 'value': 40, 'top': 60},
        'post-natal': {'bottom': 20, 'value': 40, 'top': 60},
        'breast-feeding': {'bottom': 20, 'value': 40, 'top': 60},
        'dpt3': {'bottom': 20, 'value': 40, 'top': 60},
        'pneumonia': {'bottom': 20, 'value': 40, 'top': 60}
    },
    'abortion-status': 2,
    'family-planning': 0.54,
    'access-contraceptives': False,
    'under5-mortality': {
        'data': [[1990, 100], [2001, 50], [2012, 20]],
        'year_range': [1988, 2015],
        'w': 500,
        'h': 180,
        'mdg': 40
    },
    'neonatal-mortality': {
        'data': [[1990, 100], [2001, 50], [2012, 20]],
        'year_range': [1988, 2015],
        'w': 500,
        'h': 180,
        'mdg': 40
    },
    'maternal-mortality': {
        'data': [[1990, 100], [2001, 50], [2012, 20]],
        'year_range': [1988, 2015],
        'w': 500,
        'h': 180,
        'mdg': 40
    },
    'stunting': {
        'data': [[1990, 28], [2000, 24.1], [2013, 26.8]],
        'year_range': [1988, 2015],
        'w': 500,
        'h': 180,
        'mdg': 40
    }
}


class CountryData(object):
    def page1(self, country):
        tmpl = env.get_template('page1.html')
        ctx['country_name'] = country;
        return tmpl.render(context=json.dumps(ctx))
    
    page1.exposed = True

cherrypy.quickstart(CountryData(), '/', 'web.config')
