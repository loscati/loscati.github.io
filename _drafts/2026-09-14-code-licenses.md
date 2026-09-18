---
layout: post
title: What I've undertood on open licenses
date: 2026-09-18 01:59:00
description: and why the ligal stuff is difficult
tags: licenses foss
---

> The necessary disclaimer: I am not a lawyer, this article does not seek completness, containes personal opinions. If you spot an error, please open an issue.

I had to spend a few hours and some chats about open licenses (open = the source code of the program is accessible and readable by everyone), hence all those notices that one can put on a piece of software to regulate its usage. Contrary to closed licenses, these regulate how the software or the library (or the shared objects or a lot of other parts of the software one can develop) has to be distributed. In general, what are the rights and the obligations of the user.

For open license, two key aspects are important:

> What can the user do with your softare/library/etc?

Hence, the concept of **permissivity**. Moreover,

> What obligations do I have when using/modifying/etc your piece of software?

or, alternatively, copyleft requirements and such.

An open license is usually permissive, in the sense that the user (a company, an Univesity, a single user) has the right to use, incorporate, modify and etc. your code.

## Permissive licenses

These types are preferred if you work for a SME or you what your code to be used in closed projects too. This makes sense in the coorporate context where ;let other companies use your software is strategic.

### MIT

### Apache 2.0

## Copyleft licenses

Even if permissive licenses are a good starting point, they have a clear drawback: your code can be closed sourced. If you value that your code must remain open and you don't want others to change your will, you need a copyleft license.

### GNU GPL and variants

- AGPL
- ordinary GPL
- LGPL 

### EUPL

Pros:

- Good in the EU context: 

## My suggestions

- Read your licenses. Can you understand all rights and obligations?
- What is the scope of your project? Is it personal or for work?
- Check what similar software do
- If you are in a company, seek legal advise from the suitable office

Licensing software is important and can have impactful consequences.

## References

- [Open source initiative](https://opensource.org/). An independent organization that tries to standardize the process of review of open licenses. I think that a trustable open license is usually reported in this website
- [Choose a License](https://choosealicense.com/licenses/). Mantained by GitHub, it is a nice recap of the most used open licenses. Indeed, their list almost overlap with the one of the OSI for the "popular" licenses. Popularity should not be a base metrics to judge a license, however it helps if other trials have been resolved in your country's jurisdictionn with these licenses involved
