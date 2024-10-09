#!/usr/bin/env bash

rm -rf dist

pnpm exec slidev build slides-en.md --base / --out dist

pnpm exec slidev build slides-zh.md --base /zh/ --out dist/zh

rm dist/_redirects
rm dist/zh/_redirects
