all: install client_install

dev:
	npm start

install:
	npm i

client_install:
	cd client; npm i && npm run bundle
