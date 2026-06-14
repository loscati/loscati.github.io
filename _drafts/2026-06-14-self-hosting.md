---
layout: post
title: Networking with a personal NAS
date: 2026-06-14 01:59:00
description: nginx, tailscale and why I keep failing
tags: self-hosting nas
categories: self-hosting
# thumbnail: assets/img/9.jpg
# images:
#   lightbox2: true
#   photoswipe: true
#   spotlight: true
#   venobox: true
---

This is a note to my future self: do not simplify your life with pre-made solutions; these will make your life harder when you will want more options.
I keep forgetting apperently.

Going into the topic: here I describe my brief journey in setup a simple remote connection to my personal NAS for personal use.

## Principles

The main idea is that I brought a NAS to have access to my files and some services. Most of these are for my personal use and, therefore, has to be accessible only by me.
On the other hand, some files have to be shared among people (e.g., photos), and some services I want to be easily accessible by me, like connecting to a website from anywhere, because I am a bit lazy.

The setup of the VPN access uses Tailscale, for which I am not satisfied, because it uses an external service to work. I mean, it works like a charm, but the whole point of having a NAS was to detach from external services that can increase their prices and shut down services at their will. Therefore, I won't discuss it here until I have a better solution.  

## How to access publicly a service

I need easily accessible services: photos and my RSS server.

To do this, I am exploiting a reversed proxy (some would say a *yxorp*). As a non-programmer, I was pretty much confused by this concept.
For those of you that are scared by all these concepts, just know that you are right... almost.
The basics to make your server accessible through a web browser are few, although details can be devilish.

