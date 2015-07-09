import re
def format_thousands(x):
    try:
        return '{:,}'.format(x).replace(',', ' ')
    except ValueError:
        return x

def clean_filename(x):
    x = re.sub('[, &]', '_', x)
    return re.sub('_+', '_', x)

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

