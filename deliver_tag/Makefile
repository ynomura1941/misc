RUBY_CMD=`which ruby`
JUICER_HOME=.
.PHONY=: release


AFCC=.afcc.js
FCC=.fcc.js
MR=.mr.js

SRCDIR=src
DESTDIR=release


ifeq (merge,$(CMD))
MODE=$(MR)
endif
ifeq (afcc,$(CMD))
MODE=$(AFCC)
endif
ifeq (fcc,$(CMD))
MODE=$(FCC)
endif

JSBASE = $(patsubst %.js,%,$(SRC))

DEST_FILE_DIR = $(subst $(SRCDIR),$(DESTDIR),$(dir $(SRC)))
RELEASE_FILENAME = fluct_tag.js

install:
	bundle install --path vendor --binstubs
	env JUICER_HOME=juicer_deps ./bin/juicer install yui_compressor
	env JUICER_HOME=juicer_deps ./bin/juicer install closure_compiler
	env JUICER_HOME=juicer_deps ./bin/juicer install jslint


setup: install
  
clean:
	rm -Rf juicer_deps vendor/* .bundle Gemfile.lock bin

afcc: 
	env JUICER_HOME=juicer_deps ./bin/juicer merge -f -i -m closure_compiler --arguments "--compilation_level ADVANCED_OPTIMIZATIONS" -o $(JSBASE)$(AFCC) $(SRC)

fcc: 
	env JUICER_HOME=juicer_deps ./bin/juicer merge -f -i -m closure_compiler -o $(JSBASE)$(FCC) $(SRC)

merge: 
	env JUICER_HOME=juicer_deps ./bin/juicer merge -f -i -m "" -o $(JSBASE)$(MR) $(SRC)


verify:
	env JUICER_HOME=juicer_deps ./bin/juicer verify $(SRC)

compile: $(CMD) 
	@echo "(function(){" > $(JSBASE).all$(MODE)
	@cat  $(JSBASE)$(MODE) >> $(JSBASE).all$(MODE)
	@echo "}());" >> $(JSBASE).all$(MODE)
	@rm -f $(JSBASE)$(MODE)

all:
	$(MAKE) compile CMD=merge SRC=$(SRC)
	$(MAKE) compile CMD=fcc SRC=$(SRC)
	$(MAKE) compile CMD=afcc SRC=$(SRC)

$(DEST_FILE_DIR):
	@echo $(DEST_FILE_DIR)
	@echo $(RELEASE_FILENAME)
	test -d $(DEST_FILE_DIR) || mkdir -p $(DEST_FILE_DIR)
dest: $(DEST_FILE_DIR)
	cp $(SRC) $(DEST_FILE_DIR)$(RELEASE_FILENAME)

