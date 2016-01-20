---
layout: post
title:  "HAML and Partials"
date: 2016-01-19 09:00:00 -0500
categories: sinatra
---

When I started working on this Sinatra app, I told myself I wouldn't turn it into Rails. That lasted all of about 20 minutes. I immediately realized I was missing a could things that I couldn't do without.

#### HAML

Adding HAML support to a Sinatra app is pretty straight forward. First add the [haml gem][haml-gem] to your `Gemfile`.

{% highlight ruby %}
# ./Gemfile
gem "haml"
{% endhighlight %}

Then require it in your `config.ru`.

{% highlight ruby %}
# ./config.ru
require 'haml'
{% endhighlight %}

No you can call the your `.haml` views in the application, instead of using the `html` tag.

{% highlight ruby %}
get '/' do
  haml :welcome
end
{% endhighlight %}

Pretty easy!

#### Partials

What's likely more interesting and useful is setting up partials the way rails natively supports. Repetition in views is just as painful as anywhere else in your code, so why wouldn't you want partials?

First you'll of course need the [sinatra-partial gem][sinatra-partial-gem].

{% highlight ruby %}
# ./Gemfile
gem "sinatra-partial"
{% endhighlight %}

And require it.

{% highlight ruby %}
# ./config.ru
require 'sinatra/partial'
{% endhighlight %}

Then you have to register and enable it within your app.

{% highlight ruby %}
# ./still_leaf.rb
class StillLeaf < Sinatra::Base
  register Sinatra::Partial
  enable :partial_underscores
  # ...
end
{% endhighlight %}

Now within views your able to load partials similar to the way you do in rails.

I've set up a partial to drop media items into a view

{% highlight haml %}
-# ./views/_media.haml
-media.each_slice(3) do |media_group|
  .row
    -media_group.each do |media_item|
      .large-4.columns
        %img{:src => "#{media_item.images.standard_resolution.url}"}
          %br/
          %a{:href => "/media_like/#{media_item.id}"} like
          %a{:href => "/media_unlike/#{media_item.id}"} un-like
          = succeed "#{media_item.likes[:count]} likes" do
            %br/
{% endhighlight %}

And use it in a few different views, here's an example;

{% highlight haml %}
-# ./views/user_media.haml
.row
  %h2="#{@user.username}'s recent media"
  =partial :media, locals: { media: @recent_media }
{% endhighlight %}

#### Short and Sweet

This post is shorter than most, but hopefully straight foward enough that it's useful! As always, feel free to contact me on [twitter] or [email] me. See you soon! See you soon!

[haml-gem]: https://github.com/haml/haml
[sinatra-partial-gem]: https://github.com/yb66/Sinatra-Partial
[twitter]: https://twitter.com/cfinley
[email]: mailto:finley.corey@gmail.com
