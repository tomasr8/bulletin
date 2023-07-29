# builder image
FROM python:3.11

# required packages for uwsgi to build
RUN apt-get update && apt-get install -y libpcre3 libpcre3-dev build-essential python3-dev
RUN pip install uwsgi

# RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
# RUN apt-get update && apt-get install -y nodejs
RUN pip install build

ADD bulletin/ /build/bulletin/

ADD pyproject.toml build/pyproject.toml
ADD requirements.txt build/requirements.txt
RUN pip install -r build/requirements.txt

# WORKDIR /build/bulletin/client
# RUN ls
# RUN npm install
# RUN npm run build

WORKDIR /build
RUN python -m build
RUN pip install $(echo dist/bulletin*.whl)

ADD run.sh uwsgi.ini /

RUN chmod +x /run.sh

ENV PG_HOST "172.17.0.1"

CMD ["/run.sh"]
EXPOSE 8080