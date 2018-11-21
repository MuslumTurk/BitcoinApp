# *-* coding: utf-8 *-*
# Copyright (c) 2017 Wisdomera Inc. <info@wisdomera.io>
from util.database import Database
from couchbase.n1ql import N1QLQuery
from datetime import datetime
from imp import load_source
import os

class BaseCatalog(object):
    """docstring for BaseCatalog"""

    def __init__(self, bucket='streamdata'):
        self.bucket_name = bucket
        self.bucket = Database().get_bucket(bucket)
        super(BaseCatalog, self).__init__()

    def upsert_data(self, data):
        if len(data) > 0:
            try:
                get_data = self.bucket.get('stream_data')
                push_data = self.control_bucket(get_data, data)
                self.bucket.upsert('stream_data', push_data.value)
            except Exception as e:
                self.bucket.upsert('stream_data', data)
                
    def get(self):
        data = self.bucket.get('stream_data')
        if data:
            return data
        else:
            return []

    def control_bucket(self, stream_data, data):
        for row in stream_data.value:
            for dat in data:
                if dat['key'] == row['key']:
                    row['value'].append(dat['value'][0])

        return stream_data

    def get_bucket(self):
        return self.bucket

    def convert_key(self, uuid):
        print "KEY : ",self.name,uuid
        return '%s_%s' % (self.name, uuid)

    def load_catalog(self):
        # TODO: wont impot files use object references instead
        file_name = '{}.py'.format(self.name)
        load = load_source(file_name, os.path.join(os.path.abspath('../src/catalogs'), file_name))
        return load.catalog
