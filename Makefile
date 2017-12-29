PATH := node_modules/.bin:$(PATH)

all: outline.js outline.css

outline.js: src/outline.js src/*.js node_modules
	browserify $< -o $@

outline.css: src/outline.scss
	node-sass $< $@

node_modules:
	npm install aria-api

clean:
	rm -f outline.js outline.css
