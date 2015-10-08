# coding: utf-8

# Standard
import os
import os.path
import codecs
import datetime

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
    def __init__(self, tname):
        self.tname = tname
        self.t = Template(readfile(tpath(tname)))

    def generate(self, what, **dict):
        print "Generating %s from %s." % (what, self.tname)
        return self.t.render(dict)

if __name__ == '__main__':

    # remind.appcache
    g = Generator('remind.appcache')
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %k:%M:%S')
    result = g.generate('remind.appcache', timestamp=timestamp)
    outpath = os.path.join(FRONTEND_PATH, 'remind.appcache')
    writefile(outpath, result)

    # html files
    g = Generator('template.html')
    for (title, fname) in [
            (u'Re:Mind', 'index.body.html'),
            (u'Skapa konto', 'signup.body.html'),
            (u'Collect', 'collect.body.html'),
            (u'Process', 'process.body.html')]:
        body = readfile(tpath(fname))
        html = g.generate(fname, title=title, body=body)

        outname = fname.replace('.body', '')
        outpath = os.path.join(FRONTEND_PATH, outname)
        writefile(outpath, html)
