---
layout: post
title: "What to call it"
date: 2016-01-12 09:21:19 -0500
categories: sinatra heroku instagram
---

A while back, a co-worker of mine, [Brian][brian], told me about an idea for an app that would use the [Instagram API][instagram-api]. I wanted to help and decided to write a small [Sinatra][sinatra] app to play with the API. A lot of frustration and learning later I figured out a few things;

1. Much of my Ruby knowledge turned out to be Rails knowledge. Small stuff, for example `#present?` is part of Rails, not Ruby.
2. It's tricky to build a Sinatra app and stick to its framework. I had to read up on Sinatra conventions in an attempt to not build of all the Rails *conveniences* (read crutches) that I counted on.
3. [Instagram's Sandbox][instagram-sandbox] mode for their API will make you pull your hair out if you don't understand it.

#### It needs a (better) name
But first, I had to figure out what to call it. I know you shouldn't name things first, but I had to at least figure out what to call the repo. I started with **Instalocation**. Terrible, I know, but it was a location search of the API, so it seemed practical. I decided the best bet was to try a random app name generator. I landed on **Still Leaf** and went with it.

My next post will be about some of the gems I used, and some things I learned about [Sinatra][sinatra].

See you soon!

[instagram-api]: https://www.instagram.com/developer/
[instagram-sandbox]: https://www.instagram.com/developer/sandbox/
[sinatra]: http://www.sinatrarb.com/
[brian]: https://github.com/briancantrell
