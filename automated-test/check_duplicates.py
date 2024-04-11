# Apre il file in modalità lettura
with open('commits.txt', 'r') as file:
    # Crea un set vuoto per memorizzare le stringhe viste finora
    seen = set()
    
    # Legge il file riga per riga
    for line in file:
        # Estrae i primi 7 caratteri dalla prima colonna
        key = line.split()[0][:7]
        
        # Controlla se la stringa è già stata vista
        if key in seen:
            print("Ripetizione trovata:", key)
        else:
            seen.add(key)
