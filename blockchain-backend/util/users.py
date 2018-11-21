# *-* coding: utf-8 *-*
import json
from util.database import Database
from couchbase.n1ql import N1QLQuery
from couchbase.exceptions import NotFoundError
from datetime import datetime
import os, sys, uuid, hashlib

class CreateSuper():

    def __init__(self, user):
        self.bucket = Database().get_bucket('auth')
        self._create_user(user)

    def _hash_password(self, password):
        salt = uuid.uuid4().hex
        return hashlib.sha256(salt.encode() + password.encode()).hexdigest() + ':' + salt

    def _create_user(self, user):
		required_areas = ['username', 'first_name', 'last_name', 'password', 'email']
		username = user['username']
		if username:
			try:
				is_user = self.bucket.get('user_' + username)
				sys.stdout.write("\033[1;31m")
				print "Username is already used or invalid"      
				sys.stdout.write("\033[0;32m")          
			except NotFoundError:
				user_id = str(uuid.uuid4())        
				cb_value = {}
				for area in required_areas:
					print area, ">>", user[area]
					if area == 'password':
						 user[area] = self._hash_password(user[area])
					
					cb_value[area] = user[area]
					cb_value["group"] = "superuser"
					cb_value["type"] = "users"
					cb_value["created_at"] = datetime.now().isoformat()
					cb_value["permissions_result"] = []

				group_super_user = self.bucket.get('group_super_user')

				for permissions in group_super_user.value["permissions"]:
					cb_value["permissions_result"].append(permissions["caption"])

				cb_value["group"] = "superuser"
				cb_value["type"] = "users"
				cb_value["created_at"] = datetime.now().isoformat()
				res = self.bucket.upsert("user_" + username, cb_value)

				if res:
					print "Addend New User"
				else:
					sys.stdout.write("\033[1;31m")
					print "Error"
					sys.stdout.write("\033[0;32m")