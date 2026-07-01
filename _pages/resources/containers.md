---
layout: page
title: containers
permalink: /resources/containers
description: "docker compose upperò"
---

## Docker

#### Inspect an image

Find their layers with:
```bash
docker history --no-trunc <image>
```

#### Dump an image or container into `tar`

You can dump an image into its layers using:
```bash
docker save <image> -o image.tar
```

Or to save a Docker container state:
```bash
docker export <container_id> -o container.tar
```

To load both into a new image:
```bash
docker load -i output.tar
```
anche se compressi in `gz`.

## Singularity/Apptainer

#### Inspect an image
Inspect the `def` file (and, e.g., the `runscript` section):
```bash
singularity inspect --deffile image.sif
```

#### Save written data after container exits?
Use persistent overlays. These makes writable an immutable SIF containers that, if something is written in it, it remains after the container exits.

To create one:
```bash
singularity overlay create --sparse --size 1024 /tmp/ext3_overlay.img
singularity run --overlay /tmp/ext3_overlay.img image.sif
```
`--sparse` makes the image take space only if data is written in it.
Difference with `--bind`: bind maps host fs into the container, while overlay creates an isolated writable layer. Use binding for data sharing and overlay for making an immutable container appear writable during runtime.