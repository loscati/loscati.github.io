---
layout: post
title: A simple way to setup a local grammar checker
date: 2026-08-27 01:59:00
description: Use LanguageTool with a self-hosted server
tags: self-hosting
categories: linux
---

> v2: changed repo, clearer first-setup

The following instructions setups a local LanguageTool server to be used by the Firefox (or Chromium-based) extension, based on [this nice repo](https://hub.docker.com/r/erikvl87/languagetool). The idea is to exploit a ready-made recepie for a Docker Image created from the official LanguageTool repo.

For this to work, you need `docker` installed.

### First setup

> LanguageTool can make use of large n-gram data sets to detect errors with words that are often confused, like their and there.

Download the `ngram` dataset for the language of interest (say `en`) using:

```bash
wget https://languagetool.org/download/ngram-data/ngrams-en-20150817.zip
```

and unzip it where you prefer, let's say `~/lt/ngrams`.

Then you can use the following Docker compose file:

```bash
# docker-compose.yml
---
version: "3"
services:
  languagetool:
    image: erikvl87/languagetool:latest
    container_name: languagetool-service
    restart: unless-stopped
    ports:
      - 8081:8010
    environment:
      - langtool_pipelinePrewarming=true
      - langtool_languageModel=/ngrams    # OPTIONAL: Using ngrams data
      - Java_Xms=1g                       # OPTIONAL: Setting a minimal Java heap size of 1 Gib
      - Java_Xmx=2g                       # OPTIONAL: Setting a maximum Java heap size of 2 Gib
    volumes:
      - ~/lt/ngrams:/ngrams:ro
```

This config:

- uses already downloaded `ngrams`
- uses HTTP server for GET requests (done by Firefox/Chrome extension)
- increases Java memory as suggested for usage with custom `ngrams`
- uses host port `8081`

I suggest to save this inside a common diretory where to find other docker compose files, like `/opt` or `~/services`.
Then, navigate with the CLI in this location and issue:

```bash
docker compose up -d
```

remove the `-d` flag if you want to see how the requests are handled, you can always detatch afterwards.

**Note**: another software that is usually extern is fasttext, that in this image is already installed.

Now go to the LanguageTool Firefox extension settings, verify that you are NOT logged in, then in the last section "LanguageTool Server" select "Other server", insert:

```bash
http://localhost:8081/v2
```

and save. At this point, the extension should use the local service. You can always check if the service is up with `docker ps` and visiting `http://localhost:8081/v2` on the browser (should return something like `Error: This is the LanguageTool API. You have not specified any parameters [...]`).


### Advanced: trying the mainline

If you are feeling brave, you can build your image starting from the main repo instead of the tagged version of LanguageTool. I do that because the tag release cycle of LanguageTool is very slow and a lot of changes are made in the meantime. Obviously, you take the risk to have an untested or instable software.

To build your version do:

```bash
git clone https://github.com/Erikvl87/docker-languagetool.git --config core.autocrlf=input 
```

and apply the following patch (note, these changes assume x86 as architecture) saveing it as `main.patch`:

```patch
From 010745d42627434a3b402d50e247f0ff0db2c506 Mon Sep 17 00:00:00 2001
From: Leonardo Salicari <l.salicari@cineca.it>
Date: Tue, 17 Nov 2026 14:55:27 +0100
Subject: [PATCH] my personalization

---
 Dockerfile         | 10 ++++++----
 docker-compose.yml | 14 +++++++-------
 2 files changed, 13 insertions(+), 11 deletions(-)

diff --git a/Dockerfile b/Dockerfile
index c2f57e3..045b40f 100644
--- a/Dockerfile
+++ b/Dockerfile
@@ -1,6 +1,6 @@
 # syntax=docker/dockerfile:1
 ARG LANGUAGETOOL_VERSION=6.8
-ARG TARGETARCH
+ARG TARGETARCH=x86
 
 FROM debian:bookworm AS build
 
@@ -38,11 +38,13 @@ RUN sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
 ENV LANG=en_US.UTF-8
 
 ARG LANGUAGETOOL_VERSION
-RUN git clone https://github.com/languagetool-org/languagetool.git --depth 1 -b v${LANGUAGETOOL_VERSION}
+# Take from mainline
+RUN git clone https://github.com/languagetool-org/languagetool.git --depth 1
+# RUN git clone https://github.com/languagetool-org/languagetool.git --depth 1 -b v${LANGUAGETOOL_VERSION}
 WORKDIR /languagetool
 
 # Pre-download Maven dependencies using cache
-RUN --mount=type=cache,target=/root/.m2 mvn dependency:go-offline -DskipTests
+# RUN --mount=type=cache,target=/root/.m2 mvn dependency:go-offline -DskipTests
 
 # Build LanguageTool standalone
 RUN --mount=type=cache,target=/root/.m2 mvn --projects languagetool-standalone --also-make package -DskipTests --quiet
@@ -65,7 +67,7 @@ WORKDIR /languagetool
 
 FROM alpine:3.24.0
 
-ARG TARGETARCH
+ARG TARGETARCH=x86
 
 RUN apk add --no-cache \
     bash \
diff --git a/docker-compose.yml b/docker-compose.yml
index e699fd1..ff3b303 100644
--- a/docker-compose.yml
+++ b/docker-compose.yml
@@ -4,16 +4,16 @@ version: "3"
 
 services:
   languagetool:
-    image: erikvl87/languagetool
-    container_name: languagetool
+    image: languagetool
+    container_name: languagetool-service
     restart: unless-stopped
     ports:
-      - 8010:8010                        # Using default port from the image
+      - 8081:8010                        # Using default port from the image
     environment:
+      - langtool_pipelinePrewarming=true
       - langtool_languageModel=/ngrams   # OPTIONAL: Using ngrams data
-      - Java_Xms=512m                    # OPTIONAL: Setting a minimal Java heap size of 512 mib
-      - Java_Xmx=1g                      # OPTIONAL: Setting a maximum Java heap size of 1 Gib
+      - Java_Xms=1g                   # OPTIONAL: Setting a minimal Java heap size of 512 mib
+      - Java_Xmx=2g                      # OPTIONAL: Setting a maximum Java heap size of 1 Gib
     volumes:
-      - /path/to/ngrams/data:/ngrams     # OPTIONAL: The location of ngrams data on the local machine
-      - /path/to/logback.xml:/LanguageTool/logback.xml:ro  # OPTIONAL: Overwrite the logging configuration
+      - /home/leonardo/languagetool/ngrams:/ngrams:ro     # OPTIONAL: The location of ngrams data on the local machine
 
-- 
2.47.3
```

using:

```bash
# inside the repository
git apply --verbose main.patch
```

and build using:

```bash
docker build -t languagetool .
```

Then, you can follow the same setup with docker compose as above.
