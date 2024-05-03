# Test automatici
La presente cartella è utile per eseguire le azioni di Github su branch creati dai tag di test per testare nuovi locatori.



Per eseguire i test occorre:
- clonare il repository con gli script Python
- definire una cartella **test_cases** che contenga i casi di test esportati da katalon in formato junit
- **config.ini** contenente i percorsi necessari per accedere alle risorse utilizzate dagli script.

Per clonare il repository con i casi di test, eseguire all'interno di questa cartella:
```sh
git clone https://github.com/ares-17/locators-automated-tests.git repo
```
Per compilare il file **config.ini** seguire l'esempio fornito nel repository appena clonato.

Per ulteriori informazioni, visionare il [README](https://github.com/ares-17/locators-automated-tests)