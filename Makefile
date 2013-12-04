CC=coffee
SRCDIR=coffee
BUILDDIR=js
ALL_SRC_FILES := $(wildcard $(SRCDIR)/*)
ALL_OTHER_SRC_FILES := $(filter-out %.coffee, $(ALL_SRC_FILES))
ALL_OTHER_FILES := $(ALL_OTHER_SRC_FILES:$(SRCDIR)/%=$(BUILDDIR)/%)

SRC=$(wildcard $(SRCDIR)/*.coffee)
BUILD=$(SRC:$(SRCDIR)/%.coffee=$(BUILDDIR)/%.js)

all: coffee other

# coffeescript files

coffee: $(BUILD)

$(BUILDDIR)/%.js: $(SRCDIR)/%.coffee
	$(CC) -o $(BUILDDIR)/ -c $<

# other files

other: $(ALL_OTHER_FILES)

$(ALL_OTHER_FILES): $(BUILDDIR)/%: $(SRCDIR)/%
	cp $< $@

# cleanup

.PHONY: clean
clean:
	-rm $(BUILD)
	-rm $(ALL_OTHER_FILES)
