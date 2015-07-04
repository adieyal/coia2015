import xlrd
import os
import base64
from misc import fon, foz, ion, ioz, clean_filename
from PIL import Image

FILENAME = "data/dp.xlsx"
book = xlrd.open_workbook(FILENAME)

def get_oda_total(data):
    sheet_name = 'ODA total 2000-2015'
    sheet = book.sheet_by_name(sheet_name)

    for idx in range(sheet.nrows):
        values = sheet.row_values(idx)
        donor = values[0].strip()
        datum = data.setdefault(donor, {})
        commitments = datum.setdefault('commitments', {})
        commitments['data'] = [
            ('2000-2001' , foz(values[1]), foz(values[2]) / 100),
            ('2002-2004' , foz(values[3]), foz(values[4]) / 100),
            ('2005-2007' , foz(values[5]), foz(values[6]) / 100),
            ('2008-2010' , foz(values[7]), foz(values[8]) / 100),
            ('2011-2013' , foz(values[9]), foz(values[10]) / 100)
        ]

        commitments['figure'] = { 'value' : foz(values[11]) / 100, 'year' : '2011-13' }
        commitments['text'] = values[12]

def get_health_total(data):
    sheet_name = 'Health total 2000-2015'
    sheet = book.sheet_by_name(sheet_name)

    for idx in range(sheet.nrows):
        values = sheet.row_values(idx)
        donor = values[0].strip()
        datum = data.setdefault(donor, {})
        commitments = datum.setdefault('health-total', {})
        commitments['data'] = [
            ('2000-2001' , foz(values[1]), foz(values[2])),
            ('2002-2004' , foz(values[3]), foz(values[4])),
            ('2005-2007' , foz(values[5]), foz(values[6])),
            ('2008-2010' , foz(values[7]), foz(values[8])),
            ('2011-2013' , foz(values[9]), foz(values[10]))
        ]

        commitments['figure'] = { 'value' : foz(values[11]), 'year' : '2011-13' }
        commitments['text'] = values[12]

def get_rmnch(data):
    sheet_name = 'RMNCH 2000-2015'
    sheet = book.sheet_by_name(sheet_name)

    for idx in range(sheet.nrows):
        values = sheet.row_values(idx)
        donor = values[0].strip()
        datum = data.setdefault(donor, {})
        rmnch = datum.setdefault('rmnch', {})
        rmnch['data'] = [
            ('2008', foz(values[1]), foz(values[2])),
            ('2009', foz(values[3]), foz(values[4])),
            ('2010', foz(values[5]), foz(values[6])),
            ('2011', foz(values[7]), foz(values[8])),
            ('2012', foz(values[9]), foz(values[10]))
        ]

        rmnch['figure'] = { 'value' : foz(values[11]), 'year' : '2011-13' }
        rmnch['text'] = values[12]

def get_intermediaries(data):
    sheet_name = 'Resources through intermediarie'
    sheet = book.sheet_by_name(sheet_name)
    
    for idx in range(sheet.nrows):
        values = sheet.row_values(idx)
        donor = values[0].strip()
        datum = data.setdefault(donor, {})
        datum['bimulti'] = [
            ('2010', foz(values[1]), foz(values[2]), 0, 0),
            ('2011', foz(values[3]), foz(values[4]), 0, 0),
            ('2012', foz(values[5]), foz(values[6]), 0, 0),
            ('2013', foz(values[7]), foz(values[8]), 0, 0),
            ('2014', foz(values[9]), foz(values[10]), 0, 0)
        ]

def get_transparency(data):
    sheet_name = 'Transparency'
    sheet = book.sheet_by_name(sheet_name)
    
    for idx in range(sheet.nrows):
        values = sheet.row_values(idx)
        donor = values[0].strip()
        datum = data.setdefault(donor, {})
        num = ioz(values[1])
        den = ioz(values[2])
        
        if num < den:
            vector = 'up'
        elif num > den:
            vector = 'down'
        else:
            vector = 'no change'
        datum['transparency'] = {
            'numerator' : num,
            'denominator' : 68,
            'vector' : vector
        }

def get_pledges(data):
    sheet_name = 'Pledges'
    sheet = book.sheet_by_name(sheet_name)
    
    for idx in range(sheet.nrows):
        values = sheet.row_values(idx)
        donor = values[0].strip()
        datum = data.setdefault(donor, {})
        
        datum['pledges'] = [
            values[1], values[2], values[3],
            values[4], values[5]
        ]
        print donor, datum['pledges'][0]
        print ""

def get_contact(data):
    sheet_name = 'Contact+'
    sheet = book.sheet_by_name(sheet_name)
    for idx in range(sheet.nrows):
        values = sheet.row_values(idx)
        donor = values[0].strip()
        datum = data.setdefault(donor, {})
        
        datum['contact'] = {
            'address' : values[1],
            'website' : values[2]
        }

def get_funder_type(data):
    sheet_name = 'Contact+'
    sheet = book.sheet_by_name(sheet_name)
    for idx in range(sheet.nrows):
        values = sheet.row_values(idx)
        donor = values[0].strip()
        datum = data.setdefault(donor, {})
        
        datum['donor_type'] = {
            'funder' : values[3].lower() == 'yes',
            'financial_intermediary' : values[4].lower() == 'yes',
            'dac_member' : values[5].lower() == 'yes',
            'crs_reports' : values[6].lower() == 'yes',
        }

def get_flag(data):
    clean_donor = clean_filename
    for donor, values in data.items():
        try:
            fname = 'donor_logos/%s.png' % clean_donor(donor)
            im = Image.open(fname)
            width, height = im.size
            fp = open(fname, "rb")
            binary = fp.read()
            encoded = base64.encodestring(binary)
            values['flag'] = {
                'data' : encoded,
                'width' : width,
                'height' : height
            }
        except IOError:
            pass
    return data

def parse():
    data = {}
    get_oda_total(data)
    get_health_total(data)
    get_rmnch(data)
    get_intermediaries(data)
    get_transparency(data)
    get_pledges(data)
    get_contact(data)
    get_funder_type(data)
    get_flag(data)

    return data

parse()
