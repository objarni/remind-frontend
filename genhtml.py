# coding: utf-8

# Standard
import codecs

# Third party
from jinja2 import Template


def readfile(fname):
    with codecs.open(fname, encoding='utf-8') as f:
        return f.read()


def writefile(fname, content):
    with codecs.open(fname, encoding='utf-8', mode='w+') as f:
        return f.write(content)


def generate(title, body):
    template = readfile('templates/template.html')
    t = Template(template)
    return t.render(title=title, body=body)

if __name__ == '__main__':
    for (title, fname) in [
            (u'Re:Mind', 'index.body.html'),
            (u'Collect', 'collect.body.html'),
            (u'Process', 'process.body.html')]:
        body = readfile('templates/' + fname)
        html = generate(title=title, body=body)
        writefile(fname.replace('.body', ''), html)
