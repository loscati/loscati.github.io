---
layout: post
title: A simple way to setup a local grammar checker
date: 2026-08-27 01:59:00
description: Use LanguageTool with a self-hosted server
tags: self-hosting
categories: linux
---

The following instructions setups a local LanguageTool server to be used by the Firefox (or Chromium-based) extension.
You only need Docker or Podman. The procedue is very similar (if you use Docker, omit the `docker.io`):
```bash
podman pull docker.io/collabora/languagetool
podman run --rm -d -p 8010:8010 collabora/languagetool
```
Now go to the LanguageTool Firefox extension settings, verify that you are NOT logged in, then in the last section "LanguageTool Server" select "Other server" and paste:
```
http://localhost:8010/v2
```
At this point, the extension should use the local service.

### Start at the system boot
To enable the service to start at the startup, you need to setup a `.service` to be executed by `systemd`. This can be easily done.
