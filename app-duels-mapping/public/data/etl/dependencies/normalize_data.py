def find_none(data):
    for i, r in enumerate(data):
        for k, v in r.items():
            if isinstance(v, str) and v.strip().lower() == "none":
                print(f"[Row {i}] String 'None' found in column '{k}': {r}")


def normalize_none_to_null(row):
    """ Normalize None values in a row dictionary to actual None (not 'None' strings) """
    return {
        k: None if (v is None or (isinstance(v, str) and v.strip().lower() == "none")) else v
        for k, v in dict(row).items()
    }


def normalize_row(row):
    return {
        k: None if (v is None or (isinstance(v, str) and v.strip().lower() == "none")) else v
        for k, v in dict(row).items()
    }
