import logging
import uuid
from json import dumps, loads
from libs.game_events import *
from libs.game_core import GameCore
from libs.bot import Bot


class GameConnectionController:
    def __init__(self, logger=logging.getLogger('GameConnectionController')):
        self.games = {}
        self.log = logger

    def new_game(self, with_bot = False):
        game_id = str(uuid.uuid4())
        self.log.info('[gId: %s] A new game was created' % game_id)
        game_instance = self.create_game_instance(game_id)
        self.games[game_id] = {
            'game': game_instance,
            'players': {},
            'with_bot': with_bot
        }

        return game_instance

    def exist_game(self, game_id):
        return game_id in self.games

    def add_connection(self, game_id, ws, player_id, type):
        
        if game_id not in self.games:
            raise ValueError('Invalid game_id')

        self.log.debug('[gId: %s][pId: %s] A player connected' %
                       (game_id, player_id))

        game = self.games[game_id]
        game['players'][player_id] = ws
        
        print('[add_connection]:[game]:', game)

        ss = game['game']
        ss.connect(player_id, type)
        
        """ for bot connection """
        if type == "new":
          if game['with_bot']:
              bot_id = str(uuid.uuid4()).split('-')[-1]
              bot = Bot(ss, bot_id)
              game['players'][bot_id] = bot
              
              ss.add_observer(bot.process_game_events)
              ss.connect(bot_id, type)
            

    def handle_client_message(self, game_id, player_id, message):
        json = loads(message)
        print('[GameConnectionController]:[handle_client_message]', json)
        if 'type' not in json:
            self.log.error(
                "json message doesn't have a type field: %s" % message)
            return

        if json['type'] == 'piece-placement':
            self.log.debug(
                '[gId: %s][pId: %s] A player placed a piece' % (game_id, player_id))
            ss = self.games[game_id]['game']
            ss.place_piece(player_id, json['row'], json['side'])
        elif json['type'] == 'disconnect-player':
            self.log.debug("[gId: %s][pId: %s]:[Player disconnect !]", game_id, player_id)
            # self.games[game_id]['players'].pop(json['player_id'])
            # self.games[game_id]['game'].players.pop(json['player_id'])
            
            # self.close_connection(game_id, player_id)
        else:
            self.log.warning("Unable to handle message of unknown type '%s' of message: '%s'" % (
                json['type'], message))

    def close_connection(self, game_id, player_id):
        game = self.games[game_id]['game']
        game.disconnect(player_id)

    def create_game_instance(self, game_id):
        ss = GameCore(game_id)
        ss.add_observer(self.process_game_events)
        return ss

    def process_game_events(self, e):
        if isinstance(e, PlayerConnected):
            self.on_connect(e)
        elif isinstance(e, PlayerDisconnected):
            self.on_disconnect(e)
        elif isinstance(e, PlayerInfo):
            self.on_player_info(e)
        elif isinstance(e, GameOver):
            self.on_game_over(e)
        elif isinstance(e, PiecePlaced):
            self.on_piece_placed(e)
        elif isinstance(e, PiecePlacedError):
            self.on_piece_placed_error(e)
        elif isinstance(e, PlayerRejoin):
            self.on_player_rejoin(e)

    def on_connect(self, e: PlayerConnected):
        game = self.games[e.game_id]
        ws = game['players'][e.player_id]
        ws.send(dumps({
            'type': 'SET_CONNECT',
            'playerId': e.player_id,
            'player': e.player,
            'turn': e.turn_order
        }))

    def on_disconnect(self, e: PlayerDisconnected):
        game = self.games[e.game_id]
        for (_, ws) in game['players'].items():
            ws.send(dumps({
                'type': 'SET_DISCONNECT',
                'player': e.player
            }))

    def on_player_info(self, e: PlayerInfo):
        game = self.games[e.game_id]
        for (_, ws) in game['players'].items():
            ws.send(dumps({
                'type': 'SET_PLAYER_INFO',
                'players': e.players
            }))

    def on_game_over(self, e: GameOver):
        game = self.games[e.game_id]
        for (_, ws) in game['players'].items():
            ws.send(dumps({
                'type': 'ENDED',
                'winner': e.winner
            }))

            ws.close()

    def on_piece_placed(self, e: PiecePlaced):
        game = self.games[e.game_id]
        for (_, ws) in game['players'].items():
            ws.send(dumps({
                'type': 'PIECE_PLACED',
                'player': e.player,
                'row': e.row,
                'side': e.side,
                'turn': e.turn
            }))

    def on_piece_placed_error(self, e: PiecePlacedError):
        game = self.games[e.game_id]
        ws = game['players'][e.player_id]
        ws.send(dumps({
            'type': 'PIECE_PLACED_ERROR',
            'turn': e.turn
        }))
        
    def on_player_rejoin(self, e: PlayerRejoin):
        game = self.games[e.game_id]
        for (_, ws) in game['players'].items():
            ws.send(dumps({
              'type': 'PLAYER_REJOIN',
              'board': e.board,
              'turn': e.turn
            }))
