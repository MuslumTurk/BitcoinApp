from tornado import websocket, web, ioloop
import json

class Socket(websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True
    def open(self):
        print("WebSocket opened")

    def on_message(self, message):
        self.write_message(u"You said: " + message)
        print message

    def on_close(self):
        print("WebSocket closed")
