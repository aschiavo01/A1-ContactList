#!/bin/bash

# Verifica che sia stato fornito un argomento
if [ $# -eq 0 ]; then
    echo "Usage: $0 <zip_file>"
    exit 1
fi

# Cartella che contiene il file zip originario
origin_folder_zip="/home/aress/Scaricati/"
# Definizione della cartella dove copiare il file zip e creare la relativa cartella
dest_folder_zip="/home/aress/Documenti/Software Testing/test"
# Definizione della cartella che conterra' i test case estratti
dest_folder_java="/home/aress/Documenti/Software Testing/progetto/A1-ContactList/project-test-headless/src/test/java/com/example/TesiIntegrazioneProgettoEsterno"

# Copia il file zip nella cartella di destinazione
cp "$origin_folder_zip/$(basename "$1")" "$dest_folder_zip"

# Ottieni il nome del file senza estensione
filename=$(basename "$1" .zip)

# Crea una cartella con il nome del file zip senza estensione
mkdir -p "$dest_folder_zip/$filename"

# Estrae il file zip nella cartella di destinazione
unzip -q "$dest_folder_zip/$(basename "$1")" -d "$dest_folder_zip/$filename"

# Copia i file con estensione .java nella cartella java
find "$dest_folder_zip/$filename" -name "*.java" -exec cp {} "$dest_folder_java" \;

echo "Operazioni completate."
