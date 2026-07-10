---
layout: page
title: singularity
permalink: /teaching/singularity-tutorial
description: "conteniamo il danno"
---

# Introductory Singularity Hands-on

**Author**: Leonardo Salicari, CINECA, 2026

**Pre-requisites**:
- Linux shell
- Cluster access (ssh)
- Job Scheduling (Slurm)
- MPI basics
- GPU programming basics


This is an **introductory hands-on lesson on Singularity** designed to be taught in person, while live-coding the following instructions. It is meant to guide the instructor but can be used as a reference for students too.

If you are an instructor: there are files to prepare (e.g., `sif` images) before the lesson and to provide to students during the lesson. Read the document in advance. Due to this, this tutorial is not self-consistent. However, most of it can be followed only with a Singularity installation.

"EXTRA" sections and notes highlight advanced topics. These can be covered given there is interest and time.

Throughout this document, some **questions and exercises** are posed to the students. These are not mandatory but highly recommended to build the muscle memory and intuition on containers and the Singularity software.
**Questions** have *hidden* answers that the student is encouraged to answer without spoilers:
<details>
<summary>💬 Question</summary>

📍 Surprising answer!
</details>

Similarly are **exercises**:
<details>
<summary>📝 Excercise</summary>

📍 The path to the truth
</details>

----

To discover all subcommands, run:
```bash
singularity help
```
To have some documentation for a subcommand, run:
```bash
singularity help COMMAND
```

### Pull and "run" containers

#### `pull`
For this tutorial we will work on Leonardo's `$SCRATCH` area:
```bash
ssh user@login.leonardo.cineca.it
cd $SCRATCH
mkdir singularity-tutorial
cd singularity-tutorial
```

Our goal is to download or *pull* an image from the Singularity library. We will use a dummy example that is fast to pull, however that will help us discover various Singularity features and how to work with images and containters.

Before pulling our first image, we must recall that on Leonardo we have internet connection only on login nodes. Morevore, these have a CPU time limit of 10 minutes, which is usually not enough to pull large images.
Therefore, we will pull an image from Leonardo's serial partition (we can ask up to 4 hours):
```bash
srun -A ACCOUNT -n 1 -p lrd_all_serial -t 00:30:00 --pty /bin/bash
```

