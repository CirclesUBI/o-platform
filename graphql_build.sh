
echo "Generating graphql types for shared/api/data"
echo "* api"
cd shell/src/shared/api/data
npx --no-install  graphql-codegen --config ./src/shared/api/data/codegen.yml
