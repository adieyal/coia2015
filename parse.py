import xlrd

FILENAME = "data.xlsx"

def ioz(val):
    try:
        return int(val)
    except ValueError:
        return 0

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

def get_demographic_population(book, data):
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
        datum['adolescent-birth'] = foz(values[7])
        datum['abortion-status'] = ioz(values[15])
        datum['access-contraceptives'] = False # Need data to figure out how this is calculated
        datum['family-planning'] = foz(values[13])
        datum['doctors'] = foz(values[9])
    
def get_demographic_data(book, data):
    sheet_name = 'demographic data charts'
    sheet = book.sheet_by_name(sheet_name)
    no_nones = lambda x : x[1] is not None

    for idx in range(sheet.nrows):
        values = sheet.row_values(idx)
        country = values[0]
        datum = data.setdefault(country, {})
        datum['maternal-mortality'] = {
            'data': filter(no_nones, [[1990, fon(values[1])], [2000, fon(values[2])], [2013, fon(values[3])]]),
            'year_range': [1988, 2015],
        }

        datum['under5-mortality'] = {
            'data': filter(no_nones, [[1990, fon(values[6])], [2000, fon(values[7])], [2013, fon(values[8])]]),
            'year_range': [1988, 2015],
        }

        datum['stunting'] = {
            'data': filter(no_nones, [[1990, fon(values[11])], [2000, fon(values[12])], [2012, fon(values[13])]]),
            'year_range': [1988, 2015],
        }

        datum['neonatal-mortality'] = {
            'data': filter(no_nones, [[1990, fon(values[15])], [2000, fon(values[16])], [2013, fon(values[17])]]),
            'year_range': [1988, 2015],
        }
        
    return data

def get_quintiles(book, data):
    sheet_name = 'demographic data charts'
    sheet = book.sheet_by_name(sheet_name)

    for idx in range(sheet.nrows):
        values = sheet.row_values(idx)
        country = values[0]
        datum = data.setdefault(country, {})
        datum['quintile'] = {
            'contraception': {'bottom': 20, 'value': 40, 'top': 60},
            'antenatal': {'bottom': 20, 'value': 40, 'top': 60},
            'prevention': {'bottom': 20, 'value': 40, 'top': 60},
            'birth-attendants': {'bottom': 20, 'value': 40, 'top': 60},
            'post-natal': {'bottom': 20, 'value': 40, 'top': 60},
            'breast-feeding': {'bottom': 20, 'value': 40, 'top': 60},
            'dpt3': {'bottom': 20, 'value': 40, 'top': 60},
            'pneumonia': {'bottom': 20, 'value': 40, 'top': 60}
        }
    return data

def parse():
    book = xlrd.open_workbook(FILENAME)
    data = {}

    get_demographic_population(book, data) 
    get_demographic_data(book, data)
    get_quintiles(book, data)
    return data
    
parse()
