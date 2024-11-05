from flask import Flask, jsonify, request
from blackjack import BlackJackGame

app = Flask(__name__)
game = BlackJackGame()

@app.route('/api/new-game', methods=['POST'])
def new_game():
    game.start_new_game()
    return jsonify({
        'playerHand': game.player_hand,
        'dealerHand': game.dealer_hand,
        'playerScore': game.player_score,
        'dealerScore': game.dealer_score
    })

@app.route('/api/hit', methods=['POST'])
def hit():
    game.player_hit()
    return jsonify({
        'playerHand': game.player_hand,
        'playerScore': game.player_score
    })

@app.route('/api/stand', methods=['POST'])
def stand():
    game.player_stand()
    return jsonify({
        'dealerHand': game.dealer_hand,
        'dealerScore': game.dealer_score
    })

@app.route('/api/game-state', methods=['GET'])
def game_state():
    return jsonify({
        'playerHand': game.player_hand,
        'dealerHand': game.dealer_hand,
        'playerScore': game.player_score,
        'dealerScore': game.dealer_score
    })

if __name__ == '__main__':
    app.run(debug=True)
