dev:
	node app.js development
	
lint:
	eslint --config ../.eslintrc.json --fix "root/**/*.js"
  
slint:
	stylelint --config ../.stylelintrc.json --fix "root/**/*.css"

opm:
	../media-optimizer.sh root/media
 
prod:
	sh -c "time node app.js production"

all: opm lint slint prod

.PHONY: dev lint slint opm prod all
