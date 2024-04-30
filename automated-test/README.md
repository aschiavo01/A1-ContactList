# Test automatici
Nella presente cartella sono definiti una serie di script Python per la gestione automatizzata dei test.

In particolare:
- **.secrets.ini** contiene informazioni riservate per accedere al repository (es. token)
- **commits.txt** file con coppie tag-hash commit, attualmente non usato
- **config.ini** proprietà relative ai path e al repository
- **execute_all_tests.py** file che esegue i test
- **get_all_results.py** file che copia i risultati prodotti in _release\_download_ in _Report-Seprati_ cosicché l'esecuzione dell'azione _generaReportFinale.yml_ crei un report complessivo
- **get_all_tags.py** semplice script che crea un file contenente i tag presenti nel repository e dai quali sono creati i nuovi branch di test. Non considera altri tag
- **tags.txt** file contenente una lista di riferimento dei tag di test

Per eseguire i test sfruttando le aziondi di Github è necessario che sia clonato il fork attuale in un'altra cartella; su questo sono eseguite le operazioni di **execute_all_tests.py** dal quale:
- crea un branch per ogni tag
- ne aggiorna i file pom (per non generare eccezioni di incompatibilità dei test)
- aggiorna i file contenenti le azioni compiute dai test rimuovendo i path assoluti del vecchio repository 
- rimuove i vecchi casi di test
- aggiunge i casi di test presenti in _automated-test/test\_cases_
- copia l'ultima versione delle azioni di Github
- rimuove la cartella "TestSuite" contenente i vecchi casi di test
- esegue una commit e push con le modifiche
- crea una release del branch

Infine, dopo aver atteso un tempo prestabilito (impostato inizialmente a 1 minuto):
- attende che tutte le azioni su Github siano terminate
- scarica nella cartella _release\_download_ i file delle release

L'esecuzione del file **get_all_results.py** deve seguire quella del file **execute_all_tests.py**.