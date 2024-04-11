import os
import time

# Funzione per eseguire il cherry-pick
def cherry_pick_and_push(branch_name, commit_hash):
    # Crea il nuovo branch dal branch master
    os.system(f"git checkout master && git checkout -b {branch_name}")
    
    # Esegue il cherry-pick della commit
    os.system(f"git cherry-pick -Xtheirs {commit_hash}")
    
    # Effettua la push del branch
    os.system(f"git push -u origin {branch_name}")

# Funzione per creare un tag (release)
def create_tag(branch_name):
    os.system(f"git tag {branch_name}")
    os.system(f"git push origin {branch_name}")

start_time = time.time()

# Apre il file in modalità lettura
with open('commits_copy.txt', 'r') as file:
    for line in file:
        branch_name, commit_hash = line.strip().split()
        
        cherry_pick_and_push(branch_name, commit_hash)
        time.sleep(240)
        
        create_tag(branch_name)
        #time.sleep(480)
