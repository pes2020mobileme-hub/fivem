fx_version 'cerulean'
game 'gta5'

name 'fbu-esx-bridge'
description 'FiveM Bot Ultimate V3 - ESX Bridge Resource'
author 'FiveM Bot Ultimate'
version '3.0.0'

shared_scripts {
    '@es_extended/imports.lua',
    'config.lua',
}

client_scripts {
    'client/main.lua',
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua',
}

lua54 'yes'
