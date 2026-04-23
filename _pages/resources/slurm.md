### Submitted and not finished jobs: `scontrol`
#### Details from submitted job, knowing jobid
```bash
scontrol show job <jobid>
```

### Job submitted: `sacct`
#### Show all jobs submitted by user from time after -S (-X only jobid printed)
```bash
sacct -X -u <userid> --format=JobID,JobName,Partition,Account,AllocCPUS,State,ExitCode,Start,End -S date
```
for `date` it works also `today`, `midnight` etc.

### Cluster usage: `sreport`
#### Brief cluster usage atm
```bash
sreport -t percent -T ALL cluster utilization
```

### Custom
#### Node displacement of a run (only on CINECA clusters)
```bash
cin_seff -j <jobid> -d 2
```
