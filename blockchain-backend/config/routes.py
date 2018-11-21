# Copyright (c) 2017 Wisdomera Inc. <info@wisdomera.io>

"""
Routing configuration.
"""

import tornado.httpserver
import tornado.web

from handlers.bitfinex import BitfinexHandler

routes = [
    (r"/app/bitfinex", BitfinexHandler, dict(view='all')),
    (r"/app/bitfinex/new", BitfinexHandler, dict(view='new')),
]

application = tornado.web.Application(routes, template_path='view/', autoreload=True, debug=True)