Let's pull the `lolcow` image (bear with me):
```bash
singularity pull library://godlovedc/funny/lolcow
```
hence, we downloaded from the Singularity `library` registry the image `lolcow`, which is stored in the `funny` repository of user `godlovedc` (that we are trusting with this image; image security is a topic that is not discussed here however [is of foremost importance](https://docs.sylabs.io/guides/latest/user-guide/security.html#security-in-singularityce)).

Be aware that, by default, Singularity will pull the image tagged as `latest`. Sometimes, this might result into an the error "image do not exist". In this case, you need to check which tags are available in the registry (in this case the [Singularity Library](https://cloud.sylabs.io/)) and add a trailing `:tag` to the image name. For example: `singularity pull library://scientiflow/bioinformatics/python:3.12`

```bash
[user@login01 singularity-tutorial]$ ls
lolcow_latest.sif
```
Now we have the **Singularity Image Format (SIF) file** that is the standard format for Singularity images.

We can also pull the image from the Docker Hub registry using:
```bash
singularity pull docker://godlovedc/lolcow
```
However, what is downloading is a **Docker** image, not a SIF. How is Singularity able to use such a file? Ignoring the warnings, you can see the output `INFO:    Converting OCI blobs to SIF format`, hihglighting the extraction of Docker layers and conversion into OCI blob. This interoperability is made possible by the [OCI standard](https://en.wikipedia.org/wiki/Open_Container_Initiative) that enables to [convert a Docker image into a SIF](https://docs.sylabs.io/guides/3.1/user-guide/singularity_and_docker.html#sec-oci-overview).

> [!WARNING]
> While running the above command, you might get an error if `lolcow_latest.sif` already exists.

After we finished pulling, we can exit the Slurm reservation:
```bash
exit
```

##### **EXTRA**: How to keep track of all downloaded files

After some months, you might not remember if or what you have pulled in the machine, because messing around with containers can get you download a lot of files. To recall what you pulled, you can use:
```bash
singularity cache list
```
And see how many containers files (a.k.a. images) you pulled. You might also have OCI *blob* files, these are "layers" from the Docker images you pulled.

#### `shell`

The SIF file, is a static image. Now, we want to **spawn** a container from this image. This can be done in multiple ways that we will explore in multiple steps.
Let's start by accessing the container's shell and understanding the difference between the host and the container.

Let's first understand who we are (deep philosophical question here):
```bash
[user@login01 singularity-tutorial]$ whoami
user
[user@login01 singularity-tutorial]$ hostname # this might be different for you
login01.leonardo.local
[user@login01 singularity-tutorial]$ cat /etc/os-release # which is the OS we are running on
NAME="Red Hat Enterprise Linux"
VERSION="8.8 (Ootpa)"
...
```

To execute the container and access its shell, we can use the convenient `shell` subcommand:
```bash
[user@login01 singularity-tutorial]$ singularity shell lolcow_latest.sif
Singularity>
```
Notice the shell change in `Singularity>`, meaning that now we are inside the container's shell. Now, if we try again the previous commands:
```bash
Singularity> whoami
user
Singularity> hostname
login01.leonardo.local
```
We notice that **nothing has changed**. An important feature of Singularity, that is relevant for an integration standpoint, is that the user remains the same inside and outside the container.

However, if we try:
```bash
Singularity> cat /etc/os-release
NAME="Ubuntu"
VERSION="16.04.3 LTS (Xenial Xerus)"
...
```
Now we are running on Ubuntu, no matter the OS of the machine!

> [!NOTE]
> Recall that this does not mean that we are within a full Ubuntu virtualized, as in a VM. Ubuntu is just the **base image** from which the one we are using is build on. More on this [later](#def-file).
>

<details>
<summary>💬 When you enter the Singularity shell, your username stays the same. Can you think of why this design choice matters specifically in an HPC environment with many users?</summary>

📍 In HPC, shared filesystems and job schedulers rely on user identity for accounting, permissions, and quota enforcement. If Singularity allowed privilege escalation inside the container (e.g., becoming root), a user could bypass filesystem permissions or interfere with other users' data. Keeping the same identity ensures the container cannot be used as a privilege escalation vector.
</details>

Inside the container, all the application that we run are contenarized:
```bash
Singularity> cowsay "I am running inside a container"
 _________________________________
< I am running inside a container >
 ---------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```
This silly application is for sure not installed in an HPC (try it outside the container).
More on "running" the container in a moment.

Now let's **exit the container** shell using:
```bash
Singularity> exit
```
or with the shortcut `CTRL+d`.

#### Singularity images are, by default, immutable

We continue using `shell` to discover another feature of singularity containers:
```bash
[user@login01 singularity-tutorial]$ singularity shell lolcow_latest.sif
Singularity> cd /home/
Singularity> mkdir newdir
mkdir: cannot create directory 'newdir': Read-only file system
```
Doing so, we discover that **the file system inside our container is actually read-only**.
Therefore, any output, log, scratch file created at runtime has to go somewhere else, and [we will see](#accessing-the-host-filesystem).

By default, Singularity images spawn containers with **immutable file systems**; this is a design choice of the underlying filesystem SquashFS.

#### `exec`

Without entering the container shell, you can execute any command **inside** the container using the `exec` subcommand:
``` bash
[user@login01 singularity-tutorial]$ singularity exec lolcow_latest.sif cowsay 'How did you get out of the container?'
```
In this example, Singularity initiate the container, ran the user-provided `cowsay` command with the supplied arguments, displayed the standard output on our host, and then exited.

<details>
<summary>📝 Can you print the container OS details without entering its shell?</summary>

📍 `singularity exec lolcow_latest.sif cat /etc/os-release`
</details>

> [!NOTE]
> **EXTRA** An interesting case is when you need to run shell commands, inside the container, using `exec`. For example take the pipe operator `|`. When you try to use it in a `exec` call, this is interpreted by the *host* shell, not by the *container* shell. To avoid the problem, a trick is to use `sh -c`:
> ```bash
> [user@login01 singularity-tutorial]$ singularity exec lolcow_latest.sif sh -c "fortune | cowsay"
> ```

#### `run`

Running a container means **running a predefined set of commands** defined by the image author. If you try:
``` bash
[user@login01 singularity-tutorial]$ singularity run lolcow_latest.sif
```
You will see a `cowsay` output.
Very handy is the following shortcut:
```bash
[user@login01 singularity-tutorial]$ ./lolcow_latest.sif
```
Hence, calling the image like an executable is equivalent `singularity run` and more compact!

> [!NOTE]
> You might need to make the image executable to run it like above. For example:
> ```bash
> [user@login01 singularity-tutorial]$ chmod +x lolcow_latest.sif
> ```

To understand what precisely is running we need to inspect the image.

#### **EXTRA**: A fundamental difference with Docker

Here we are focusing on **Singularity**. We basically saw that we used it to access a new shell environment (`shell`) or run some binaries (with `exec` and `run`).
Singularity is **process-scoped**, meaning that the container's existence lasts up to the duration of the execution the user requested.

On the contrary, **Docker** by default works differently. If you run, or spawn, a Docker container, this will run until a failure or a user intervention (e.g., `stop`) accours.
This is handled by an always running process called **deamon**.
Therefore, the container "life-cycle" differs profoundly between Singularity and Docker ones.
Podman, another container engine developed by Mozilla, works similarly to Docker.

This design choice reflects the use done for these two containerization technologies. Docker/Podman for cloud based solutions, where the container handles a (micro-)service that needs to run up until a certain point. On the other side, Singularity is made for HPC systems, in which applications scope is different (e.g., scientific runs).
Although, in recent years, [user needs have reduced this gap,](https://indico.dfa.unipd.it/event/1312/) and similar mechanisms to spawn services have been [introduced in Singularity with the `instance` commands](https://docs.sylabs.io/guides/3.0/user-guide/running_services.html?highlight=instance#running-services).

---

### Inspect an image

The commands executed inside the container when we call `run` are encoded in the image. To learn what it is, we use the `inspect` subcommand with the `--runscript` flag:
```bash
[user@login01 singularity-tutorial]$ singularity inspect --runscript lolcow_latest.sif
#!/bin/sh
    fortune | cowsay | lolcat
```
If you pulled the image from the Singularity library, you will see this output. This shell script is executed when `run` is invoked (FYI `lolcat` is used to make the output colorful).

#### `def` file

All Singularity images are **built** (for more information, see the [relevant section](#extra-build-a-basic-image)) from a file called [**Definition File**](https://docs.sylabs.io/guides/latest/user-guide/definition_files.html) or **`def` file**. In a declarative fashion, it describes how to build the image.

You can see the `def` file of our `lolcow_latest.sif` using `inspect --deffile`:
```bash
[user@login01 singularity-tutorial]$ singularity inspect --deffile lolcow_latest.sif
bootstrap: library
from: ubuntu:16.04

%environment
    export LC_ALL=C
    export PATH=/usr/games:$PATH

%runscript
    fortune | cowsay | lolcat

%post
    apt-get -y update
    apt-get -y install fortune cowsay lolcat
```
Now you can also see the meaning of the `--runscript` flag used in the previous section.

Definition files are divided into two parts:
- **Header**: image base. In this case, the `lolcow` image is based on Ubuntu (as we already knew) as pulled (or *bootstrapped*) from the Singularity library repository. This serves as the starting point of the image.
- **Sections**: each section starts with a `%` and contains a series of commands executed by the shell `/bin/sh` at built-time. All sections are optional and there are a lot.

Basic sections are:
- `%setup`: run *outside* the container, before everything. These can be a security issue because these are run as superuser!
- `%files`: to copy files from the host to the container; here you can appreciate how the two file systems are separated. It can be helpful to move scripts, data, etc. into the container.
- `%post`: this is executed in a clear environment (no host environemnts are available). This is the place where you download code, compile, install with `apt` etc. In the lolcow example, we install the required binaries for our talkative cow.
- `%environment`: to define environmental variables to be set at **runtime**. In the lolcow example, we update `LC_ALL` and the `PATH`.
- `%runscript`: this we already encountered; these are the commands executed with `singularity run` at runtime.


For other sections and more details on these, see [the official documentation](https://docs.sylabs.io/guides/latest/user-guide/definition_files.html#sections).

<details>
<summary>💬 Can you see why running the post phase in a "clear environment" is important for reproducibility?</summary>

📍  If `%post` inherited the host environment, the build outcome could silently depend on variables like `PATH`, `LD_LIBRARY_PATH`, or proxy settings that differ between machines. A clean environment forces the `def` file to be self-contained and explicit about every dependency, so the image builds identically regardless of who runs it or where.
</details>

> [!NOTE]
> **EXTRA** You will often see this or something similar in a container's runscript:
> ```bash
> %runscript
>     python "$@"
> ```
> In this case, the `$@` notation forward all arguments after `singularity run` to `python`. This open the possibility to use the singurity image like an executable, e.g.: `$ ./myimg.sif arg1 arg2`.

---

### Accessing the host filesystem

We said that there is a `%files` section in the `def` file used to copy data from the host file system to the container file system. This means that these two are separated.
However, if we try:
```bash
[user@login01 singularity-tutorial]$ singularity shell lolcow_latest.sif
Singularity> echo "hello from the container" > ~/message.txt
Singularity> cat ~/message.txt
hello from the container
Singularity> exit
[user@login01 singularity-tutorial]$ cat ~/jawa.txt
hello from the container
```
We overcame the limitation [we discussed ealier on unwritable file system](#singulatity-images-are-by-default-immutable), because the written file persisted even after the container was exited. How?

The idea is that Singularity actually **mounts** inside the container some host directories. In general, this operation is known as **bind mounts**.
[By default](https://docs.sylabs.io/guides/latest/user-guide/bind_paths_and_mounts.html#system-defined-bind-paths), Singularity binds: `$HOME`, `$PWD`, `/tmp`, `/proc`, `/sys`, and `/dev`.

<details>
<summary>💬 Can you think of a situation where the $HOME default mount could silently break the containerized application?</summary>

📍   If the host has a `~/.bashrc`, `~/.python_history`, or configuration files (e.g., `~/.config`) that conflict with the software installed in the container. The application may behave differently than the image author intended, undermining reproducibility.
</details>


#### Bind user-defined directories

Let's say we want to access and write data on a directory `$SCRATCH/data`. We first create it and put some data in it:
```bash
[user@login01 singularity-tutorial]$ mkdir -p $SCRATCH/data
[user@login01 singularity-tutorial]$ echo "Le mucche fanno mu ma una fa..." > $SCRATCH/data/budino.txt
```

We can use the flag `--bind/-B` to bind the newly created directory to **an already existing one inside the container**, with the syntax `host_dir:container_dir`:
```bash
[user@login01 singularity-tutorial]$ singularity exec --bind $SCRATCH/data:/mnt lolcow_latest.sif ls /mnt
budino.txt
[user@login01 singularity-tutorial]$ singularity exec --bind $SCRATCH/data:/mnt lolcow_latest.sif sh -c "cowsay < /mnt/budino.txt"
```
The same works for `run` or `shell`.

<details>
<summary>💬 How did we know that mnt was available inside the container?</summary>

📍  We exploit the common Linux file system structure (recall the base of our `lolcow` image?) where `/mnt` is usually used as mounting point.
</details>

The same behavior can be achived with the enviromental variables `$SINGULARITY_BIND` or `$SINGULARITY_BINDPATH`.

It is common to bind **multiple user defined directories** inside a container, and the general syntax is:
```bash
singularity shell --bind src1:dest1,src2:dest2,src3:dest3 some.sif
```

---

### Run a container with MPI

Here we see the capabilities of Singularity containers in the HPC environment.

The MPI implementation used in the CINECA clusters is OpenMPI (as opposed to MPICH). Singularity offers the possibility to run parallel applications compiled and installed in a container using the host MPI installation. This is called *hybrid approach*. The OpenMPI installed in the container and the one on the host work in tandem to instantiate and run the job.

The only caveat is that **the two installations (container and host) of OpenMPI have to be compatible**, precisely at the Application Binary Interface (ABI) level.

As a test case of an MPI application, we will use a standard benchmark of HPC systems, the [High-Performance Linpack benchmark](https://www.netlib.org/benchmark/hpl/). This is a standard benchmark to estimate the FLoting point OPerations per second (`flop/s`) of the hardware and the network when solving a dense linear system. MPI is used because the matrix is divided into blocks and distributed among processes for the computation.

> [!NOTE]
> `def` and jobscript can be found in the HPC school Gitlab repo, while the `sif` image is provided by the instructor.

Let's start by looking at the `hpl/hpl.def` file, focusing on the `$post` section. Here we first update the repositories of the base Linux distribution, which is Ubuntu 20.04.
Then, we install the required softwares:
1. OpenMPI 4.1.7: at the time of writing, the version that is compatible with the one installed on Leonardo. For updates, see [CINECA documentation](https://docs.hpc.cineca.it/services/singularity.html#containers-in-hpc-environment)
2. BLAS: Fortran libraries for linear algebra, used by the HPL software
3. HPL: finally, the actual benchmark, statically compiled with BLAS

The `make` files are used to compile BLAS and HPL.
Finally, when using `singularity run hpc.sif`, it searches in the same directory for the `HPL.dat` text file that contains run configurations. For more info, see [the documentation](https://www.netlib.org/benchmark/hpl/tuning.html).

> [!NOTE]
> Note that in the `$environment` section, we export the `LD_LIBRARY_PATH` in order to make the OpenMPI libraries discoverable by the `xhpl` binary.

In Leonardo, you cannot build images with root, hence the instructor will provide you with a `sif` image to use. On the contrary, if you have Singularity on your local machine, you can build it by yourself (it should take <10 minutes; see [the relevant section if you are curious](#build-a-basic-image)).

To run the `sif` iamge we write a jobscript `hpl/submit.sh`. Notice that in order to make MPI available to the container, we must load the relevant module:
```bash
module load hpcx-mpi/2.19
module load cuda/12.2
```
`hpcx-mpi` is an OpenMPI implementation that is optimized for device-to-device communications when using NVIDIA's GPUs and Infiniband as inter-node network for communications.

Notice the resources requested via Slurm: 2 nodes and 4 tasks per node. The benchmark distributes the matrices into blocks in a grid of rank 8 (this is specified in the `HPL.dat` file), hence we need to request resources to allocate that many MPI processes.

<details>
<summary>📝 Complete the submit.sh file: how do you spawn 8 MPI processes and call the singularity container?</summary>

📍 First, you need to load `hpcx-mpi/2.19`. Then, the syntax to initiat 8 MPI processes of the container is:
```bash
mpirun -np 8 singularity exec hpl.sif xhpl
```
Or by using the more concise `run` command. Solution can be found in `hpl/submit_solution.sh`
</details>

<details>
<summary>💬 What happens if you call mpirun after singularity?</summary>

📍  Namely, if you do: `singularity exec hpl.sif mpirun -np 8 xhpl`? It will run 8 MPI processes **inside** the container.
</details>

To submit the container run, we can issue:
```bash
[user@login01 containers]$ cd hpl
[user@login01 hpl]$ sbatch submit.sh
```
and wait for the computation to finish by monitoring the `slurm-JOBID.out` or `squeue --me` list.

To see how Leonardo's network and hardware performed, we can have a look at the `slurm-JOBID.out` file. Each test (which corresponds to a set of specific configurations and algorithms, expressed by a string like `WR00C2L2`) looks like this:
```bash
================================================================================
T/V                N    NB     P     Q               Time                 Gflops
--------------------------------------------------------------------------------
WR00C2L2        2045    16     2     4               0.07             7.7453e+01

--------------------------------------------------------------------------------
||Ax-b||_oo/(eps*(||A||_oo*||x||_oo+||b||_oo)*N)=   4.98906097e-03 ...... PASSED
```
Each test tells you about the matrix size (`N`), how it was decomposed (`NB`, `P`, `Q`), the performances (`Gflop/s`) and if the result is correct (`... PASSED`).

---

### Run a container with NVIDIA GPU accelleration

Singularity has the advantage of **exploiting the GPU to accelerate software** that has been containerized.

To run GPU applications on accelerated clusters, like Leonardo Booster partition, one first has to check if the image holds a compatible version of CUDA. You can find the compatibility table for CINECA clusters in [our documentation](https://docs.hpc.cineca.it/services/singularity.html#containers-in-hpc-environment).

A simple and effective way to obtain a container image provided with a CUDA installation is to bootstrap from an *NVIDIA HPC SDK Docker container*, which already comes equipped with CUDA, OpenMPI, and the NVHPC compilers.
For example, in the header of a `def` file, the versioning scheme is:
```bash
Bootstrap: docker
From: nvcr.io/nvidia/nvhpc:$NVHPC_VERSION-$BUILD_TYPE-cuda$CUDA_VERSION-$OS
```
- `$BUILD_TYPE`: can be `runtime` or `devel`; the first one is lighter and bundles only software to run applications, while the second one also includes compilers.
- `$CUDA_VERSION`: can be a number or `multi`, for multiple CUDA installations, hence, bigger images.

**To run a container with support for NVIDIA GPU**s, we just need to add the flags `--nv` and `--nvccli` when we spawn the container with `run` and the like.
This flag ensures:
- that `/dev/nvidiaX` device entries are available inside the container, so that GPUs are accessible
- basic CUDA libraries are located and binded
- `LD_LIBRARY_PATH` is set inside the container

To test it, we have a custom defined image from the `gpu_burn/gpu_burn.def` file, which compiles a code to stress test NVIDIA GPUs.
For the reason above, the image is provided by the instructor and the student has to copy it or build it locally.

Once the `gpu_burn.sif` is available, we can run this simple stress test by importing the relevant modules and `run` the image. This time we will try to run it interactively:
```bash
[user@login01 containers]$ cd gpu_burn
[user@login01 gpu_burn]$ module load hpcx-mpi/2.19
[user@login01 gpu_burn]$ module load cuda/12.2
[user@login01 gpu_burn]$ srun -t 00:10:00 --nodes=1 --ntasks-per-node=1 -p boost_usr_prod --gres=gpu:1 --qos=boost_qos_dbg -A ACCOUNT --pty /bin/bash
[user@lrdn0001 gpu_burn]$ singularity run --nv gpu_burn.sif -m 10% 60
```
This will occupy `10%` of the GPU memory for 60 seconds.

<details>
<summary>📝 Use a single singularity exec command with the appropriate GPU flag to check whether the CUDA installation inside gpu_burn.sif is visible and functional, using a tool already bundled with CUDA</summary>

📍 `singularity exec --nv gpu_burn.sif nvidia-smi`
</details>

> [!NOTE]
> Singularity can exploit AMD ROC's software too by using the `--rocm` flag

---

### **EXTRA**: Basics on building an image

The process to convert a `def` file into an image is called **bulding**.

We already saw `def` file sections and, in order to exploit the host GPUs or nodes' network, how we need to take into account compatibility between GPU drivers and MPI implementations while building our image.
Having these in mind, this is a brief description of how to build an image.

> [!WARNING]
> **You cannot build Singularity images as root on Leonardo**. This is for security reasons. Hence, these operations has to be perfomerd locally or within a cluster in which you have root permissions.
> This part of the tutorial is meant to be followed and not tested by students.

Everything starts from a `def` file, for the section descriptions you can refer to the [previous section](#def-file).
Once you have a `def` file and [Singularity installed on your local machine or cluster](https://docs.sylabs.io/guides/3.0/user-guide/installation.html), you can build the image.

**Tip**: do not add input or output data into the container. Containers are for applications and software stack, on the other hand, data has to be stored in the host file system. Otherwise, image sizes grows too much.

If you want, you can try it out with the `def` file provided in this tutorial.
To build your image, the syntax is:
```bash
[user@local ~]$ sudo singularity build myimg.sif myimg.def
```
By default, this produces an **immutable object** with `sif` extention. One can create a *writable object* with the option `--sandbox`. The latter is particularly useful when prototyping a custom image that you need to change on the fly.
As you may have noticed, you are required `sudo` privelages. The reasons are multiple:
- Permission to install software as described usually in the `%post` section
- Correct mapping between host user and container users
- Builds require operation on root-owned filesystems

> [!NOTE]
> No superuser privilages? Singularity offers different mechanisms to overcome this limitation: building remotely using [`--remote`](https://docs.sylabs.io/guides/latest/user-guide/build_a_container.html#remote-builds), using the [`--fakeroot`](https://docs.sylabs.io/guides/latest/user-guide/build_a_container.html#fakeroot-builds) mode or limit unprivileged builds with [`--proot`](https://docs.sylabs.io/guides/latest/user-guide/build_a_container.html#unprivileged-proot-builds).

You can also start from an already compiled image that can be pulled from the registries. For example, fom the Singularity Hub:
```bash
[user@local ~]$ sudo singularity build singularity.sif shub://vsoch/hello-world
```
or from the Docker Hub:
```bash
[user@local ~]$ sudo singularity build singularity.sif docker://ubuntu
```
yet again, we see the interoperability between Docker and Singularity images thanks to their support for the OCI specification.

The building phase might take some time, depending on the internet bandwidth, the number of images to bootstrap, or the software to compile/install.
If you need a custom directory for temporary building files, one can use the environmental variables `$SINGULARITY_TMPDIR` and `$SINGULARITY_CACHEDIR` (defaults are usually bad!).

Once your `mysif.sif` is ready, you can copy it into Leonardo clusters using the dedicated [data transfer](https://docs.hpc.cineca.it/hpc/hpc_data_storage.html#data-transfer) nodes that avoid the CPU time limitation active on login nodes. These are fundamental when the `sif` image is big.

#### Why you should probably consider using Docker to build an image

If you are going to work in a HPC environment with only Singularity/Apptainer, building images using these tool is the main option.
However, if there is the possibility to run these images in other environments, Docker images might be the best option. There are two reasons for this.

Firtly, Docker images are *layered*. Looking at how a SIF file is composed (`singularity sif list image.sif`) it will reveal that it is composed by a `def` file, some JSONs and the filesystem. This is almost a monolithic object. On the contrary, Docker images are composed by multiple "layers" bundled together (and you can see them with `docker history image`). This desing difference is at the base of why Docker containers are easier to modify, in an incremental way, with respect to SIF images.
This can be very handy when prototyping and debugging a container.

Secondly, and most importantly, compatibility. We can easily pull a Docker image from Docker Hub with Singularity and convert it into a SIF image. The converse is possible but not straightforward. Almost all container engines support out-of-the-box Docker images, and this can be a huge advantage when distributing your container.
I recall you that both formats are compliant with the OCI scpecification, however, more tools are available for Docker than Singularity.

More details can be found in [this tutorial by Pawsey SC](https://pawseysc.github.io/hpc-container-training/21-build-docker/index.html).

---

### **Extra**: Misc

Other advanced topics not discussed here but worth mentioning are:
- [**Persistent overlays**](https://docs.sylabs.io/guides/latest/user-guide/persistent_overlays.html#persistent-overlays): this is a mechanism to add a writable layer to an immutable SIF in order to write data on it and save it as external object. What is the difference with binding a directory? It modifies the image (when you call the overlay) and it is not shared with the host file system.
- **Security concerns with containers**: the official SingularityCE documentation provides [a general overview of the possible security issues](https://docs.sylabs.io/guides/latest/user-guide/security.html#security-in-singularityce) related to containers. Using trusted registries, decide the level of privilage and isolation of a container are key topics when running programs.

---
### References
- [Community-based Singularity tutorials](https://singularity-tutorial.github.io)
- [SingularityCE official quickstart](https://docs.sylabs.io/guides/latest/user-guide/)
- [CINECA HPC Documentation on Singularity](https://docs.hpc.cineca.it/services/singularity.html#containers-in-hpc-environment)
- [Introduction to Containers on HPC by Pawsey SC](https://pawseysc.github.io/hpc-container-training/)