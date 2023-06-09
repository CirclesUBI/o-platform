#!/bin/bash

export DEPLOY_ENVIRONMENT=$1

search='__TIMESTAMP__'
replace=`date +"%s"`
search_replace="s/$search/$replace/g"
cp -f ./shell/public/index.template.html ./shell/public/index.html
sed -i.bak "$search_replace" ./shell/public/index.html
rm -f ./shell/public/index.html.bak

echo "making sure we are using the correct version of yarn.."
npx --no-install yarn set version 3.x || exit

echo "Installing build dependencies .."
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
cd .. || exit

echo "Building 'o-circles' .."
cd o-circles || exit
npx --no-install tsc || exit
cd ../.. || exit

echo "Generating graphql types for shared/api/data"
echo "* api"
cd shell/src/shared/api/data
npx --no-install  graphql-codegen --config ./src/shared/api/data/codegen.yml

cd ../../../../../..