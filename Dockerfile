FROM ubuntu:16.04
MAINTAINER Ahmed Osman <ahmedosmanazrk@gmail.com>

# install system-wide deps for python and node
RUN apt-get -yqq update
RUN apt-get -yqq install nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node

# copy our application code
ADD . /opt/moonshot
WORKDIR /opt/moonshot

# fetch app specific deps
RUN npm install

EXPOSE 3000

CMD ["/bin/sh","-c"]

