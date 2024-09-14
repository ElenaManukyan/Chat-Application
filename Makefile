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

start:
	make start-backend

develop:
	make start-backend & make start-frontend

build:
	rm -rf frontend/build
	cd frontend && npm install && npm run build

start:
	npx start-server -s ./frontend/build