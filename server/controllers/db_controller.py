from sqlite3 import Connection
from libs.game_events import GameOver, PiecePlaced, PlayerConnected
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

    def get_game(self, game_id):
        with Connection(self.file) as conn:
            cur = conn.cursor()
            cur.execute('select * from game where id = ?', (game_id,))
            game = cur.fetchone()
            cur.close()
            if game is None:
                return None
            return game

    def create_game(self, game_id):
        with Connection(self.file) as conn:
            cur = conn.cursor()
            cur.execute('insert into game (id) values (?)', (game_id,))
            cur.close()

    def add_move(self, game_id, row, side, piece, turn):
        with Connection(self.file) as conn:
            cur = conn.cursor()
            cur.execute('insert into movement (game_id, row, side, piece, turn) values (?, ?, ?, ?, ?)',
                        (game_id, row, side, piece, turn))
            cur.close()

    def add_player(self, game_id, player_id, piece):
        with Connection(self.file) as conn:
            cur = conn.cursor()
            cur.execute('insert into player (id, piece, game_id) values (?, ?, ?)',
                        (player_id, piece, game_id))
            cur.close()

    def save_winner(self, game_id, winner):
        with Connection(self.file) as conn:
            cur = conn.cursor()
            cur.execute('select id from player where game_id = ? and piece = ?', (game_id, winner))
            winner_id = cur.fetchone()[0]
            cur.execute(
                'update game set winner = ?, status = ? where id = ?', (winner_id, "ended", game_id))
            cur.close()

    def process_game_events(self, e):
        if isinstance(e, GameOver):
            self.save_winner(
                e.game_id, 'draw' if e.winner is None else e.winner)
        elif isinstance(e, PiecePlaced):
            self.add_move(e.game_id, e.row, e.side, e.player, e.turn)
        elif isinstance(e, PlayerConnected):
            if(e.join_type == "new"):
                self.add_player(e.game_id, e.player_id, e.player)
