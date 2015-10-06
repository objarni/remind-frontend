# coding: utf-8

# Standard
import os
import os.path
import codecs

# Third party
from jinja2 import Template

FRONTEND_PATH = os.environ['REMIND_FRONTEND_PATH']


def tpath(tname):
    return os.path.join(FRONTEND_PATH, 'templates', tname)


def readfile(fname):
    with codecs.open(fname, encoding='utf-8') as f:
        return f.read()


def writefile(fname, content):
    with codecs.open(fname, encoding='utf-8', mode='w+') as f:
        return f.write(content)


class Generator(object):
    def __init__(self):
        self.t = Template(readfile(tpath('template.html')))

    def generate(self, title, body):
        print "Generating %s." % title
        return self.t.render(title=title, body=body)

if __name__ == '__main__':
    g = Generator()
    for (title, fname) in [
            (u'Re:Mind', 'index.body.html'),
            (u'Collect', 'collect.body.html'),
            (u'Process', 'process.body.html')]:
        body = readfile(tpath(fname))
        html = g.generate(title=title, body=body)

        outname = fname.replace('.body', '')
        outpath = os.path.join(FRONTEND_PATH, outname)
        writefile(outpath, html)
