from flask import Flask, send_from_directory
import os

app = Flask(__name__,
            static_folder='../guardian-angel-web/dist',
            static_url_path='/')

# Route to serve the React index.html


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Example API route


@app.route('/api/data')
def get_data():
    return {"message": "Hello from Flask!"}


@app.errorhandler(404)
def not_found(e):
    # If the error happened on an API route, return JSON
    # Otherwise, return the React app
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)
