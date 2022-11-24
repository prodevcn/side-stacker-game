import os
import uuid
from flask import Flask, jsonify, send_from_directory, abort
from flask_sock import Sock
from flask_cors import CORS
from controllers.connection_controller import GameConnectionController
from controllers.db_controller import DBController

app = Flask(__name__, static_folder='build')
CORS(app, resources={r"/api/*": {"origins": "*"}})
sock = Sock(app)

game_connection_controller = GameConnectionController(app.logger)
db_controller = DBController()


@app.route('/api/game', methods=['POST'])
def create_game():
    game_instance = game_connection_controller.new_game()
    db_controller.manage_game(game_instance)
    game_id = game_instance.id
    return jsonify({'id': game_id})


@sock.route('/api/game/<game_id>')
def connect_socket(ws, game_id):
    if game_id is None or not game_connection_controller.exist_game(game_id):
        return jsonify(abort(404, 'Game not found'))

    player_id = str(uuid.uuid4()).split('-')[-1]
    try:
        game_connection_controller.add_connection(game_id, ws, player_id)
    except ValueError:
        return jsonify(abort(404, 'Game not found'))

    while True:
        try:
            data = ws.receive()
            game_connection_controller.handle_client_message(
                game_id, player_id, data)
        except ConnectionError:
            app.logger.warning('[gId: %s][pId: %s] A player disconnected')
            game_connection_controller.close_connection(game_id, player_id)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != '' and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
