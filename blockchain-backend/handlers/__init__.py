import tornado.web
import json,time

class BaseHandler(tornado.web.RequestHandler):

    def initialize(self, view=None):
        self.view = view

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with, Content-Type, Authorization")
        self.set_header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
        self.set_header('Access-Control-Allow-Credentials', "true")

    def prepare(self):
        if not self.request.method=='OPTIONS':
            if self.request.method in ['POST', 'PUT']:
                try:
                    self.arguments = json.loads(self.request.body)
                except:
                    self.arguments = {}
            else:
                try:
                    query = self.request.uri.split('?')[1]
                    self.query_data = {q.split('=')[0] : q.split('=')[1] for q in query.split('&')}
                except:
                    self.query_data = {}
        else:
            self.set_status(204)
            self.finish()