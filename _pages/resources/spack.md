---
layout: page
title: spack
permalink: /resources/spack
description: "Per favore non spackarti"
---

From where each line in repos/packages/etc comes from?
```bash
spack config blame repos/packages/etc
```

To check dependencies and whether they are installed/external etc.
```bash
spack spec -Il spec
```

Find installation directory (but also staged, etc, see doc) location of `spec`
```bash
spack location -i spec
```

Find external spec (e.g. cuda, loaded from modules)
```bash
spack external find spec
```

**WARNING: the below has to be tested**

Do you have **multiple spec, very similar between each other**, and you want to select a specify installed package to perform other operations (such as create a module)?
```bash
$ spack find -L

gtz562rmr2nk57j7w2g32oniq4xokxak netcdf-fortran@4.6.1
soamoh7ynsni6smph3mzt6lydpxaiwgd netcdf-fortran@4.6.1
```
search for option `very-long` or `-L`. Then, use the hash as:
```bash
spack info /soamoh7ynsni6smph3mzt6lydpxaiwgd
```


