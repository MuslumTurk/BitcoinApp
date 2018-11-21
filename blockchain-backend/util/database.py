# *-* coding: utf-8 *-*
# Copyright (c) 2017 Wisdomera Inc. <info@wisdomera.io>
from config.database import database_uri, database_username, database_password
from couchbase.cluster import Cluster
from couchbase.cluster import PasswordAuthenticator

class Database(object):

    def __init__(self):
        self.cluster = Cluster(database_uri)
        self.authenticator = PasswordAuthenticator(database_username, database_password)
        self.cluster.authenticate(self.authenticator)

    def get_bucket(self, bucket='stream_data'):
        bucket = self.cluster.open_bucket(bucket)
        return bucket

class MemcachedProxy(object):

    def __init__(self):
        self.cluster = Cluster(database_uri)
        self.authenticator = PasswordAuthenticator(database_username, database_password)
        self.cluster.authenticate(self.authenticator)

    def get(self, key, bucket='stream_data'):
        bucket = self.cluster.open_bucket(bucket)
        return bucket.get(key).value

    def set(self, key, data, bucket='stream_data'):
        bucket = self.cluster.open_bucket(bucket)
        return bucket.upsert(key, data)

    def delete(self, key, bucket='stream_data'):
        bucket = self.cluster.open_bucket(bucket)
        return bucket.delete(key)