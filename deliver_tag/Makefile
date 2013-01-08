.PHONY: release
RUBY_CMD=`which ruby`
JUICER_HOME=.


CMP_SUFFIX=.cc.js
MR_SUFFIX=.mrg.js
FILENAME=fluct_tag.js

SRCDIR=src
DESTDIR=release
S3CONF=s3.conf
TAGDIR=deliver_tag
#BACKET=fluct-sandbox
BACKET=img.fluct.jp.dev.fluct.me
S3HEADER=--add-header=Expires:"$(shell LANG='' TZ=GMT date --date='1 years' +'%a, %d %m %Y %H:%I:%S GMT')"
CDN=y-nomura.img.fluct.jp.dev.fluct.me

WEB_DEPLOY_DIR=/home/personal_contents/y-nomura/fluct_deliver_tag


ifeq (merge,$(CMD))
MODE=$(MR_SUFFIX)
endif
ifeq (compress,$(CMD))
MODE=$(CMP_SUFFIX)
endif

SRC ?= $(SRCDIR)/$(KIND)/$(VER)/$(FILENAME)

JSBASE = $(basename $(SRC))
DEST_FILE_BASE = $(subst $(SRCDIR),$(DESTDIR),$(JSBASE))
DEST_FILE_DIR = $(subst $(SRCDIR),$(DESTDIR),$(dir $(JSBASE)))


install:
	bundle install --path vendor --binstubs
	env JUICER_HOME=juicer_deps ./bin/juicer install yui_compressor
	env JUICER_HOME=juicer_deps ./bin/juicer install closure_compiler
	env JUICER_HOME=juicer_deps ./bin/juicer install jslint

clean:
	rm -Rf juicer_deps vendor/* .bundle Gemfile.lock bin

compress:
	env JUICER_HOME=juicer_deps ./bin/juicer merge -f -i -m closure_compiler --arguments "--compilation_level ADVANCED_OPTIMIZATIONS" -o $(JSBASE).tmp$(CMP_SUFFIX) $(SRC)
merge: 
	env JUICER_HOME=juicer_deps ./bin/juicer merge -f -i -m "" -o $(JSBASE).tmp$(MR_SUFFIX) $(SRC)

verify:
	env JUICER_HOME=juicer_deps ./bin/juicer verify $(SRC)

compile: $(CMD)
	@echo "(function(){" > $(JSBASE)$(MODE)
	@cat  $(JSBASE).tmp$(MODE) >> $(JSBASE)$(MODE)
	@echo "}());" >> $(JSBASE)$(MODE)
	@rm -f $(JSBASE).tmp$(MODE)

compile_all:
	$(MAKE) compile CMD=merge SRC=$(SRC)
	$(MAKE) compile CMD=compress SRC=$(SRC)

$(DEST_FILE_DIR):
	@echo $(DEST_FILE_DIR)
	@echo $(RELEASE_FILENAME)
	test -d $(DEST_FILE_DIR) || mkdir -p $(DEST_FILE_DIR)

dest: $(DEST_FILE_DIR)
	cp $(SRC) $(DEST_FILE_DIR)$(DEST_FILE)

release_cp_tag:
	$(MAKE) compile_all SRC=$(SRC)
	$(MAKE) dest SRC=$(JSBASE)$(CMP_SUFFIX) DEST_FILE=$(FILENAME)

release_cp_cs:
	$(MAKE) dest SRC=src/cookie_sync.js  DEST_FILE=cookie_sync.js

s3_tag:
	@if [ ! -f release/$(KIND)/$(VER)/fluct_tag.js ]; then \
		exit -1; \
	fi
	s3cmd -c $(S3CONF) $(S3HEADER) put release/$(KIND)/$(VER)/fluct_tag.js s3://$(BACKET)/$(TAGDIR)/$(KIND)/$(VER)/$(FILENAME)
s3_cs:
	@if [ ! -f release/cookie_sync.js ]; then \
		exit -1; \
	fi
	s3cmd -c $(S3CONF) $(S3HEADER) put release/cookie_sync.js s3://$(BACKET)/$(TAGDIR)/cookie_sync.js

cdn: 
	@if [ $(shell curl -s -o /dev/null -I -w "%{http_code}" http://$(CDN)/$(TAGDIR)/$(TARGET_FILE)) -ne 200 ]; then \
		echo "error cache generate in cdn $(TAGET_FILE)"; \
		exit -1; \
	fi

cdn_tag:
	$(MAKE) cdn TARGET_FILE=$(KIND)/$(VER)/$(FILENAME)
cdn_cs:
	$(MAKE) cdn TARGET_FILE=cookie_sync.js

