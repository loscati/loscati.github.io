---
layout: page
title: gpu
permalink: /resources/gpu
description: "profiling"
---

## References 

- [GPU and NVIDIA Glossary](https://modal.com/gpu-glossary/device-hardware), thanks to Modal.

## `nsys`

```bash
nsys profile --trace=cuda,nvtx --gpu-metrics-devices=all <application>
```

### `--gpu-metrics-devices=all`

- SM and warps usage
- NVLink Bandwidth (GPU-to-GPU communication, intra-node)
- PCIe Bandwidth (inter-node communication)
