import os
import subprocess
import re
from configparser import ConfigParser

config = ConfigParser()
config.read('config.ini')

# Funzione per eseguire uno script bash
def run_script(script):
    subprocess.run(script, shell=True, check=True)

def get_tags():
    try:
        current_dir = os.getcwd()
        git_repo_path = config.get('variabili', 'percorso_A1_forked')
        os.chdir(git_repo_path)

        tags = subprocess.check_output(["git", "tag"], text=True).splitlines()
        tag_pattern = r'v_\d+[a-z]_\d+[a-z](_m\d+)?'
        filtered_tags = [tag for tag in tags if re.match(tag_pattern, tag)]

        print(f"Ricavati {len(filtered_tags)} tags, esclusi {len(set(tags) - set(filtered_tags))}")

        os.chdir(current_dir)
        return filtered_tags

    except subprocess.CalledProcessError:
        print("Errore: Non è una cartella di un repository Git.")
    except Exception as e:
        print(f"Errore: {e}")

def find_commits_with_tag(tag_list):
    try:
        commits_with_tag = set()
        tags_without_commit = []
        tags_with_commit = []

        for tag in tag_list:
            # Rimuovi il prefisso "v_" dal tag
            tag_no_prefix = tag.replace("v_", "")
            commit_list = subprocess.check_output(["git", "log", "--grep", tag_no_prefix, "--format=%H"], text=True).splitlines()
            commits_with_tag.update(commit_list)

            if(len(commit_list) == 0):
                tags_without_commit.append(tag)
            else:
                tags_with_commit.append(tag)

        return list(commits_with_tag), tags_without_commit, tags_with_commit

    except subprocess.CalledProcessError:
        print("Errore: Impossibile trovare le commit.")
        return None
    except Exception as e:
        print(f"Errore: {e}")
        return None    


tags = get_tags()
commits_with_tag, tags_without_commit, tags_with_commit = find_commits_with_tag(tags)
print(f"Numero totale commit distinte: {len(commits_with_tag)}")
print(f"tags con commit: {len(tags_with_commit)}")
print(f"tags senza commit: {len(tags_without_commit)}")
print(commits_with_tag[0])

run_script(f"git cherry-pick {commits_with_tag[0]}")
run_script(f"git push origin HEAD")
run_script(f"git tag {commits_with_tag[0]}")
run_script(f"git push origin {commits_with_tag[0]}")

"""
def check_duplicates(array):
    descriptions = []
    for commit in commits_with_tag:
        descriptions.append(subprocess.check_output(["git", "show", "-s", "--format=%s", commit], text=True).strip())

    # Inizializza un dizionario per tenere traccia del numero di occorrenze di ciascun elemento
    occurrences = {}
    duplicates = []

    # Conta il numero di occorrenze di ciascun elemento
    for element in descriptions:
        occurrences[element] = occurrences.get(element, 0) + 1

    # Trova gli elementi che sono presenti più di una volta
    for element, count in occurrences.items():
        if count > 1:
            duplicates.append((element, count))

    return duplicates

duplicates = check_duplicates(commits_with_tag)

for duplicate in duplicates:
    print(duplicate[0], duplicate[1])
"""

