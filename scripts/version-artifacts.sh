#!/usr/bin/env bash

search=$(cat package.json | jq -r '.version')
replace="$npm_package_version"

sed -i '' "s/${search}/${replace}/g" .github/workflows/draft-artifacts.yml
sed -i '' "s/${search}/${replace}/g" .github/workflows/publish-release.yml
sed -i '' "s/${search}/${replace}/g" .github/workflows/test.yml
