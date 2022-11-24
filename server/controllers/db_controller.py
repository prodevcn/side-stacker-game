from sqlite3 import Connection
from libs.game_events import GameOver, PiecePlaced
from libs.game_core import GameCore
import os


class DBController:
    def __init__(self, file='db.sqlite3'):
        self.file = file
        self.initialize()

    def initialize(self):
        with Connection(self.file) as conn:
            with open('init-db.sql', 'r') as f:
                script = f.read()
                cur = conn.cursor()
                cur.executescript(script)
                cur.close()

    def manage_game(self, game_instance: GameCore):
        game_instance.add_observer(self.process_game_events)
        self.create_game(game_instance.id)

    def create_game(self, game_id):
        with Connection(self.file) as conn:
            cur = conn.cursor()
            cur.execute('insert into game(id) values (?)', (game_id,))
            cur.close()

    def add_move(self, game_id, row, side, piece, turn):
        with Connection(self.file) as conn:
            cur = conn.cursor()
            cur.execute('insert into movement (game_id, row, side, piece, turn) values (?, ?, ?, ?, ?)',
                        (game_id, row, side, piece, turn))
            cur.close()

    def save_winner(self, game_id, winner):
        with Connection(self.file) as conn:
            cur = conn.cursor()
            cur.execute(
                'update game set winner = ? where id = ?', (winner, game_id))
            cur.close()

    def process_game_events(self, e):
        if isinstance(e, GameOver):
            self.save_winner(
                e.game_id, 'draw' if e.winner is None else e.winner)
        elif isinstance(e, PiecePlaced):
            self.add_move(e.game_id, e.row, e.side, e.player, e.turn)
