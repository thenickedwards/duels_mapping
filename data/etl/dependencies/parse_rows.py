# PARSED ROW MODULE?
def parse_row_by_element(row, element): 
    """ Take in an HTML element tag, return list of strings.   """
    return [str(x.string) for x in row.find_all(element)]

def parse_row_by_element_class(row, element, attribute): 
    """ Take in an HTML element tag and class, return list of strings.   """
    return [str(x.string) for x in row.find_all(element, class_=f"{attribute}")]

def parse_row_by_element_style(row, element, attribute): 
    """ Take in an HTML element tag and style, return list of strings.   """
    return [str(x.string) for x in row.find_all(element, style=f"{attribute}")]

def parse_nations(table):
    list_of_parsed_nations = []
    for nation_cell in table.find_all("td", {"data-stat": "nationality"}):
        if nation_cell.find("span", style="white-space: nowrap"):
            nation_text = str(nation_cell.find("span", style="white-space: nowrap").contents[-1]).strip()
            list_of_parsed_nations.append(nation_text)
        else:
            # No nation present
            list_of_parsed_nations.append(None)
    return list_of_parsed_nations


# def parse_row_by_element_attribute(row, element, attribute): 
#     """ Take in an HTML element tag and custom attribute, return list of strings.   """
#     return [str(x.attrs.keys()) for x in row.find_all(element)]

# def parse_row_by_element_attribute_kvp(row, element, attr_key, value): 
#     """ Take in an HTML element tag and custom attribute key and value, return list of strings.   """
#     return [str(x.string) for x in row.find_all(element, attr_key=f"{value}")]