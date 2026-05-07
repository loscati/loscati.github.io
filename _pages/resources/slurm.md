---
layout: page
title: slurm
permalink: /resources/slurm
description: "slurp!"
---

### `scontrol`
#### For running jobs

Details from submitted job, knowing the `jobid`:
```bash
scontrol show job <jobid>
```

### `sacct`
#### For finished jobs

Show all jobs submitted by user from time after `-S` (`-X` only jobid printed):
```bash
sacct -X -u <userid> --format=JobID,JobName,Partition,Account,AllocCPUS,State,ExitCode,Start,End -S date
```
for `date` it works also `today`, `midnight` etc.

*In CINECA Clusters*, a basic report with CPU utilization, time, and memory inpact:
```bash
cin_seff -j <jobid> -d 2
```

### `sreport`
#### Cluster report

Brief cluster usage right now:
```bash
sreport -t percent -T ALL cluster utilization
```