echo "Inizio ad eseguire i test"

for f in ./src/test/java/com/example/TesiIntegrazioneProgettoEsterno/*.java; 
do 
	pwd
	echo "Processing $f file..."; 
	sleep 10
	echo "Processing ${f##*/} file...";
	mvn test -Dtest=${f##*/}
	
	echo "*****Ho eseguito il test $f, ora spengo il BackEnd*****";
	sleep 10
	echo "curl -X POST http://localhost:8080/actuator/shutdown/";
	
	curl -X POST http://localhost:8080/actuator/shutdown/
	
	echo "BackEnd spento";
	sleep 10
	echo "Riavvio il BackEnd";
	cd /home/runner/work/A1-ContactList/A1-ContactList
	pwd
	bash startBackEnd.sh 
	cd /home/runner/work/A1-ContactList/A1-ContactList/project-test-headless
	echo "ora dovrei aver cambiato di nuovo cartella..";
	pwd
done;
