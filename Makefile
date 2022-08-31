build:
	docker build -t thealexcode/text2imagebot .
run:
	docker run -d -p 4200:4200 -v logs:/app/data --name text2imagebot thealexcode/text2imagebot
run-dev:
	docker run --rm -p 4200:4200 -v "/Users/a.shiryakov/Documents/my-dev/bot-funpics-generator:/app" -v logs:/app/data --name text2imagebot thealexcode/text2imagebot
stop:
	docker stop text2imagebot
