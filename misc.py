def clean_filename(x):
    return x.replace(',', '_').replace(' ', '_').replace('__', '_')

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

