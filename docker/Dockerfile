 #Utilisation de l'image de base MySQL officielle depuis Docker Hub
FROM mysql:latest

# Variables d'environnement pour définir le mot de passe root MySQL
ENV MYSQL_ROOT_PASSWORD=password

# Copier le fichier SQL local dans le conteneur pour l'initialisation de la base de données
# Assurez-vous que le fichier data.sql se trouve dans le même répertoire que ce Dockerfile
# Le fichier sera automatiquement exécuté lors du premier démarrage du conteneur
COPY ./data.sql /docker-entrypoint-initdb.d/

# Exposer le port MySQL pour se connecter à la base de données
EXPOSE 3306

# Commande par défaut pour démarrer le serveur MySQL
CMD ["mysqld"]
