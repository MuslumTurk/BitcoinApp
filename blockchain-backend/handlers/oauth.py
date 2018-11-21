import tornado.web
import oauth2
import json,time

class OAuth2Handler(tornado.web.RequestHandler):
    # Generator of tokens (with client authentications)
    def initialize(self, controller):
        self.controller = controller

    def post(self):
        response = self._dispatch_request()

        self._map_response(response)

    def _dispatch_request(self):
        request = self.request
        request.post_param = lambda key: json.loads(request.body.decode())[key]

        return self.controller.dispatch(request, environ={})

    def _map_response(self, response):
        for name, value in list(response.headers.items()):
            self.set_header(name, value)

        self.set_status(response.status_code)
        self.write(response.body)