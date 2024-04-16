import shutil
import os

def clean_and_copy(source_path, destination_path):
    try:
        if os.path.exists(destination_path):
            shutil.rmtree(destination_path)
            print(f"Cartella di destinazione '{destination_path}' eliminata.")
        else:
            print("La cartella destinazione non esiste")

        shutil.copytree(source_path, destination_path)
        print(f"Contenuto di '{source_path}' copiato con successo in '{destination_path}'.")
    except Exception as e:
        print(f"Errore durante l'operazione: {e}")


destination_path = "/home/aress/Documenti/Software Testing/progetto/A1-ContactList/insert-here-your-web-app/angular-java-example-master/src/main/ui/src/app"
source_path = "/home/aress/Documenti/Software Testing/progetto/A1-ContactList-master-copy/insert-here-your-web-app/angular-java-example-master/src/main/ui/src/app"

clean_and_copy(source_path, destination_path)
