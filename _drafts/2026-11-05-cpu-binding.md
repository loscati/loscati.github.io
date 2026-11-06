---
layout: post
title: Process and thread pinning in HPCs
date: 2026-10-18 01:59:00
description: and why I need to know more about how the kernel works
tags: hpc
categories: hpc
---

a warning: this is an optimization done later on in the dev of a program

Meaning of binding/pinning/masks

https://slurm.schedmd.com/mc_support.html

Use slurm to set binding

Slurm uses cgroups or directly sched_setaffinity(). No difference: https://docs.kernel.org/admin-guide/cgroup-v1/cpusets.html
https://docs.lumi-supercomputer.eu/runjobs/scheduled-jobs/distribution-binding/

Python (NUMBA and PyOMP/OMP) and CPU affinity

https://gitlab.discoverer.bg/vkolev/python-threading/-/blob/main/slurm/discoverer/SLURM_Multithreading_Guide.md#how-slurm-controls-threads

Check affinity

```bash
ps -AF | grep YOUR_APPLICATION
# select PID
taskset -pc PID
```