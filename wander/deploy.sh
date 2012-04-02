#!/bin/sh
[[ -z $1 ]] && echo "usage:\n  deploy.sh [directory]" || {
  echo cp lib/jquery-1.7.1.min.js index.html wander.js $1
  cp lib/jquery-1.7.1.min.js index.html wander.js $1
}