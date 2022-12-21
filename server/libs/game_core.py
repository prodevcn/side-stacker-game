import random
import uuid
from itertools import repeat
from typing import Tuple, Callable
from .game_events import *


class GameCore:
    def __init__(self, game_id=str(uuid.uuid4())):
        self.id = game_id
        self.board = [[None] * 7 for _ in range(7)]
        self.players = {}
        self.dependents = []
        self.turn = 0
        self.player_turn = None

    def connect(self, player_id: str) -> Optional[Tuple[str, int]]:
        if len(self.players) >= 2:
            print("game is full.............!")
            return None
        if player_id in self.players:
            return None
        if len(self.players) == 0:
            self.players[player_id] = ('X' if random.randint(
                0, 1) == 0 else 'O', random.randint(0, 1))
            print('=================', self.players)
        else:
            p1 = next(iter(self.players.values()))
            p2_pieces = 'O' if p1[0] == 'X' else 'X'
            p2_turn = 0 if p1[1] == 1 else 1
            self.players[player_id] = (p2_pieces, p2_turn)
            self.turn = 0
            self.player_turn = p1[0] if p1[1] < p2_turn else p2_pieces

        self.notify(PlayerConnected(
            self.id, player_id, *self.players[player_id]))
        self.notify(PlayerInfo(
            self.id, [{'piece': p, 'turn': t} for (p, t) in self.players.values()]))

        return self.players[player_id]

    def disconnect(self, player_id: str) -> None:
        print('Player disconnect: ', player_id)
        pieces = self.players[player_id]
        del self.players[player_id]
        self.notify(PlayerDisconnected(self.id, pieces))
        self.notify(GameOver(self.id, 'X' if pieces == 'O' else 'O'))

    def place_piece(self, player_id: str, row: int, side: Literal['L', 'R']) -> None:
        if len(self.players) < 2:
            self.notify(PiecePlacedError(self.id, player_id, self.turn,
                        'There should be two players to start the game'))
            return

        if self.players[player_id][0] != self.player_turn:
            self.notify(PiecePlacedError(self.id, player_id, self.turn,
                        'Players should place pieces on their own turn'))
            return

        if not is_move_legal(self.board, row, side):
            self.notify(PiecePlacedError(self.id, player_id, self.turn,
                        'Theres no available space in the selected row'))
            return

        col = get_next_free_position(self.board, row, side)
        self.board[row][col] = self.players[player_id][0]
        winner = evaluate_move(self.board, row, col, self.player_turn)

        if winner:
            self.notify(GameOver(self.id, self.player_turn))
            return
        elif self.turn == 7 * 7:
            self.notify(GameOver(self.id, None))
            return
        else:
            current_turn = self.turn
            current_player = self.player_turn
            self.turn += 1
            self.player_turn = 'X' if self.player_turn == 'O' else 'O'
            self.notify(PiecePlaced(
                self.id, current_player, row, side, current_turn))

    def add_observer(self, cb: Callable[[GameEvent], None]):
        self.dependents.append(cb)

    def notify(self, ev: GameEvent):
        for cb in self.dependents:
            cb(ev)


def get_next_free_position(board, row, side):
    search_iter = range(0, 7) if side == 'L' else range(6, -1, -1)
    for i in search_iter:
        if board[row][i] is None:
            return i

    return None


def is_move_legal(board, row, side):
    search_iter = range(0, 7) if side == 'L' else range(6, -1, -1)
    for i in search_iter:
        if board[row][i] is None:
            return True

    return False


def check_range(board, iter, piece):
    for (r, c) in iter:
        if board[r][c] != piece:
            return False
    return True


def evaluate_move(board, row, col, piece) -> bool:
    consecutive_pieces_to_win = 4

    # Factories for iterators, using the given position
    def increasing_i(p): return range(p + 1, p + consecutive_pieces_to_win)
    def decreasing_i(p): return range(p - 1, p - consecutive_pieces_to_win, -1)
    def fixed_i(p): return repeat(p, consecutive_pieces_to_win)

    def bound_check_inc(p): return p + consecutive_pieces_to_win <= 7
    def bound_check_dec(p): return p - (consecutive_pieces_to_win - 1) >= 0

    # Check combinations of ranges that can win:
    # Horizontally to the right:
    if bound_check_inc(col) and \
            check_range(board, zip(fixed_i(row), increasing_i(col)), piece):
        return True
    # Horizontally to the left:
    if bound_check_dec(col) and \
            check_range(board, zip(fixed_i(row), decreasing_i(col)), piece):
        return True
    # Vertically to the bottom
    if bound_check_inc(row) and \
            check_range(board, zip(increasing_i(row), fixed_i(col)), piece):
        return True
    # Vertically to the top
    if bound_check_dec(row) and \
            check_range(board, zip(decreasing_i(row), fixed_i(col)), piece):
        return True
    # Diagonally to top-left
    if bound_check_dec(row) and \
        bound_check_dec(col) and \
            check_range(board, zip(decreasing_i(row), decreasing_i(col)), piece):
        return True
    # Diagonally to bottom-left
    if bound_check_inc(row) and \
            bound_check_dec(col) and \
            check_range(board, zip(increasing_i(row), decreasing_i(col)), piece):
        return True
    # Diagonally to top right
    if bound_check_dec(row) and \
            bound_check_inc(col) and \
            check_range(board, zip(decreasing_i(row), increasing_i(col)), piece):
        return True
    # Diagonally to bottom right
    if bound_check_inc(row) and \
            bound_check_inc(col) and \
            check_range(board, zip(increasing_i(row), increasing_i(col)), piece):
        return True

    return False
