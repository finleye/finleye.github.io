---
layout: post
title:  "Head in the Sandbox"
date: 2016-01-15 09:00:00 -0500
categories: instagram sandbox
---

I spent way to much time banging my head against my keyboard when I was getting empty responses from Instagram's API, and hopefully I can help some of you avoid doing the same. I'll quickly outline some of Instagram's sandbox API limitations and what to expect.

#### But this call works?

In my [previous post][previous-post] I talked about setting up Instagram API integration in a [Sinatra][insatra] app. And I quickly hit a wall. I was able to get the `#user_recent_media` call working no issue. I signed in as myself and was able to see my recent posts. So I moved on to my main goal, which was searching the API by location. I added some coordinates for Manhattan and got _nothing_... 

{% highlight ruby %}
insta_client = Instagram.client(access_token: some_token)
{% endhighlight %}

Looks good!

{% highlight ruby %}
insta_client.user_recent_media
{% endhighlight %}

Great! Plenty of pictures!


{% highlight ruby %}
insta_client.media_search('40.7127', '74.0059', distance: 5000).media
=> []
{% endhighlight %}

Nothing...

I looked at the call. I was getting a 200. No problems with the authentication. No network issues.

I spent some time searching the web and found the smoking gun. It was *[sandbox mode][instagram-sandbox]*!

As it turns out, in November of 2015, Instagram changed their API so that all new apps start in sandbox mode when using the API, until they are approved. This limits your interactions with the API in a few ways, but the problem here was that I wanted public data (scope key `public_data`), but in sandbox mode "public" means public data from your applications users. So, you only get public data from users who have been invited to test your app, and authorized the app for `public_data`.

After searching for coordinates for an area I had tagged, I was able to get images.

Then after looking at the docs for sandbox mode, I found this;

> The response returned by this endpoint will contain only media with the given tag, as expected. But instead of returning media from any public Instagram user, it will return only media that belongs to your sandbox users, restricted to the last 20 for each user.

In the end, [RTFM][rtfm].

Up next, adding a couple rails conveniences to Sinatra. Until then, feel free to contact me on [twitter] or [email] me. See you soon!

[previous-post]: {% post_url 2016-01-14-instagram-integration %}
[sinatra]: http://www.sinatrarb.com/
[instagram-sandbox]: https://www.instagram.com/developer/sandbox/
[twitter]: https://twitter.com/cfinley
[email]: mailto:finley.corey@gmail.com
[rtfm]: https://en.wikipedia.org/wiki/RTFM
