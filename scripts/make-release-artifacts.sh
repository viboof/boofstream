#!/bin/sh
# usage: ./scripts/make-release-artifact.sh win-x64 windows-x64 .exe
# for making a win-x64 artifact named boofstream.exe in zip boofstream-v1.0.0-windows-x64.zip

NODE_TARGET=node20
VERSION=$(git describe --tags)

echo Packaging boofstream
cd boofstream
pkg -t "$NODE_TARGET"-"$1" dist/index.js -o dist/boofstream"$3"

echo Packaging boofstream-updater
cd ../boofstream-updater
pkg -t "$NODE_TARGET"-"$1" dist/index.js -o dist/boofstream"$3"

cd ../release
cp ../boofstream/dist/boofstream"$3" dist/boofstream"$3"
cp ../boofstream-updater/dist/boofstream"$3" boofstream"$3"
echo "$2" > dist/osarch.txt

zip -r ../boofstream-"$VERSION"-"$2".zip *

rm dist/boofstream"$3"
rm boofstream"$3"
rm dist/osarch.txt

cd ..
