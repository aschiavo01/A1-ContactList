echo "Inizio comandi installazione precondizioni"
#sudo apt update
#sudo apt install openjdk-11-jdk openjdk-11-jre
#echo "Installata versione di java numero"
java -version 

echo "Inizio comandi esecuzione Backend"
#pwd
#ls -a
#cd /home/runner/work/A1-ContactList/A1-ContactList/insert-here-your-web-app/angular-java-example-master
#ls -a
#mvn clean install
cd /home/runner/work/A1-ContactList/A1-ContactList/insert-here-your-web-app/angular-java-example-master/target
echo "Vediamo quali file jar si trovano in cartella target"
ls -a
java -jar users-0.0.1-SNAPSHOT.jar &
