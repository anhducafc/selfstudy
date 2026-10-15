#!/usr/bin/env sh
# Build cho Cloudflare Pages: chỉ copy file web vào dist/ (không public scripts/, functions/, migrations/…)
set -e
rm -rf dist && mkdir -p dist
cp -r index.html privacy.html terms.html css js data zh dist/
[ -f _headers ] && cp _headers dist/
echo "Đã build vào dist/"