Digital Ocean provides a very nice [blog post about how to setup nginx](https://www.digitalocean.com/community/tutorials/how-to-configure-nginx-as-a-reverse-proxy-on-ubuntu-22-04#step-1-installing-nginx). You have to read it carefully because it is well done on the topic. What follows is what I learn by myself on top of this.

### Use a personal (sub-)domain: domains and DDNS

You have to have a name on the Internet, a.k.a. a address to connect.
I decide to buy a domain in GoDaddy. Now, I need to tell the DNS to point to my machine. However, the code that uniquely identifies my machine on the internet, the IP, changes occasionally. This can be avoided by requesting to your internet provider (a.k.a. ISP) a *static IP*. If you don't want to, you can use a Dynamic DNS (DDNS).

It is quite simple in principle: you ask a web service to take the dynamic IP of your machine and map it to a certain fixed name. For example, I can fix the name `something.ddns.org` that uses a service that, every time someone tries to connect to `something.ddns.org` it gets redirected to my machine IP. A service that provides that is [Duckdns](https://www.duckdns.org/), which is free and made available thanks to donations (donate!).
However, my IP is dynamic; it changes. Hence, I need my machine to communicate to Duckdns my machine IP when it changes in order to redirect people to the correct location.

Usually, this is done by a local script on your machine that periodically communicates with Duckdns using a token for secure access (when you register on Duckdns, on the top part of the page you can spot the token) the current IP.

UGreen has this feature embedded in their OS under `Control Panel > Device connection > Remote access > Second Method (DDNS)`. You add a new method and select Duckdns. In UGreen terms, ID-accessKey means how you registered on Duckdns. Usually, it was `email@provider`, while the Duckdns token above has to be copied in the `access key` part.

Finally (and please, read the Digital Ocean guide for this), I decided to use a custom sub-domain to point to my Duckdns address.
In my provider (GoDaddy), I've added a `CNAME` (still don't know what it is) with value `rss` that points to my Duckdns address `something.ddns.org`. This means that when someone types `example.com` is redirected to `something.ddns.org`.

At this point, if the web browser uses HTTP, it reaches my machine for port 80, while if it uses HTTPS it reaches for port 443.

### nginx and my router port-forwarding

In a nutshell, nginx is what keeps an eye on some of your machine ports, and answers.

Nginx is already installed on UGreen OS; however, this is based on Ubuntu, hence it is fairly simple to install with `apt`.
The first thing is to add a setting file for nginx with:
```
sudo nano /etc/nginx/sites-available/example.com
```
everything has to be done as root.
This file has the following structure:
```
# 1. Configurazione HTTP (Porta interna HTTP_PORT)
# Riceve il traffico dal router (Porta 80 esterna) e lo forza in HTTPS
server {
    listen HTTP_PORT;
    listen [::]:HTTP_PORT;
    server_name example.com;

    # Serve per i futuri rinnovi automatici di Certbot
    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }

    # Reindirizzamento forzato su HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# 2. Configurazione HTTPS (Porta interna HTTPS_PORT)
# Riceve il traffico dal router (Porta 443 esterna) e lo manda al tuo servizio RSS
server {
    listen HTTPS_PORT ssl;
    listen [::]:HTTPS_PORT ssl;
    server_name example.com;

    # Percorsi dei certificati appena generati da Certbot
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # Parametri di sicurezza SSL standard
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Inoltro del traffico verso il tuo servizio RSS locale
    location / {
        proxy_pass http://127.0.0.1:9090;
        proxy_set_header X-Real-IP $remote_addr;
        #proxy_set_header X-Forwarded-For $proxy_add_x_forwarded-for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

A very important thing is that the ports we listen to are HTTP_PORT for HTTP and HTTPS_PORT for HTTPS. Why is that?

> **Hate moment for UGreen number 1**: the nginx pre-installed in UGreen OS intercept every interrogation to the standard 80 and 443 ports. Hence, custom reverse proxies need to "listen" to different ports.

However, when I write in my browser `https://www.example.com` the browser connects by default to port 443. How do I circumvent the standard 443, taken hostage by UGreen OS, for my service?

The answer is: router port forwarding.
TLDR: In your router settings (usually the expert settings), there is an option to redirect calls from the outside world from a port to another. Obviously, my router is reached by the signal thanks to the domain redirection to the DDNS service and thanks to it that connects a fixed name `leonardo.duckdns.org` to my actual IP.
Therefore, if my browser asks for port 443, the router redirects to HTTPS_PORT (which I choose randomly-sh).
Usually, routers allow you to specify the local IP of your NAS (like `192.168.1.2`) or with a custom name. UGreen allows for a custom fixed name that can be set in `Control Panel > Device connection > LAN > Device Name`. Very handy. 

Finally, my brother in Christ, Nginx redirects the traffic from port HTTPS_PORT, the one of the service, which in my case is 9090. Note, `http://127.0.0.1` practically means `localhost`.

Now we need to make these changes relevant for nginx, by creating:
```
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/server.d/example.com.conf
```

> **Hate moment for UGreen number 2**: due to the UGreen personalization, the symbolic link is not created in the usual, standard, place `/etc/nginx/sites-enabled` but in this cursed place. On top of this, we need the `.conf` extension for the customized UGreen nginx to see our file (*grrr UGreen*).

After this, we check if the syntax is correct with:
```
sudo nginx -t
```

Be aware, to have your domain redirected to the DDNS, it might take up to some hours, if not 2 days. Because this info needs to propagate throughout servers across the globe. If you think about it, it is pretty impressive.

### Having a secure HTTPS connection: `certbot`

Up to now we just setup the HTTP connection, hence a non-encrypted one. When needed, we need to request a certificate from another service to assess that our connection is encrypted and, hence, secure. This service is Let's Encrypt, and the software that allows us to do that is `certbot`.

[Digital Ocean blog post](https://www.digitalocean.com/community/tutorials/how-to-configure-nginx-as-a-reverse-proxy-on-ubuntu-22-04#step-1-installing-nginx) describe how to install it and use it. However, this is the moment for a...

> **Hate moment for UGreen number 2**: for whenever reason, UGreen OS block the automatic and very handy method of certbot `sudo certbot --nginx -d your_domain.com` which creates the certificate, modifies automatically the nginx file and renew the certificate new the expiration date. HOWEVER, this is blocked (`timeout`) by some sort of protection in UGreen OS. I could not find a way to deactivate it. If someone come across this and has a solution, I would be very happy to hear from you.

Hence, I needed to perform this operation manually. In the previous section you already saw the section describing to nginx where to find certificates. The location to be created if it is not present is:
```
sudo mkdir -p /var/www/letsencrypt
```

After this, you need to request the certificate using the `webroot` method:
```
sudo certbot certonly --manual --preferred-challenges dns -d example.com
``` 
This method might ask you to upload a `TXT` token. This can be done via GoDaddy, following what is displayed by certbot by adding a `TXT` field with a host named `_acme-challenge.rss` or something similar, with the unique token given by certbot.

**Warning**: After adding the TXT, you need to wait 1 hour to be sure that certbot can find this TXT. certbot guides you into this.

### Final step

After all of this, you can finally apply changes with:
```
sudo systemctl restart nginx
```

After this, the website `example.com` should redirect, securely with HTTPS, to your service.
If this is not the case, go back and check all passages. You need to debug a bit unfortunalty.


------

Disclaimer: I made use of Google Gemini to help me out in the NAS debugging. Particularly, it was useful to search through forums to find the right solution. However, the contribution of these people was the real answer, and this is why I thank all UGreen forum users.

This post was not written using LLMs; reviewed with [LanguageTool](https://languagetool.org/) for grammar mistakes.