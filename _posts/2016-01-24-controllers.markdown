---
layout: post
title:  "Implementing Sinatra Controllers"
date: 2016-01-24 09:00:00 -0500
categories: sinatra
---

Working on [this app][still-leaf], I realized that the single application file was getting to be a bit much. So I wanted to separate concerns, in part because I _really_ hated this authentication logic at the top of app.

{% highlight ruby %}
before do
  if request.path_info == '/' ||
      !session[:ig_access_token].nil? ||
      request.path_info =~ /\/oauth\//
    pass
  else
    redirect '/'
  end
end
{% endhighlight %}

I know that smells, but it was the best solution at the time. I didn't want to check the request path to know if the user needs to be authenticated, I wanted hooks. I wanted controllers with isolated responsibility. So with some help from [this article][mvc-article] I made it happen. Here's what I did.

#### We need a base controller

The `ApplicationController` like in Rails, will be the base for all our other controllers. One important thing to note here, is the view path line. Since this controller lives within a directory, you need to tell it where the views are in relation.

{% highlight ruby %}
# ./controllers/application_controller.rb
class ApplicationController < Sinatra::Base
  helpers ApplicationHelpers

  # ...
  set :views, File.expand_path('../../views', __FILE__)
  # ...
end
{% endhighlight %}

This lets me separate some of the authentication logic. For example I added the `ApplicationHelpers` to check the current user.

{% highlight ruby %}
# ./helpers/application_helpers.rb
module ApplicationHelpers
  def authenticated?
    !session[:ig_access_token].nil?
  end

  def authenticate!
    redirect '/' unless authenticated?
  end
  # ...
end
{% endhighlight %}

That `authenticate!` method will come in handy in the media controller.

{% highlight ruby %}
# ./controllers/media_controller.rb
class MediaController < ApplicationController
  before { authenticate! }
  # ...
end
{% endhighlight %}

That authentication line, `before { authenticate! }`, is so much better than the hairy path checking logic at the top.

#### Make the routes work

There's a crucial piece here to tie all this together. We need to tell the `config.ru` to load the new directories and how to route incoming requests. I'll require the new directories, and in the last lines I map the request to the right controllers. The last couple lines of my `config.ru` look like this.

{% highlight ruby %}
# ./config.ru

%w{config/initializers lib helpers controllers}.each do |load_path|
  Find.find(load_path) { |f|
    require f unless f.match(/\/\..+$/) || File.directory?(f)
  }
end

map('/media') { run MediaController }
map('/oauth') { run OauthController }
map('/') {run StaticPagesController }
{% endhighlight %}

That'll have the routes mapped to the new controllers. For a more detailed look, check out [the repo on GitHub][still-leaf]. As always, feel free to contact me on [twitter][twitter] or [email][email] me. See you soon!


[mvc-article]: http://www.sitepoint.com/build-a-sinatra-mvc-framework/
[still-leaf]: https://github.com/finleye/still-leaf
[twitter]: https://twitter.com/cfinley
[email]: mailto:finley.corey@gmail.com
