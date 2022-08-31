build:
	docker build -t text2image .
run:
	docker run -d -p 4200:4200 -v logs:/app/data --name text2image text2image
run-dev:
	docker run --rm -p 4200:4200 -v "/Users/a.shiryakov/Documents/my-dev/bot-funpics-generator:/app" -v logs:/app/data --name text2image text2image
stop:
	docker stop text2image
