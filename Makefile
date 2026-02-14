.PHONY: test clean

test:
	pytest

clean:
	rm -rf __pycache__ *.pyc