import random
import time

from .game_core import is_move_legal, get_next_free_position, evaluate_move
from .game_events import *


class Bot:
    def __init__(self, game_instance, player_id, board=None):
        self.game = game_instance
        self.player_id = player_id
        self.turn = None
        self.board = board or [[None] * 7 for _ in range(7)]
        self.player_piece = None

    def send(self, v):
        pass

    def close(self):
        pass

    def process_game_events(self, event):
        if isinstance(event, PlayerConnected):
            self._handle_player_connected(event)
        elif isinstance(event, PlayerDisconnected):
            pass
        elif isinstance(event, PlayerInfo):
            self._handle_player_info(event)
            pass
        elif isinstance(event, GameOver):
            pass
        elif isinstance(event, PiecePlaced):
            self._handle_piece_placed(event)
        elif isinstance(event, PiecePlacedError):
            print('Piece placed error: %s' % event.detail)
            pass

    def _handle_player_connected(self, event: PlayerConnected):
        self.player_piece = event.player
        self.turn = event.turn_order

    def _handle_player_info(self, event: PlayerInfo):
        if self.turn == 0:
            # Delay piece placement until client UI is ready
            time.sleep(1)
            self.do_move()

    def get_available_moves(self):
        available_moves = set()

        for r in range(7):
            if is_move_legal(self.board, r, 'L'):
                col = get_next_free_position(self.board, r, 'L')
                available_moves.add(('L', r, col))

            if is_move_legal(self.board, r, 'R'):
                col = get_next_free_position(self.board, r, 'R')
                available_moves.add(('R', r, col))

        return available_moves

    def get_winning_moves_for_piece(self, available_moves, piece):
        winning_moves = set()

        for (side, row, col) in available_moves:
            if evaluate_move(self.board, row, col, piece):
                winning_moves.add((side, row))

        return winning_moves

    def get_winning_moves(self, available_moves):
        return self.get_winning_moves_for_piece(available_moves, self.player_piece)

    def get_blocking_moves(self, available_moves):
        return self.get_winning_moves_for_piece(available_moves,
                                                'X' if self.player_piece == 'C' else 'C')

    def do_move(self):
        am = self.get_available_moves()
        wm = self.get_winning_moves(am)
        if len(wm) > 0:
            (side, row) = wm.pop()
            self.game.place_piece(self.player_id, row, side)
            return

        bm = self.get_blocking_moves(am)
        if len(bm) > 0:
            (side, row) = bm.pop()
            self.game.place_piece(self.player_id, row, side)
            return

        rm = random.choice(tuple(am))
        self.game.place_piece(self.player_id, rm[1], rm[0])

    def _handle_piece_placed(self, ev: PiecePlaced):
        row = ev.row
        col = get_next_free_position(self.board, row, ev.side)
        self.board[row][col] = ev.player

        if ev.player != self.player_piece:
            self.do_move()
