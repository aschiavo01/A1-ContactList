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
total_elements = sum(1 for line in open('commits.txt'))
batch = []

#wait_for_main_on_push = 240
#wait_for_release = 480

wait_for_main_on_push = 1
wait_for_release = 2

def create_in_batch(batch):
    for couple in batch:
        #cherry_pick_and_push(couple[0], couple[1])
        print(f"cherry_pick_and_push {couple[0]} {couple[1]}")
    time.sleep(wait_for_main_on_push)
    for couple in batch:
        #create_tag(couple[0])
        print(f"create_tag {couple[0]} {couple[1]}")
    time.sleep(wait_for_release)

# Apre il file in modalità lettura
with open('commits.txt', 'r') as file:
    for idx, line in enumerate(file, start=1):
        branch_name, commit_hash = line.strip().split()

        batch.append((branch_name, commit_hash))

        if (len(batch) == 15):
            create_in_batch(batch)
            batch = []

print(f"Rimanenti {len(batch)}")
if(len(batch) > 0):
    create_in_batch(batch)
    batch = []
