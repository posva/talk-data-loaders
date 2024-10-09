#!/usr/bin/env bash

pnpm exec slidev build slides-en.md
mv dist .output

pnpm exec slidev build slides-zh.md
mv dist .output/zh

# pnpm exec slidev build slides-jp.md
# mv dist .output/jp

mv .output dist
