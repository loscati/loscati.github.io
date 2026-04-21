---
layout: page
title: spack
permalink: /resources/spack
description: "Per favore non spackarti"
---

```bash
spack config blame repos/packages # to check configs and from which file they come from
spack spec -Il spec # to check dependencies and whether they are installed/external etc.
spack location -i spec # find installation (and other) location of spec
spack external find spec # find external spec (e.g. cuda, loaded from modules)
```
Do you have multiple spec, very similar between each other, and you want to select a specifi installed package to perform other operations (such as create a module)?
```bash
$ spack find -L

gtz562rmr2nk57j7w2g32oniq4xokxak netcdf-fortran@4.6.1
soamoh7ynsni6smph3mzt6lydpxaiwgd netcdf-fortran@4.6.1
```
search for option `very-long` or `-L`. Then, use the hash as:
```bash
spack info /soamoh7ynsni6smph3mzt6lydpxaiwgd
``` 
TOTEST!!


