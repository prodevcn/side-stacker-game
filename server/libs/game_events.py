from typing import Literal, Optional


class GameEvent:
    def __init__(self, game_id: str):
        self.game_id = game_id


class PlayerConnected(GameEvent):
    def __init__(self, game_id: str, player_id: str, join_type:str, player: Literal['X', 'O'], turn_order: Literal[0, 1]):
        super().__init__(game_id)
        self.player_id = player_id
        self.player = player
        self.turn_order = turn_order
        self.join_type = join_type


class PlayerDisconnected(GameEvent):
    def __init__(self, game_id: str, player: Literal['X', 'O']):
        super().__init__(game_id)
        self.player = player


class GameOver(GameEvent):
    def __init__(self, game_id: str, winner: Optional[Literal['X', 'O']]):
        super().__init__(game_id)
        self.winner = winner


class PiecePlaced(GameEvent):
    def __init__(self, game_id: str, player: Literal['X', 'O'], row: int, side: Literal['L', 'R'], turn: int):
        super().__init__(game_id)
        self.player = player
        self.row = row
        self.side = side
        self.turn = turn


class PiecePlacedError(GameEvent):
    def __init__(self, game_id: str, player_id: str, turn: int, detail: str):
        super().__init__(game_id)
        self.player_id = player_id
        self.turn = turn
        self.detail = detail


class PlayerInfo(GameEvent):
    def __init__(self, game_id: str, players):
        super().__init__(game_id)
        self.players = players

class PlayerRejoin(GameEvent):
    def __init__(self, game_id: str, board, turn):
        super().__init__(game_id)
        self.board = board
        self.turn = turn