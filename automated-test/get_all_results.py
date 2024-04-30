import os
import shutil
import glob
from configparser import ConfigParser

config = ConfigParser()

cwd = os.getcwd()
output_dir = f"{cwd}/reports"
base_folder = config.read("get_all_results", "base_folder")

def examine_folders_in_directory(directory):
    # Verifica se il percorso specificato è una directory
    if not os.path.isdir(directory):
        print(f"{directory} non è una directory valida.")
        return

    # Ottieni la lista dei percorsi completi delle cartelle contenute nella directory
    folders = [os.path.join(directory, f) for f in os.listdir(directory) if os.path.isdir(os.path.join(directory, f))]
    # Array che conterrà i percorsi alla prima cartella contenuta in ogni elemento di "folders"
    first_subfolder_paths = []

    if folders:
        for folder in folders:
            # Ottieni il percorso della prima sottocartella (se presente)
            subfolders = [os.path.join(folder, f) for f in os.listdir(folder) if os.path.isdir(os.path.join(folder, f))]
            if subfolders:
                first_subfolder_paths.append(subfolders[0])

    for subfolder in first_subfolder_paths:
        if subfolder:
            if "TestSuite" in os.listdir(subfolder):
                testsuite_path = os.path.join(subfolder, "TestSuite")
                fileList = glob.glob(f"{testsuite_path}/*.xls")
                for file in fileList:
                    move_report(testsuite_path, file)
            else:
                print(f"Cartella TestSuite non trovata in {subfolder}")
        else:
            print(f"subfolder vuoto")
    
def move_report(source_path, file):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        shutil.move(os.path.join(source_path, file), output_dir)
    except Exception as e:
        print(f"Errore durante lo spostamento del file: {e}")

examine_folders_in_directory(base_folder)