# builder image
FROM node:20-slim AS builder

ADD . /build/

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

# required packages for uwsgi to build
RUN apt-get update && apt-get install -y libpcre3 libpcre3-dev gcc
RUN pip install build
RUN pip install .

USER appuser
CMD ["uwsgi", "--ini", "uwsgi.ini"]
EXPOSE 9999
