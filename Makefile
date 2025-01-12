make run server:
	npx start-server -s ./frontend/build

lint-frontend:
	make -C frontend lint

install:
	npm ci

start-frontend:
	make -C frontend start

start-backend:
	npx start-server -s ./frontend/build

deploy:
	git push heroku main


develop:
	make start-backend & make start-frontend

build:
	rm -rf frontend/build
	npm run build

start:
	npx start-server -s ./frontend/build