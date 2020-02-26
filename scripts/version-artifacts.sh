#!/usr/bin/env bash

search=$(cat package.json | jq -r '.version')
replace="$npm_package_version"

sed -i '' "s/${search}/${replace}/g" .github/workflows/test.yml
sed -i '' "s/${search}/${replace}/g" .github/workflows/release.yml
