#!/bin/bash

set -e

REGISTRY=shawnroshan/apricot.and.nut
SPRING_PATH=backend/Dockerfile
NODE_PATH=node-backend/Dockerfile.production
SPRING_TAG=spring-backend
NODE_TAG=node-backend

docker build -f ${SPRING_PATH} -t ${REGISTRY}:${SPRING_TAG} ./backend
docker build -f ${NODE_PATH} -t ${REGISTRY}:${NODE_TAG} ./node-backend

docker login

docker push ${REGISTRY}:${SPRING_TAG}
docker push ${REGISTRY}:${NODE_TAG}

echo ""
echo ====================================
echo Pushed to docker hub! Waiting to deploy to Google Compute Engine...
echo ====================================
echo ""

sleep 5s

scp -i ~/.ssh/apricot-ssh-key ./docker-compose.yml apricot@34.87.36.207:~

ssh -i ~/.ssh/apricot-ssh-key apricot@34.87.36.207 << EOF
    sudo docker login
    sudo docker-compose pull
    sudo docker-compose up --build --force-recreate -d
EOF

echo ""
echo ====================================
echo Deployed at http://34.87.36.207:8080
echo ====================================
echo ""

# scp -i ~/.ssh/apricot-ssh-key ./backend/src/main/resources/scripts/update.sql apricot@34.87.36.207:~
# sudo docker exec -i db mysql --user=root --password=password --database=retaildb <./update.sql