RUBY_CMD=`which ruby`
JUICER_HOME=.


AFCC=.afcc.js
FCC=.fcc.js
MR=.mr.js


ifeq (merge,$(CMD))
MODE=$(MR)
endif
ifeq (advanced_force_compress_compile,$(CMD))
MODE=$(AFCC)
endif
ifeq (force_compress_compile,$(CMD))
MODE=$(FCC)
endif

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
	env JUICER_HOME=juicer_deps ./bin/juicer merge -f -i -m closure_compiler --arguments "--compilation_level ADVANCED_OPTIMIZATIONS" -o $(JSBASE)$(AFCC) $(SRC)

force_compress_compile:
	env JUICER_HOME=juicer_deps ./bin/juicer merge -f -i -m closure_compiler -o $(JSBASE)$(FCC) $(SRC)

merge: 
	env JUICER_HOME=juicer_deps ./bin/juicer merge -f -i -m "" -o $(JSBASE)$(MR) $(SRC)


verify:
	env JUICER_HOME=juicer_deps ./bin/juicer verify $(SRC)

compile: $(CMD) 
	@echo "(function(){" > $(JSBASE).all$(MODE)
	@cat  $(JSBASE)$(MODE) >> $(JSBASE).all$(MODE)
	@echo "}());" >> $(JSBASE).all$(MODE)

