build:
  docker build -t tg-funpics-generator .
run:
  docker run --rm -p 3000:80 --name tg-funpics-generator tg-funpics-generator
stop:
  docker stop tg-funpics-generator
