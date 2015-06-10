import xlrd
import os
import base64

FILENAME = "data/data6.xlsx"
book = xlrd.open_workbook(FILENAME)

def clean_filename(x):
    return x.replace(' ', '_')

def ioz(val):
    try:
        return int(val)
    except ValueError:
        return 0

def ion(val):
    try:
        return int(val)
    except ValueError:
        return None

def foz(val):
    try:
        return float(val)
    except ValueError:
        return 0

def fon(val):
    try:
        return float(val)
    except ValueError:
        return None

def get_demographic_population(data):
    sheet_name = 'demographic RH & HS data'
    sheet = book.sheet_by_name(sheet_name)
    for idx in range(sheet.nrows):
        values = sheet.row_values(idx)
        country = values[0]
        datum = data.setdefault(country, {})
        datum['country_name'] = values[0]
        datum['total-population'] = ioz(values[1])
        datum['under5-population'] = ioz(values[3])
        datum['births'] = foz(values[5])
        datum['adolescent-birth'] = round(foz(values[7]))
        datum['abortion-status'] = ioz(values[15])
        datum['access-contraceptives'] = False # Need data to figure out how this is calculated
        datum['family-planning'] = foz(values[13])
        datum['doctors'] = foz(values[9])
    
def get_demographic_data(data):
    sheet_name = 'demographic data charts'
    sheet = book.sheet_by_name(sheet_name)
    no_nones = lambda x : x[1] is not None

    def get_year_range(values):
        years = filter(lambda x: x != None, [ion(values[1]), ion(values[3]), ion(values[5])])
        if len(years) > 0:
            return (years[0] - 2, years[-1] + 2)
        return (None, None)

    for idx in range(sheet.nrows):
        values = sheet.row_values(idx)
        country = values[0]
        datum = data.setdefault(country, {})
        datum['maternal-mortality'] = {
            'data': filter(no_nones, [[1990, fon(values[1])], [2000, fon(values[2])], [2013, fon(values[3])]]),
            'year_range': [1988, 2015],
            'mdg': fon(values[4])
        }

        datum['under5-mortality'] = {
            'data': filter(no_nones, [[1990, fon(values[6])], [2000, fon(values[7])], [2013, fon(values[8])]]),
            'year_range': [1988, 2015],
            'mdg': fon(values[9])
        }

        ymin = [values[12], values[14], values[16]]
        datum['stunting'] = {
            'data': filter(no_nones, [[ion(values[12]), fon(values[11])], [ion(values[14]), fon(values[13])], [ion(values[16]), fon(values[15])]]),
            'year_range': get_year_range(values[11:17]),
        }

        datum['neonatal-mortality'] = {
            'data': filter(no_nones, [[1990, fon(values[18])], [2000, fon(values[19])], [2013, fon(values[20])]]),
            'year_range': [1988, 2015],
        }
        
    return data

def get_quintiles(data):
    sheet_name = 'Coverage indicators & quintiles'
    sheet = book.sheet_by_name(sheet_name)

        
    for idx in range(sheet.nrows):
        values = sheet.row_values(idx)

        def extract(idx):
            return {'bottom' : foz(values[idx + 1]), 'value' : foz(values[idx]), 'top' : foz(values[idx + 2])}

        country = values[0]
        datum = data.setdefault(country, {})
        datum['quintile'] = {
            'contraception': extract(1),
            'antenatal': extract(6),
            'prevention': extract(11),
            'birth-attendants': extract(16),
            'post-natal': extract(21),
            'breast-feeding': extract(26),
            'dpt3': extract(31),
            'pneumonia': extract(36)
        }

    return data


def get_flag(data):
    clean_country = clean_filename
    for country, values in data.items():
        try:
            fname = 'flags/%s.png' % clean_country(country)
            fp = open(fname, "rb")
            binary = fp.read()
            encoded = base64.encodestring(binary)
            values['flag'] = encoded
        except IOError:
            pass
    return data

def blank_is_none(x):
    if str(x).strip() == '' or str(x).lower() == 'no data':
        return None
    else:
        return x


def str_to_ivalue(x):
    x = str(x).strip().lower()
    if x == 'yes':
        return 'Y'
    elif x == 'no':
        return 'N'
    elif x == 'partial':
        return 'Partial'
    return None

def visit_rows(sheet_name, func, data):
    sheet = book.sheet_by_name(sheet_name)

    for idx in range(sheet.nrows):
        row_values = sheet.row_values(idx)
        country = row_values[0]
        datum = data.setdefault(country, {})
        func(datum, row_values)


def get_vital_events(datum, row_values):

    indicators = datum.setdefault('indicators', {})

    indicators['births-registered'] = blank_is_none(row_values[1])
    indicators['deaths-registered'] = blank_is_none(row_values[4])    
    indicators['mdsr'] = str_to_ivalue(row_values[7])
    indicators['crvs'] = str_to_ivalue(row_values[19])

def get_health_indicators(datum, row_values):

    indicators = datum.setdefault('indicators', {})
    indicators['stats-available'] = str_to_ivalue(row_values[1])

def get_health_indicators_impact(datum, row_values):

    indicators = datum.setdefault('indicators', {})
    indicators['impact-indicators'] = str_to_ivalue(row_values[1])

def get_ehealth(datum, row_values):

    indicators = datum.setdefault('indicators', {})
    indicators['ehealth-strategy'] = str_to_ivalue(row_values[1])

def get_compacts(datum, row_values):

    indicators = datum.setdefault('indicators', {})
    indicators['country-compact'] = str_to_ivalue(row_values[1])

def get_resource_tracking(datum, row_values):

    indicators = datum.setdefault('indicators', {})
    indicators['health-expenditure'] = str_to_ivalue(row_values[1])
    indicators['health-per-capita'] = fon(row_values[2]) # TODO find this
    indicators['rmnch'] = str_to_ivalue(row_values[5])
    indicators['annual-rmnch'] = blank_is_none(row_values[6])

def get_rwc(datum, row_values):

    indicators = datum.setdefault('indicators', {})
    indicators['rmnch-expenditure'] = str_to_ivalue(row_values[1])

def get_rwc(datum, row_values):

    indicators = datum.setdefault('indicators', {})
    indicators['rmnch-expenditure'] = str_to_ivalue(row_values[1])
        
def get_national_oversight(datum, row_values):

    indicators = datum.setdefault('indicators', {})
    indicators['annual-review'] = str_to_ivalue(row_values[1])
    indicators['progress-assessment'] = str_to_ivalue(row_values[4])

def get_transparency(datum, row_values):

    indicators = datum.setdefault('indicators', {})
    indicators['sector-performance'] = str_to_ivalue(row_values[1])
        
def parse():
    data = {}

    get_demographic_population(data) 
    get_demographic_data(data)
    get_quintiles(data)
    get_flag(data)

    visit_rows('Vital events', get_vital_events, data)
    visit_rows('Health indicators (coverage)', get_health_indicators, data)
    visit_rows('Health indicators (impact)', get_health_indicators_impact, data)
    visit_rows('Innovation & eHealth', get_ehealth, data)
    visit_rows('Country Compacts', get_compacts, data)
    visit_rows('Resource tracking', get_resource_tracking, data)
    visit_rows('Reaching Women & children', get_rwc, data)
    visit_rows('National oversight', get_national_oversight, data)
    visit_rows('Transparency', get_transparency, data)
    return data
    
parse()
