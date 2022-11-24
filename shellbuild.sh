#!/usr/bin/env bash
echo "Adding the here maps npm repository .."
npm config set @here:registry https://repo.platform.here.com/artifactory/api/npm/maps-api-for-javascript/

echo "Building 'shell' with dapps .."
cd shell || exit
npm run build
cd .. || exit
