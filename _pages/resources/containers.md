---
layout: page
title: containers
permalink: /resources/containers
description: "docker compose upperò"
---

## Docker


## Singularity/Apptainer

#### Inspect
Inspect what happens when you call `run`:
```bash
singularity inspect --runscript image.sif
```
This works with other parts of the def file; ask for help to `inspect`.

#### Save written data after container exits?
Use persistent overlays. These makes writable an immutable SIF containers that, if something is written in it, it remains after the container exits.

To create one:
```bash
singularity overlay create --sparse --size 1024 /tmp/ext3_overlay.img
singularity run --overlay /tmp/ext3_overlay.img image.sif
```
`--sparse` makes the image take space only if data is written in it.
Difference with `--bind`: bind maps host fs into the container, while overlay creates an isolated writable layer. Use binding for data sharing and overlay for making an immutable container appear writable during runtime.