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
# chrome ist optimal kompatibel zum selbstentwickelten Frontend
sudo dnf install -y google-chrome-stable
 
# Start und "enabling" von Docker, damit Docker bei jedem Boot mitstartet
sudo systemctl enable --now docker
 
# Docker compose erlaubt uns komplexere Dockersetups
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -Po '"tag_name": "\K.*?(?=")')
sudo curl -L "https://github.com/docker/compose/releases/download/$DOCKER_COMPOSE_VERSION/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
 
# Verifizieren der Docker Compose Installation
docker-compose --version

# Vorbereitung der working directories für die Services
mkdir /home/nervenkekse/docker-backend
mkdir /home/nervenkekse/docker-frontend
 
# Das service file für nervenkekse-frontend wird erstellt
sudo bash -c 'cat <<EOF > /etc/systemd/system/nervenkekse-frontend.service

[Unit]
Description=nervenkekse frontend
# bevor der nervenkekse service startet, der docker nutzt, muss natürlich docker in Betrieb sein
Requires=docker.service
After=docker.service
 
[Service]
# mit welchem command wird der Service gestartet
ExecStart=/usr/bin/docker start -a frontend

# mit welchem command wird der Service gestoppt
ExecStop=/usr/bin/docker stop frontend

WorkingDirectory=/home/nervenkekse/docker-frontend

# bei Abstürzen soll nervenkekse frontend wieder gestartet werden, nur bei aktivem stoppen, soll es auch nicht wieder starten
Restart=unless-stopped
 
[Install]
# diese Zeile führt dazu, dass boot und reboot den Servicestart triggern
WantedBy=multi-user.target

EOF'


# Das service file für nervenkekse-backend wird erstellt
sudo bash -c 'cat <<EOF > /etc/systemd/system/nervenkekse-backend.service

[Unit]
Description=nervenkekse backend
# bevor der nervenkekse service startet, der docker nutzt, muss natürlich docker in Betrieb sein
Requires=docker.service
After=docker.service
 
[Service]
# mit welchem command wird der Service gestartet
ExecStart=/usr/bin/docker start -a backend

# mit welchem command wird der Service gestoppt
ExecStop=/usr/bin/docker stop backend

WorkingDirectory=/home/nervenkekse/docker-backend

# bei Abstürzen soll nervenkekse backend wieder gestartet werden, nur bei aktivem stoppen, soll es auch nicht wieder starten
Restart=unless-stopped
 
[Install]
# diese Zeile führt dazu, dass boot und reboot den Servicestart triggern
WantedBy=multi-user.target

EOF'

# Das service file für nervenkekse-chrome wird erstellt
sudo bash -c 'cat <<EOF > /etc/systemd/system/nervenkekse-chrome.service

[Unit]
Description=nervenkekse chrome
# bevor der Browser sich öffnet, müssen natürlich frontend und backend in Betrieb sein
Requires=graphical.target nervenkekse-frontend.service nervenkekse-backend.service
After=nervenkekse-frontend.service nervenkekse-backend.service
 
[Service]
# mit welchem command wird der Service gestartet
ExecStart=/usr/bin/google-chrome-stable http://localhost:4200
User=nervenkekse
Environment="DISPLAY=:0"
Environment="XAUTHORITY=$(xauth info | grep 'Authority file' | awk '{print $3}')"

[Install]
# diese Zeile führt dazu, dass boot und reboot den Servicestart triggern
WantedBy=multi-user.target

EOF'

 
# stellt sicher, dass alle drei nervenkekse services bei erstmaliger Skriptausführung geladen werden
sudo systemctl daemon-reload
 
# hier werden die services dauerhaft aktiviert, ohne diese Zeile wäre die Zeile 46, beginnend mit "WantedBy=..." nicht wirksam
sudo systemctl enable --now nervenkekse-frontend.service
sudo systemctl enable --now nervenkekse-backend.service
sudo systemctl enable --now nervenkekse-chrome.service
 
# Ausgabe für die scriptausführende Person zur Bestätigung
echo "Docker, Docker Compose, und nervenkekse services setup wurde erfolgreich durchgeführt."
