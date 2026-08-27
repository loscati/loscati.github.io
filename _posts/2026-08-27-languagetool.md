---
layout: post
title: A simple way to setup a local grammar checker
date: 2026-08-27 01:59:00
description: Use LanguageTool with a self-hosted server
tags: self-hosting
categories: linux
---

The following instructions setups a local LanguageTool server to be used by the Firefox (or Chromium-based) extension, based on [this nice repo](https://github.com/meyayl/docker-languagetool).
You only need Docker CLI:
```bash
mkdir -p $HOME/languagetool/ngrams
mkdir -p $HOME/languagetool/fasttext
docker run -d \
  --name languagetool \
  --restart unless-stopped \
  --cap-drop ALL \
  --cap-add CAP_CHOWN \
  --cap-add CAP_DAC_OVERRIDE \
  --cap-add CAP_SETUID \
  --cap-add CAP_SETGID \
  --security-opt no-new-privileges \
  --publish 8081:8081 \
  --env download_ngrams_for_langs=en \
  --env MAP_UID=1000 \
  --env MAG_GID=1001 \
  --read-only \
  --tmpfs /tmp:exec \
  --volume $HOME/languagetool/ngrams:/ngrams \
  --volume $HOME/languagetool/fasttext:/fasttext \
  meyay/languagetool:latest
```
Now go to the LanguageTool Firefox extension settings, verify that you are NOT logged in, then in the last section "LanguageTool Server" select "Other server", insert:
```
http://localhost:8081/v2
```
and save.
At this point, the extension should use the local service.

The service will start again when the system is reboot.


### What if you cannot use docker in your account?
In this case you can go with `podman`. An even simplier alternative is to use the [image mantained by the collabora team](https://hub.docker.com/r/collabora/languagetool).

In this case, to setup the service:
```
podman pull docker.io/collabora/languagetool
podman run --rm -d -p 8010:8081 collabora/languagetool
```

The only catch is that you need to setup systemd (hence, a `.service` file) to run the service at startup time. However, this requires root previlages.