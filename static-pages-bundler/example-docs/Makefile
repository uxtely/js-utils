all: lint slint opm build

build:
	node app.js production
	

dev:
	node app.js development
	
lint:
	eslint --config ../../.eslintrc.json --fix "root/**/*.js"
  
slint:
	stylelint --config ../../.stylelintrc.json --fix "root/**/*.css"

opm:
	../media-optimizer.sh root/media
 
 
.PHONY: dev lint slint opm build all
