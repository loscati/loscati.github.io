---
layout: page
title: slurm
permalink: /resources/slurm
description: "slurp!"
---

## `scontrol`
#### For running jobs

Details from submitted job, knowing the `jobid`:
```bash
scontrol show job <jobid>
```

## `sacct`
#### For finished jobs

Show all jobs submitted by user from time after `-S` (`-X` only jobid printed):
```bash
sacct -X -u <userid> --format=JobID,JobName,Partition,Account,AllocCPUS,State,ExitCode,Start,End -S now-24hours
```
No `-S` flags means from today's midnight, otherwise `noon`, `fika` (3PM) etc. works too.

*In CINECA Clusters*, a basic report with CPU utilization, time, and memory inpact:
```bash
cin_seff -j <jobid> -d 2
```

#### Jobscript and submission

```bash
sacct -j <jobid> -o submitline -P
```

```bash
sacct -j <jobid> --batch-script
```

## `sreport`

#### Project report

```bash
sreport cluster AccountUtilizationByUser Accounts=PROJECT Start=2025-09-29 End=2026-07-31
```

#### Cluster report

Brief cluster usage right now:
```bash
sreport -t percent -T ALL cluster utilization
```
