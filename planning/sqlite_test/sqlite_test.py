import sqlite3

class Soccer_Player:
    def __init__(self, name, team, position):
        self.name = name
        self.team = team
        self.position = position

# conn = sqlite3.connect(':memory:')
# replace :memory: with path to database.db
conn = sqlite3.connect('planning/sqlite_test/sqlite_test.db')

c = conn.cursor()

# c.execute('''CREATE TABLE soccer_players (
#     name text,
#     team text,
#     position text );''')
# conn.commit()
# conn.close

##### TEST
# CLI: sqlite3 planning/sqlite_test/sqlite_test.db
# sqlite> .tables
# soccer_players

# c.execute('''INSERT INTO soccer_players VALUES 
#           ('Nick Edwards', 'Seattle Sounders FC', 'MF'),
#           ('Jordan Morris', 'Seattle Sounders FC', 'F'),
#           ('Lionel Messi', 'Inter Miami FC', 'F');'''
#           )

# c.execute('''INSERT INTO soccer_players VALUES 
#           ('Migeuel Almiron', 'Atlanta United', 'MF'),
#           ('Stefan Frei', 'Seattle Sounders FC', 'GK'),
#           ('Sergio Busquets', 'Inter Miami FC', 'F');'''
#           )

# c.execute('''SELECT * FROM soccer_players LIMIT 5;''')
# print(c.fetchone())     # Returns the first row as tuple
# print(c.fetchmany(2))   # Returns 2 rows as tuples in a list
# print(c.fetchall())     # Returns all rows as tuples in a list

# c.execute('''SELECT * FROM soccer_players WHERE team = 'Seattle Sounders FC';''')
# print(c.fetchall())

#####   #####   #####   #####

# plyr_1 = Soccer_Player('Christian Benteke', 'DC United', 'F')
# plyr_2 = Soccer_Player('Nico Lodeiro', 'Orlando City', 'MF')

# c.execute("INSERT INTO soccer_players VALUES (?,?,?)", (plyr_1.name, plyr_1.team, plyr_1.position))
### below better practice, more readable
# c.execute("INSERT INTO soccer_players VALUES (:name, :team, :position)", {'name': plyr_2.name, 'team': plyr_2.team, 'position': plyr_2.position })

# c.execute('''SELECT * FROM soccer_players WHERE team <> 'Seattle Sounders FC';''')
# print(c.fetchall())

# plyr_3 = Soccer_Player('Kalani Kossa-Rienzi', 'Tacoma Defiance', 'F')
# plyr_4 = Soccer_Player('Emmanuel Latte Lath', 'Atlanta United', 'F')
# plyr_5 = Soccer_Player('Chucky Lozano', 'San Diego FC', 'MF')
# plyr_list = [plyr_3, plyr_4, plyr_5]

# for player in plyr_list:
#     c.execute("INSERT INTO soccer_players VALUES (:name, :team, :position)", {'name': player.name, 'team': player.team, 'position': player.position })

# c.execute('''SELECT COUNT(*) FROM soccer_players;''')
# print(c.fetchall())

# conn.commit()
# conn.close

def insert_players(player):
    with conn:      # removes need for conn.commit()
        c.execute("INSERT INTO soccer_players VALUES (:name, :team, :position)", {'name': player.name, 'team': player.team, 'position': player.position })
        
        
def get_view(season):
    pass
    # SELECT statemetns to not eed to be committed (no need for with conn:)