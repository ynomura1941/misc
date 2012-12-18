RUBY_CMD=`which ruby`
JUICER_HOME=.


JSBASE := $(patsubst %.js,%,$(SRC))


install:
	bundle install --path vendor --binstubs
	env JUICER_HOME=juicer_deps ./bin/juicer install yui_compressor
	env JUICER_HOME=juicer_deps ./bin/juicer install closure_compiler
	env JUICER_HOME=juicer_deps ./bin/juicer install jslint


setup: install
  
clean:
	rm -Rf juicer_deps vendor/* .bundle Gemfile.lock bin

advanced_force_compress_compile:
	env JUICER_HOME=juicer_deps ./bin/juicer merge -f -i -m closure_compiler --arguments "--compilation_level ADVANCED_OPTIMIZATIONS" $(SRC)
force_compress_compile:
	env JUICER_HOME=juicer_deps ./bin/juicer merge -f -i -m closure_compiler $(SRC)

merge: 
	echo $(JSBASE)
	env JUICER_HOME=juicer_deps ./bin/juicer merge -f -i -m "" -o $(JSBASE).mrg.js $(SRC)
	@echo "(function(){" > $(JSBASE).mrg.noc.js
	@cat  $(JSBASE).mrg.js >> $(JSBASE).mrg.noc.js
	@echo "})();" >> $(JSBASE).mrg.noc.js

verify:
	env JUICER_HOME=juicer_deps ./bin/juicer verify $(SRC)

