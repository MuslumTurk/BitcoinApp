# Copyright (c) 2017 Wisdomera Inc. <info@wisdomera.io>
import oauth2
import oauth2.tokengenerator
import oauth2.grant
import oauth2.store.memcache
import oauth2.store.memory
from util.database import MemcachedProxy
from util.oauth import WisdomUserAdapter

API_VERSION = r'v1.0'

client_store = oauth2.store.memory.ClientStore()
client_store.add_client(client_id="xyz", client_secret="abc",
                        redirect_uris=[],
                        authorized_grants=[oauth2.grant.ResourceOwnerGrant.grant_type,
                                           oauth2.grant.RefreshToken.grant_type])

# Redis for tokens storage
mc = MemcachedProxy()
token_store = oauth2.store.memcache.TokenStore(mc=mc)

# Generator of tokens
token_generator = oauth2.tokengenerator.Uuid4()
token_generator.expires_in[oauth2.grant.ClientCredentialsGrant.grant_type] = 3600

# OAuth2 controller
provider = oauth2.Provider(
    access_token_store=token_store,
    auth_code_store=token_store,
    client_store=client_store,
    token_generator=token_generator
)
provider.token_path = '/oauth/token'


# Add Client Credentials to OAuth2 controller
provider.add_grant(oauth2.grant.ClientCredentialsGrant())
provider.enable_unique_tokens()
provider.add_grant(oauth2.grant.ResourceOwnerGrant(site_adapter=WisdomUserAdapter(), expires_in=2592000, scopes=['stream_data']))