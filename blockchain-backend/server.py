# Copyright (c) 2017 Wisdomera Inc. <info@wisdomera.io>

"""
Application entry-point.
"""

import tornado.httpserver
import tornado.ioloop
import sys
from config.routes import application

if __name__ == "__main__":

    argv = ['migrate', '--help']

    if len(sys.argv) > 1:
        if sys.argv[1] == "--help":
            print "Type server.py help <subcommand>' for help on a specific subcommand. \n# runserver "
        elif sys.argv[1] == "runserver":
            sys.stdout.write("\033[0;32m")
            print "Server started"
            http_server = tornado.httpserver.HTTPServer(application)
            http_server.listen(8888)
            tornado.ioloop.IOLoop.instance().start()
        else:
            sys.stdout.write("\033[1;31m")
            print "unknow command, you need --help"
            sys.exit(0)
    else:
        sys.stdout.write("\033[1;31m")
        print "unknow command, you need --help"
        sys.exit(0)
