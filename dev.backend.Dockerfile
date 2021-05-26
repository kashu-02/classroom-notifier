FROM node:14

RUN apt-get update
RUN apt-get install -y locales vim tmux
RUN locale-gen ja_JP.UTF-8
RUN localedef -f UTF-8 -i ja_JP ja_JP
RUN yarn install
ENV LANG ja_JP.UTF-8
ENV TZ Asia/Tokyo
WORKDIR /app