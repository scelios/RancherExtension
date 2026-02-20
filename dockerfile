FROM ubuntu:22.04

RUN apt-get update -y && apt-get install -y \
    curl \
    ca-certificates \
    bash \
    iputils-ping \
    && rm -rf /var/lib/apt/lists/*

ENV NVM_DIR=/root/.nvm

RUN curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash \
    && . "$NVM_DIR/nvm.sh" \
    && nvm install 20.17.0 \
    && nvm alias default 20.17.0 \
    && npm install -g yarn

ENV PATH="${NVM_DIR}/versions/node/v20.17.0/bin:${PATH}"

# WORKDIR /usr/app
# RUN npm init @rancher/extension@latest hello-world

WORKDIR /usr/app/hello-world
# RUN yarn install -y

EXPOSE 8005
EXPOSE 8080

