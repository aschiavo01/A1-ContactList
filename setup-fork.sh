#!/bin/bash

# To retrieve latest version of locators-automated-tests
git submodule update --init --recursive

# To obtain the tags to be used
git remote add unina-upstream https://github.com/reverse-unina/A1-ContactList.git
git fetch unina-upstream --tags
git push origin --tags 