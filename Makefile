build-image:
	docker build -t thealexcode/funpics-image-bot .
run:
	docker run -d -p 3001:80 -v logs:/app/data --name funpics-image-bot thealexcode/funpics-image-bot
run-dev:
	docker run --rm -p 3001:80 -v "/Users/a.shiryakov/Documents/my-dev/bot-funpics-generator:/app" -v logs:/app/data --name funpics-image-bot thealexcode/funpics-image-bot
stop:
	docker stop funpics-image-bot
