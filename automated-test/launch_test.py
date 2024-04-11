import os
import time
from datetime import datetime

# Funzione per ottenere la data corrente formattata
def get_current_date():
    return datetime.now().strftime("%d_%m_%Y")

# Funzione per eseguire il cherry-pick
def cherry_pick_and_push(branch_name, commit_hash):
    # Crea il nuovo branch dal branch master
    os.system(f"git checkout master && git checkout -b {branch_name}_{get_current_date()}")
    
    # Esegue il cherry-pick della commit
    os.system(f"git cherry-pick -Xtheirs {commit_hash}")
    
    # Effettua la push del branch
    os.system(f"git push -u origin {branch_name}_{get_current_date()}")

# Funzione per creare un tag (release)
def create_tag(branch_name):
    os.system(f"git tag {branch_name}_{get_current_date()}_tag")
    os.system(f"git push origin {branch_name}_{get_current_date()}_tag")

start_time = time.time()

# Apre il file in modalità lettura
with open('commits_copy.txt', 'r') as file:
    for line in file:
        branch_name, commit_hash = line.strip().split()
        
        cherry_pick_and_push(branch_name, commit_hash)
        time.sleep(240)
        
        create_tag(branch_name)
        #time.sleep(480)
