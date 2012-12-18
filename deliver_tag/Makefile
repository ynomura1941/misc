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
	env JUICER_HOME=juicer_deps ./bin/juicer merge -f -i -m closure_compiler --arguments "--compilation_level ADVANCED_OPTIMIZATIONS" -o $(JSBASE) $(SRC)
CMD  = advanced_force_compress_compile
MODE = mrg.min.ad.js

force_compress_compile:
	env JUICER_HOME=juicer_deps ./bin/juicer merge -f -i -m closure_compiler -o $(JSBASE) $(SRC)
CMD  = force_compress_compile
MODE = mrg.min.ad.js

merge: 
	env JUICER_HOME=juicer_deps ./bin/juicer merge -f -i -m "" -o $(JSBASE).mrg.js $(SRC)
CMD  = merge
MODE = mrg.nc.js


verify:
	env JUICER_HOME=juicer_deps ./bin/juicer verify $(SRC)

hoge: $(CMD) 
	@echo "(function(){" > $(JSBASE).$(MODE)
	@cat  $(JSBASE).mrg.js >> $(JSBASE).$(MODE)
	@echo "})();" >> $(JSBASE).$(MODE)

