# builder image
# FROM python:3.12-slim AS builder
FROM node:20-slim AS builder

ADD . /build/

# RUN ./install_node.sh

WORKDIR /build/bulletin/client
RUN npm ci
RUN npm run build

FROM python:3.12-slim

# create an unprivileged user to run as
RUN set -ex && \
	groupadd -r appuser && \
	useradd -r -g appuser -m -d /app appuser

WORKDIR /app
ADD . .

COPY --from=builder /build/bulletin/client/build ./build

RUN pip install build
RUN pip install .

USER appuser
CMD ["uwsgi", "--ini", "uwsgi.ini"]
EXPOSE 9999
