import tornado.web
from util.catalog import BaseCatalog
from handlers import BaseHandler
import json

class BitfinexHandler(BaseHandler):

    def initialize(self, view):
        self.view = view

    def prepare(self):
        super(BitfinexHandler, self).prepare()
        self.catalog = BaseCatalog('streamdata')

    def get(self):
        data = self.catalog.get()
        self.write({'result': data.value[-10:]})

    def post(self):
        data = self.arguments
        print data

    def put(self):
        data = self.catalog.upsert_data(self.arguments)

    def delete(self, p_uuid, d_uuid):
        print 'DELETEE :'
        
