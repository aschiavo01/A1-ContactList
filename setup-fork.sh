#!/bin/bash

# To retrieve latest version of locators-automated-tests
git submodule update --init --recursive

# To obtain the tags to be used
git remote add upstream https://github.com/ares-17/A1-ContactList.git
git fetch upstream --tags
git push origin --tags 