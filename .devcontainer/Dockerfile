FROM docker.io/jekyll/jekyll:4

RUN groupadd --gid 1000 jekyll \
 && useradd --uid 1000 --gid 1000 --create-home --shell /bin/bash jekyll \
 && chown -R jekyll:jekyll "$(gem env gemdir)"