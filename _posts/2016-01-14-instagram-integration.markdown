---
layout: post
title:  "Instagram Integration"
date: 2016-01-14 09:00:00 -0500
categories: sinatra instagram
---

Adding Instagram API integration to your application is pretty straight forward, but some parts can be tricky. I'll walk through what I did, and hopefully make it an easy task if you decide to try it.

#### Adding the Instagram API gem
I'm using the [Instagram API gem][instagram-api-gem] for [this project][still-leaf]. To add this gem to your [Sinatra][sinatra] app, you'll just need to do the following;

Add the gem to your app's `Gemfile`
{% highlight ruby %}
gem "instagram"
{% endhighlight %}
And run `bundle` from the command line to install the gem.

I added an initializer to set up them gem:

{% highlight ruby %}
#/config/initializers/instagram.rb
Instagram.configure do |config|
  config.client_id = ENV["INSTAGRAM_CLIENT_ID"]
  config.client_secret = ENV["INSTAGRAM_CLIENT_SECRET"]
end
{% endhighlight %}

Then add this to your application's `config.ru`
{% highlight ruby %}
require 'instagram'
{% endhighlight %}

Now that the Instagram gem is set up, we'll use it in the application file.

#### OAUTH Endpoints
Your application will need to know how to handle the handshake with Instagram's API. You'll need a few endpoints to handle this.

The first endpoint will send the request for the authentication token.

{% highlight ruby %}
get '/oauth/connect' do
  scope =  'likes public_content'
  redirect Instagram.authorize_url(redirect_uri: ENV['INSTAGRAM_CALLBACK_URL'], scope: scope)
end
{% endhighlight %}

The `scope` part of this block tells their API what all you want access to. In this case I want the ability to like photos, and access to public content. Note that you'll be providing a redirect URL as well. This tells Instagram where you send back the `access_token`.

In the callback endpoint, you'll need to save the `access_token`, and then send them on their way with something to show.

{% highlight ruby %}
get '/oauth/callback' do
  response = Instagram.get_access_token(params[:code], redirect_uri: ENV['INSTAGRAM_CALLBACK_URL'])
  if response.access_token
    session[:ig_access_token] = response.access_token
    flash[:success] = "You've logged in as @#{insta_client.user.username}."
  else
    flash[:alert] = "Something went wrong."
  end

  redirect '/user_recent_media'
end
{% endhighlight %}

One thing to note here is that `ig_access_token` is being added to the `session`. This is a given in Rails, but here you'll need to enable sessions for Sinatra. Below you'll class declaration, add `enable :sessions`. Mine looks like this:

{% highlight ruby %}
class StillLeaf < Sinatra::Base
  enable :sessions
{% endhighlight %}

#### Show the user something from Instagram
You may have noticed in my OAUTH callback endpoint, that I redirect to `/user_recent_media`. This action renders a view of the current users recent media from Instagram. That code looks like this:


{% highlight ruby %}
get '/user_recent_media' do
  @user = insta_client.user
  @recent_media = insta_client.user_recent_media

  haml :user_media
end
{% endhighlight %}

You'll see references to a method called `insta_client`, references a memoization of the client so it can be reused. The `insta_client` method looks like this:

{% highlight ruby %}
def insta_client
  @insta_client = Instagram.client(access_token: session[:ig_access_token])
end
{% endhighlight %}

If you want to see how `@user` and `@recent_meda` are being used, take a look at [the view in the repo][user-recent-media-view], and the full application class can be found [here in the repo][application-class] as well.

That covers everything to get the `access_token` from Instagram, and use the client to get media. My next post will be about Instagram's API sandbox mode and it's limitations. Until then, feel free to contact me on [twitter] or [email] me. See you soon!


[instagram-api-gem]: https://github.com/Instagram/instagram-ruby-gem
[sinatra]: http://www.sinatrarb.com/
[user-recent-media-view]: https://github.com/finleye/still-leaf/blob/master/views/user_media.haml
[application-class]: https://github.com/finleye/still-leaf/blob/master/still_leaf.rb
[still-leaf]: https://github.com/finleye/still-leaf
[twitter]: https://twitter.com/cfinley
[email]: mailto:finley.corey@gmail.com
