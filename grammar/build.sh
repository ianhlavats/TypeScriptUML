#!/bin/bash

jison "$PWD/typescript.jison" "$PWD/typescript.jisonlex"  -t -p lalr > jisonOutput.txt
