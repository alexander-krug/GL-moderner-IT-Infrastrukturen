#!/bin/bash

# Die frische Installation wird zuerst geupdated
sudo dnf update -y

# Die Docker Installation wird vorbereitet durch ein relevantes Repository
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
# docker-ce ist die community edition, die den Docker daemon bereitstellt
sudo dnf install -y docker-ce 
# docker-ce-cli erlaubt eine Interaktion via command line mit dem docker daemon
sudo dnf install -y docker-ce-cli
# containerd.io ergänzt docker um bessere low level container operationen d.h. alles rund um den container lifecycle
sudo dnf install -y containerd.io

# Start und "enabling" von Docker, damit Docker bei jedem Boot mitstartet
sudo systemctl enable --now docker

# Docker compose erlaubt uns komplexere Dockersetups
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -Po '"tag_name": "\K.*?(?=")')
sudo curl -L "https://github.com/docker/compose/releases/download/$DOCKER_COMPOSE_VERSION/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verifizieren der Docker Compose Installation
docker-compose --version

# Das service file für nervenkekse wird erstellt
sudo bash -c 'cat <<EOF > /etc/systemd/system/nervenkekse.service
[Unit]
Description=nervenkekse
# bevor der nervenkekse service startet, der docker-compose nutzt, muss natürlich docker in Betrieb sein
Requires=docker.service
After=docker.service

[Service]
# mit welchem command wird der Service gestartet
ExecStart=/usr/local/bin/docker-compose -f /home/nervenkekse/docker-compose/docker-compose.yml up
# mit welchem command wird der Service gestoppt
ExecStop=/usr/local/bin/docker-compose -f /home/nervenkekse/docker-compose/docker-compose.yml down
WorkingDirectory=/home/nervenkekse/docker-compose
# bei Abstürzen soll nervenkekse wieder gestartet werden, nur bei aktivem stoppen, soll es auch nicht wieder starten
Restart=unless-stopped

[Install]
# diese Zeile führt dazu, dass boot und reboot den Servicestart triggern
WantedBy=multi-user.target
EOF'

# stellt sicher, dass der nervenkekse service bei erstmaliger Skriptausführung geladen wird
sudo systemctl daemon-reload

# hier wird der service dauerhaft aktiviert, ohne diese Zeile wäre die Zeile 46, beginnend mit "WantedBy=..." nicht wirksam
sudo systemctl enable nervenkekse.service

# Ausgabe für die scriptausführende Person zur Bestätigung
echo "Docker, Docker Compose, and nervenkekse service setup wurde erfolgreich durchgeführt."
