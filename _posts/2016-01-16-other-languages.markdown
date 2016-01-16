---
layout: post
title:  "There's Always More to Learn"
date:   2016-01-16 09:00:00 -0500
categories: elixir scheme
---

I've been trying to broaden my skill set lately. I'm reading books that I should have long before now ([Practical Object-Oriented Design in Ruby][book-1], and [The Pragmatic Programmer][book-2]), and I'm trying out a few languages. I wanted to play with functional programming because I have very little exposure to it, so on the suggestion of a co-worker, I started reading through [The Little Schemer][book-3]. It made me think about problems in a new way, and I think it improved my daily work.

#### A little Scheme'n

In a technical interview I was asked to write out, on a white board, how to implement [Ruby's `flatten` method][ruby-flatten]. Flatten takes an Array and reduces it to a single dimension. I think this is a great exercise when trying out new languages, because you get to interact with objects, dissect them, and reconstruct them.

[The Little Schemer][book-3] impresses that when working with functional languages you need to set out rules about how the iterations should work. Here's the list for my algorithm:

1. Return when: all elements are `atom`s.
2. Handle nulls: if the tail is null, then the only element is the head, flatten it!
3. Else: merge the flattened head, and the flattened tail.

First, let's write a small test so that we know when it works.

{% highlight scheme %}
; sample lists
(define l '((a) b) )
(define m '(((a)) (b)) )
(define n '((a b) (c (d e))))

; test flatten against all sample lists
(define spec
    (and
        (all_atoms? (flatten l))
        (all_atoms? (flatten m))
        (all_atoms? (flatten n))
    )
)
{% endhighlight %}

Run it:

{% highlight scheme %}
Error: execute: unbound symbol: "flatten" []
{% endhighlight %}

Nice, let's get started. Is the list `all_atoms?`

{% highlight scheme %}
(define atom?
    (lambda (x)
        (and (not (pair? x)) (not (null? x)))))

(define all_atoms?
    (lambda (li)
        (if (null? (cdr li))
            (atom? (car li))
            (and (atom? (car li)) (all_atoms? (cdr li))))))
{% endhighlight %}

Eight lines, and forty two parenthesis later, we have a method that checks each element to see if it's an `atom` only returning false if it's not. We also have to merge the lists, so let's write the `merge` method.

{% highlight scheme %}
(define (merge l1 l2)
    (if (null? l1) l2
        (if (null? l2) l1
            (cons (car l1) (merge (cdr l1) l2)))))
{% endhighlight %}

Also recursive, this method takes each element and adds it to the larger list.

Finally flatten them!

{% highlight scheme %}
(define flatten
    (lambda (x)
        (if (all_atoms? x) x
            (if (null? (cdr x)) (flatten (car x))
                (merge (flatten (list (car x))) (flatten (cdr x)))))))
{% endhighlight %}

Here we first check that the list is not all atoms, if it is, return it. If it has a list inside, continue. If the tail is null, then it's just the head and it's not an `atom` so flatten it. And finally if there is a head and a tail, merge the flattened version of the two.

Let's run it and see if it works.

{% highlight scheme %}
:> spec
=> #t
{% endhighlight %}

Boom! My obviously perfect test show how incredible my code is! Of course I'm kidding, but this looks like it is in fact working. You can take my word for it, or check out this [repl.it][repl] link to give it a shot. Now that it's working, I want to try another language.

#### Elixir

Some people in my office have been talking about [Elixir][elixir], and I wanted to try it out, so I thought this was another perfect time to try to write flatten. I downloaded the language, and kicked up a new project with `mix`.

{% highlight bash %}
mix new flatten
{% endhighlight %}

Let's write some tests

{% highlight elixir %}
# test/flatten_test.exs
defmodule FlattenTest do
  use ExUnit.Case
  doctest Flatten

  test "empty list" do
    assert Flatten.flatten([]) == []
  end

  test "list of atoms" do
    assert Flatten.flatten([:a, :b, :c]) == [:a, :b, :c]
  end

  test "list of mixed data types" do
    assert Flatten.flatten([:a, 1, :c]) == [:a, 1, :c]
  end

  test "flattens a list of an empty list" do
    assert Flatten.flatten([[]]) == []
  end

  test "flattens a list within a list" do
    assert Flatten.flatten([1, 2, [3]]) == [1, 2, 3]
  end

  test "flattens a list within a list, when the head is a list" do
    assert Flatten.flatten([[1], 2, 3]) == [1, 2, 3]
  end

  test "flattens a list within a list, when the head is a list in a list" do
    assert Flatten.flatten([[[1]], 2, 3]) == [1, 2, 3]
  end

  test "flattens a list within a list, when the tail is a multipart list" do
    assert Flatten.flatten([1, [2, 3]]) == [1, 2, 3]
  end
end
{% endhighlight %}

Run it

{% highlight bash %}
$ mix test
8 tests, 8 failures
{% endhighlight %}

Cool! Got some tests. Let's get started.

First, we need a handler method, we'll just call it `flatten`, the first handler will just handle the empty array case.

{% highlight elixir %}
def flatten(input), do: _flatten(input)
defp _flatten([]), do: []
{% endhighlight %}

Now if we run the test again, we should at least get the first one to pass.

{% highlight bash %}
$ mix test
8 tests, 7 failures
{% endhighlight %}

Nice. One down and only seven to go. Now there are two cases for the iteration. The head is a list, in which case we should concatenate the flattened head with the flattened tail.

{% highlight elixir %}
defp _flatten([head|tail]) when is_list(head) do
  _flatten(head) ++ _flatten(tail)
end
{% endhighlight %}

That gets us down to just six failures, so let's handle the other case. If the head is not a list, we should concatenate the head in a list, with the flattened version of the tail. That looks like this;

{% highlight elixir %}
defp _flatten([head|tail]), do: [head] ++ _flatten(tail)
{% endhighlight %}

You can see the [full Flatten module here][flatten-module]. Let's try it!

{% highlight bash %}
$ mix test
8 tests, 0 failures
{% endhighlight %}

Nice! All green! As you can see I've barely scratched the surface of what this language is capable of, but at least I've figured out some of the syntax and how the language works. If you want to see the full `mix` project, it's [here in a repo][elixir-flatten-repo].

#### Onward and upward

I really liked working with these other languages, and plan to spend more time with them. I don't often use recursion as a strategy for solving problems in my daily work, it rarely calls for it. But these exercises make me think about programming challenges in a different way, and that's always a good thing.

I'm still working on my next post about my Sinatra project. But I'll have it posted shortly. As always, feel free to contact me on [twitter] or [email] me. See you soon! See you soon!

[book-1]: http://www.amazon.com/Practical-Object-Oriented-Design-Ruby-Addison-Wesley/dp/0321721330
[book-2]: http://www.amazon.com/The-Pragmatic-Programmer-Journeyman-Master/dp/020161622X
[book-3]: http://www.amazon.com/The-Little-Schemer-4th-Edition/dp/0262560992
[ruby-flatten]: http://apidock.com/ruby/Array/flatten
[repl]: https://repl.it/BQKT/12
[elixir]: http://elixir-lang.org/
[elixir-flatten-repo]: https://github.com/finleye/flatten
[flatten-module]: https://github.com/finleye/flatten/blob/master/lib/flatten.ex
[twitter]: https://twitter.com/cfinley
[email]: mailto:finley.corey@gmail.com
