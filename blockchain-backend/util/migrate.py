# *-* coding: utf-8 *-*
# Copyright (c) 2017 Wisdomera Inc. <info@wisdomera.io>
from datetime import datetime
from imp import load_source
from util.database import Database
import json
import sys
import os


class Migrate():
    def __init__(self):
        self.bucket = Database().get_bucket("catalog")
        self.removed_items = {'caption', 'translation', 'comment'}
        self.crete_obj()

    def crete_obj(self):
        schema_list = self.get_schema_list()

        for schema in schema_list:
            load = load_source(schema, os.path.join(
                os.path.abspath('../src/schemas'), schema))
            objs = getattr(load, schema.split('.')[0].title())
            objs = objs()

            for schema_item in dir(objs):
                if 'schema_' in schema_item or schema_item == 'schema':
                    schema_value = getattr(objs, schema_item)
                    if schema_item == 'schema':
                        catalog_name = objs.name
                    else:
                        catalog_name = objs.name + '_' + schema_value['name']

                    # try if clean migration
                    try:
                        catalog_load = load_source(catalog_name + ".py", os.path.join(
                            os.path.abspath('../src/catalogs'), catalog_name + ".py"))
                        local_catalog = catalog_load.catalog
                    except:
                        local_catalog = {}

                    schema_value['version'] = self.get_version(catalog_name)
                    schema_value['name'] = catalog_name
                    data = self._remove_some_items(schema_value)

                    # pass save if not changed
                    if self.is_changed(local_catalog, data):
                        # inc version number
                        schema_value['version'] += 1
                        data['version'] += 1

                        with open("catalogs/" + catalog_name + ".py", "wb") as outfile:
                            outfile.write("# *-* coding: utf-8 *-*\ncatalog = ")
                            json.dump(data, outfile, indent=4)
                            sys.stdout.write("\033[0;32m")
                            print "## [Success] Created Schema : ", schema_value['name']
                            self.db_write(catalog_name, schema_value)
                    else:
                        sys.stdout.write("\033[94m")
                        print "## [Pass] Created Already up to date : ", schema_value['name']

    def db_write(self, catalog_name, catalog_data):
        rev_history = {}

        if catalog_data['version'] == 1:
            catalog_data['created_at'] = datetime.now().isoformat()
        else:
            catalog_db = self.bucket.get('catalog_' + catalog_name)
            rev_history = self.clear_unicode(catalog_db.value['revisions'])

        rev_history[str(catalog_data['version'])] = datetime.now().isoformat()
        catalog_data['updated_at'] = datetime.now().isoformat()
        catalog_data['revisions'] = rev_history
        catalog_data['type'] = 'catalog'
        self.save_to_db('catalog_' + catalog_name, catalog_data)
        print "## [Success] DB Schema updated: ", catalog_name
        del catalog_data['revisions']
        rev_name = 'rev_catalog_%s_%s' % (catalog_name, str(catalog_data['version']))
        catalog_data['type'] = 'revision'
        self.save_to_db(rev_name, catalog_data)
        print "## [Success] DB Revision Saved: ", catalog_name

    def _remove_some_items(self, d):
        if not isinstance(d, (dict, list)):
            return d
        if isinstance(d, list):
            return [self._remove_some_items(v) for v in d]
        return {k: self._remove_some_items(v) for k, v in d.items()
                if k not in self.removed_items}

    def get_schema_list(self):
        ret = []
        print os.path.join(os.getcwd(), "schemas")
        for (dirpath, dirnames, filenames) in os.walk(os.path.join(os.getcwd(), "schemas")):
            ret.extend(filenames)

        ret = [filetype for filetype in ret if filetype.split(
            '.')[1] == "py" and filetype != "__init__.py"]
        return ret

    def save_to_db(self, key, values):
        try:
            self.bucket.upsert(key, values)
            sys.stdout.write("\033[1m")
            print "## [Success] Writed DB : ", key
        except Exception, e:
            sys.stdout.write("\033[1;31m")
            print "## [Error] Writed DB : ", key, e

    def get_version(self, key):
        try:
            cb_object = self.bucket.get('catalog_' + key)
            return cb_object.value['version']
        except Exception, e:
            return 0  # Default version for first migrate

    def clear_unicode(self, data):
        ret = {}
        for k in data.keys():
            ret[k.encode('ascii', 'ignore')] = data[k].encode('ascii', 'ignore')
        return ret

    def is_changed(self, local_catalog, new_catalog):
        return not (local_catalog == new_catalog)
