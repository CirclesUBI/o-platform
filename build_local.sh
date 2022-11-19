#!/usr/bin/env bash

export API_ENDPOINT="http://localhost:8989/"
export CIRCLES_SUBGRAPH_ENDPOINT="https://api.thegraph.com/subgraphs/name/circlesubi/circles"
export PATHFINDER_ENDPOINT="https://rpc.circles.land/pathfinder"
export CIRCLES_HUB_ADDRESS="0x29b9a7fBb8995b2423a71cC17cf9810798F6C543"
export SAFE_PROXY_FACTORY_ADDRESS="0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"
export SAFE_ADDRESS="0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
export RPC_ENDPOINT="https://rpc.circles.land"
export OPENLOGIN_CLIENT_ID="BHqazms23gbTZQ2fYvvUaFzv718Ft8Ox1XwSEqVt81jtZJRQRb-N5cnThtZGSjZF9Dtj9MQxkEQTUo47I_wiihE"
export HERE_API_KEY="fhiIkoASi1B-z8R7ytKBnfJltOpaUlYBV1kydXyK1sE"

search='__TIMESTAMP__'
replace=`date +"%s"`
search_replace="s/$search/$replace/g"
cp -f ./shell/public/index.template.html ./shell/public/index.html
sed -i.bak "$search_replace" ./shell/public/index.html
rm -f ./shell/public/index.html.bak

echo "Installing build dependencies .."
# npm i WE HAVE TO INSTALL YARN ON THE SERVER THE RIGHT WAY - otherwise it screws everything up ;)
# use sudo npm install -g yarn instead.
# then yarn set version latest
npx --no-install yarn || exit

echo "Building 'o-utils' .."
cd packages/o-utils || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'o-events' .."
rm -r -f o-events/dist
cd o-events || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'o-interfaces' .."
cd o-interfaces || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'o-process' .."
cd o-process || exit
npx --no-install tsc || exit
cd ../.. || exit

echo "Generating graphql types for shared/api/data"
echo "* api"
cd shell/src/shared/api/data
npx --no-install  graphql-codegen --config ./src/shared/api/data/codegen.yml

cd ../../../../..

# npx svelte-check || exit 99

echo "Building 'shell' with dapps .."

cd shell || exit
npm run build
cd .. || exit

