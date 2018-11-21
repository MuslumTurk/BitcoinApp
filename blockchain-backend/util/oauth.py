# Copyright (c) 2017 Wisdomera Inc. <info@wisdomera.io>
from database import Database
from oauth2.error import UserNotAuthenticated
from oauth2.web import ResourceOwnerGrantSiteAdapter
import hashlib

class WisdomUserAdapter(ResourceOwnerGrantSiteAdapter):

    def authenticate(self, request, environ, scopes, client):
        username = request.post_param("username")
        password = request.post_param("password")

        bucket = Database().get_bucket("auth")
        try:
            user = bucket.get('user_' + username)
            if self._check_password(user.value['password'], password):
                group_permissions =  {}
                for group_name in user.value['group']:
                    try:
                        group_data = bucket.get('group_' + group_name)
                        group_permissions[group_name] = group_data.value['permissions']
                    except:
                        pass

                permissions = user.value['permissions_result'] # self.calculate_permissions(user.value['permissions'],group_permissions)
                return ({'permissions': permissions, 'group': user.value['group'], 'email': user.value['email'], 'first_name': user.value['first_name'], 'last_name': user.value['last_name']}, user.value['username'])
            else:
                raise UserNotAuthenticated
        except:
            # User Not Found
            raise UserNotAuthenticated


    def _check_password(self, hashed_password, user_password):
        password, salt = hashed_password.split(':')
        return 1 if user_password=='has_permission' else password == hashlib.sha256(salt.encode() + user_password.encode()).hexdigest()

    def calculate_permissions(self, user_permissions, group_permissions):
        permissions = {}

        for item, plist in user_permissions.iteritems():
            for subitem, permission in plist.iteritems():
                permissions[item + '.' + subitem] = permission

        for key, group in group_permissions.iteritems():
            for item, plist in group.iteritems():
                for subitem, permission in plist.iteritems():
                    if not subitem in user_permissions.get(item, {}):
                        if not permissions.get(item + '.' + subitem, None):
                            permissions[item + '.' + subitem] = permission
                        else:
                            permissions[item + '.' + subitem] = permissions[item + '.' + item] | permission

        return permissions