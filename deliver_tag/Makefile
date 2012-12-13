RUBY_CMD=`which ruby`
JUICER_HOME=.
install:
	bundle install --path vendor --binstubs
	env JUICER_HOME=juicer_deps ./bin/juicer install yui_compressor
	env JUICER_HOME=juicer_deps ./bin/juicer install closure_compiler
	env JUICER_HOME=juicer_deps ./bin/juicer install jslint


setup: install
  
clean:
	rm -Rf juicer_deps vendor/* .bundle Gemfile.lock bin

force_compress_compile:
	env JUICER_HOME=juicer_deps ./bin/juicer merge -f -i -m closure_compiler --arguments "--compilation_level ADVANCED_OPTIMIZATIONS" $(SRC)

merge:
	env JUICER_HOME=juicer_deps ./bin/juicer merge -f -i -m "" -o $(SRC).mrg.js $(SRC)

verify:
	env JUICER_HOME=juicer_deps ./bin/juicer verify $(SRC)

