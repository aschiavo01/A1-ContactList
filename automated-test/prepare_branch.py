import os
import glob
import shutil
import subprocess
from datetime import datetime
import requests
import json
from configparser import ConfigParser

config = ConfigParser()
config.read('.secrets.ini')

current_date = datetime.today().strftime('%d_%m_%Y')

cwd = os.getcwd()
project_path = "/home/aress/Documenti/Software Testing/progetto/A1-clone-automate"
token = config.get('variabili', 'token')
owner = "ares-17"
repo = "A1-ContactList"

pom_files = ["project-test-headless/pom.xml", "project-test-local/pom.xml"]
actions_files = [
    ".github/workflows/main.yml",
    ".github/workflows/mainOnPush.yml",
    ".github/workflows/generaReportFinale.yml",
    "startFrontEnd.sh",
    "startBackEnd.sh",
    "project-test-headless/eseguiTest.sh",
    "Tesi-injector-plugin/src/main/java/com/mypackage/Application.java"
]
"""
tags = [
    "v_1a_2a_t2",
    "v_1a_2b_t2",
    "v_1a_2c_t2",
    "v_1a_2d_t2",
    "v_1a_2e_t2",
    "v_1b_2a_t2",
    "v_1b_2b_t2",
    "v_1b_2c_t2",
    "v_1b_2d_t2",
    "v_1b_2e_t2",
    "v_1c_2a_t2",
    "v_1c_2b_t2",
    "v_1c_2c_t2",
    "v_1c_2d_t2",
    "v_1c_2e_t2",
    "v_1d_2a_t2",
    "v_1d_2c_t2",
    "v_1d_2d_t2",
    "v_1d_2e_t2",
    "v_1e_2a_t2",
    "v_1e_2c_t2",
    "v_1e_2d",
    "v_1e_2e_t2",
    "v_1f_2a_t2",
    "v_1f_2b_t2",
    "v_1f_2c_t2",
    "v_1f_2d_t2",
    "v_1f_2e_t2",
    "v_1g_2a_t2",
    "v_1g_2b_t2",
    "v_1g_2c_t2",
    "v_1g_2d_t2",
    "v_1h_2a_t2",
    "v_1h_2b_t2",
    "v_1h_2c_t2",
    "v_1h_2d_t2",
    "v_1h_2e_t2",
    "v_1i_2a",
    "v_1i_2b_t2",
    "v_1i_2c_t2",
    "v_1i_2d_t2",
    "v_1i_2e_t2",
    "v_1j_2a_t2",
    "v_1j_2b_t2",
    "v_1j_2c_t2",
    "v_1j_2d_t2",
    "v_1j_2e_t2",
    "v_1k_2b_t2",
    "v_1k_2c_t2",
    "v_1k_2d_t2",
    "v_1k_2e_t2",
]
"""

tags = [
    "v_1a_2c_t2",
]

def run_script(script):
    subprocess.run(script, shell=True, check=True)

def clean_workspace():
    run_script(f"git reset --hard origin/master")
    run_script(f"git checkout master")

def update_pom():
    for file in pom_files:
        fin = open(f"{file}", "rt")
        data = fin.read()
        # update chrome driver to 5.7.0
        data = data.replace('<version>4.0.0</version>', '<version>5.7.0</version>')
        fin.close()

        fin = open(f"{file}", "wt")
        fin.write(data)
        fin.close()

def update_action_files():
    for file in actions_files:
        fin = open(f"{file}", "rt")
        data = fin.read()
        # update chrome driver to 5.7.0
        data = data.replace('HookTestRepo', 'A1-ContactList')
        data = data.replace('Tesi-StrumentoGenerale', 'A1-ContactList')
        fin.close()

        fin = open(f"{file}", "wt")
        fin.write(data)
        fin.close()

def remove_old_locators():
    fileList = glob.glob('project-test-headless/src/test/java/com/example/TesiIntegrazioneProgettoEsterno/*.java')
    for filePath in fileList:
        try:
            os.remove(filePath)
        except:
            print("Error while deleting file : ", filePath)

def add_new_locators():
    fileList = glob.glob(f'{cwd}/test_cases/*.java')
    for filePath in fileList:
        shutil.copy(filePath, 'project-test-headless/src/test/java/com/example/TesiIntegrazioneProgettoEsterno/')

def create_branch(tag_name):
    branch = f"{tag_name}_branch_{current_date}"
    run_script(f"git checkout -b {branch} tags/{tag_name}")
    return branch

def create_release(tag_name, branch):
    run_script(f"gh release create {tag_name}_date_{current_date} --target {branch} -t 'auto release creation of {branch}'")

def commmit_push_branch(branch):
    run_script("git add .")
    run_script(f"git commit -m 'Auto created commit at {current_date}'")
    run_script(f"git push -u origin {branch}")

def create_github_release(tag_name, branch):
    owner = "ares-17"
    repo = "A1-ContactList"
    name = f"{tag_name}_test_release"
    body = f"Automatic release creation on {current_date}"

    command = [
        "gh", "api",
        "--method", "POST",
        "-H", "Accept: application/vnd.github+json",
        "-H", "X-GitHub-Api-Version: 2022-11-28",
        "/repos/{}/{}/releases".format(owner, repo),
        "-f", "tag_name={}".format(tag_name),
        "-f", "target_commitish={}".format(branch),
        "-f", "name={}".format(name),
        "-f", "body={}".format(body),
    ]

    try:
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        response = json.loads(result.stdout)
        if response:
            print("Release creata con successo!")
            print("ID della release:", response["id"])
        else:
            print("Creazione della release fallita")
    except subprocess.CalledProcessError as e:
        print("Errore durante la creazione della release su GitHub:")
        print(e)


os.chdir(project_path)
clean_workspace()

for tag in tags:
    print(f"INIT [{tag}] ----------------")
    print(f"[{tag}]: init branch")
    branch_name = create_branch(tag)
    print(f"[{tag}]: update pom")
    update_pom()
    print(f"[{tag}]: update action files")
    update_action_files()
    print(f"[{tag}]: removing old locators")
    remove_old_locators()
    print(f"[{tag}]: adding new locators")
    add_new_locators()
    print(f"[{tag}]: commit and push")
    commmit_push_branch(branch_name)
    print(f"[{tag}]: creating release")
    create_github_release(tag, branch_name)
    print(f"[{tag}]: end tag\n\n")


