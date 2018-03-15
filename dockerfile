FROM byuoitav/amd64-alpine
MAINTAINER Daniel Randall <danny_randall@byu.edu>

ARG NAME
ENV name=${NAME}

COPY ${name}-bin ${name}
COPY version.txt version.txt

ENTRYPOINT ./${name}

RUN apk update
RUN apk add ca-certificates
RUN apk add docker
RUN apk add git
RUN apk add make
