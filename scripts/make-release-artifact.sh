#!/bin/sh
# usage: ./scripts/make-release-artifact.sh win-x64 windows-x64 .exe
# for making a win-x64 artifact named boofstream.exe in zip boofstream-v1.0.0-windows-x64.zip

NODE_TARGET=node20
VERSION=$(git describe --tags)

cd boofstream
pkg -t "$NODE_TARGET"-"$1" dist/index.js -o dist/boofstream"$3"
cd ../release
cp ../boofstream/dist/boofstream"$3" boofstream"$3"
zip -r ../boofstream-"$VERSION"-"$2".zip *
rm boofstream"$3"
cd ..
