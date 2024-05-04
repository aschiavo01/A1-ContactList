# Fork A1-ContactList

[Original README](https://github.com/reverse-unina/A1-ContactList)

## Configurazione fork
La creazione di un fork del repository di origine risulta un'operazione lunga e complessa se non si è a conoscenza a priori delle modifiche da apportare.

Per staccare un fork _pronto all'uso_ da [qui](https://github.com/reverse-unina/A1-ContactList) seguire i passaggi che compongono una singola iterazione dello script _execute_all_tests.py_ in [Locators-automated-tests](https://github.com/ares-17/locators-automated-tests).

## Locators-automated-tests
L'ambiente predisposto dal repository primario prevede l'utilizzo di 3 file .yml come azioni Github per semplificare il processo di valutazione di un locatore.

Per valutare le performance di un test Katalon in junit occorre:
- creare il test con Katalon Recorder ed esportarlo in _project-test-headless/src/test/java/com/example/TesiIntegrazioneProgettoEsterno_ come junit
- aggiungere eventuali modifiche al frontend Angular per testare le proprietà del test
- eseguire una commit e push per eseguire _mainOnPush.yml_ che inserisce gli hooks nelle pagine HTML e corregge gli import dei file di test
- creare una release a seguito dell'esecuzione delle azioni prima menzionate
- scaricare il file zip della release ed ispezionare manualmente la cartella _TestSuite_
- spostare il report _.xls_ in _Report-Separati/_ dove l'azione _generaReportFinale.yml_ a seguito di una push su _master_ unisce i report in un unico file

Il repository **Locators-automated-tests** automatizza il processo considerando dei tag di riferimento già presenti nel repository primario e che identificano dei test HTML con i quali confrontare le performance dei locatori.

### Integrazione repository
Il presente repository costituisce una testimonianza su come integrare il repository dei test automatici in un qualsiasi fork.

Nei seguenti passaggi alcuni nomenclature possono esssere modificate a piacere ma per una integrazione semplificata si consiglia di rispecchiare l'esempio.

Passaggi:
1. creare la cartella _automated\_test_ nel fork
2. clonare il repository degli script come quando esemplificato nel [README](https://github.com/ares-17/locators-automated-tests)
3. creare la cartella _automated\_test/test\_cases_ nella quale inserire i file junit da valutare
4. creare il file _automated\_test/config.ini_ come descritto nel README

## Esecuzione test in locale
Per eseguire in locale i test junit occorre eseguire **npm run start** in _insert-here-your-web-app/angular-spotify-main/angular-spotify-main_ ed eseguire la funzionalità di debug integrata nell'IDE.

### Cattura screenshot in caso di errore
Con la funzione di cattura screenshot di semplifica il processo di debugging dei test ispezionando visivamente la pagina sulla quale di ottiene la prima eccezione.

```java
@Test
  public void my_test() throws Exception{
    try{
        // test body
    } catch(Exception e){
        takeScreenshot(driver, "error_screenshot.png");
    }
  }

  public void takeScreenshot(WebDriver driver, String filePath) {
    File screenshotFile = ((TakesScreenshot) driver)
        .getScreenshotAs(OutputType.FILE);
    try {
        FileUtils.copyFile(screenshotFile, new File(filePath));
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```
### Generazione report finale in locale
Per generare un unico report (in locale non utilizzando l'action su Github) a partire dai numeri file .xls generati è necessario:
- Aver installato una versione minima di Java 8 col _JAVA_HOME_ configurato
- Estrarre il contenuto di _unisciReportExcel_
- Posizionare i file .xls in _unisciReportExcel/surefire_reports_ eliminando altri eventuali file presenti
- posizionarsi con il terminale nella cartella _target_ ed eseguire `java -jar unisciReportExcel-0.0.1-jarReportTest.jar ./surefire-reports reportComplessivo`

Anche questo passaggio è semplificato da **Locators-automated-tests**.