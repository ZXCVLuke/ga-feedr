# Feedr Project Notes

### 3 technical hurdles

1. Controlling when functions can run relative to ajax status.
2. Identifying and getting data back from the articles arrays to display on the popUp. See findByProperty().
3. Figuring out the sort method to sort articles by a search query.   

### 2 new things you learned

#### 1. What the hell Unix time is

A Unix timestamp is the number of seconds since 1970-01-01 00:00:00 UTC. It is a large number which is either in seconds or milliseconds. Using JS it can be converted to UTC, ISO and more human-friendly formats using toDateString(), toISOString() and toUTCString() methods. It must be converted to a date first though using var d = new Date ();

#### 2. How the sort function works

Put simply it looks like this;
```javascript
  sort(function(a, b) {
    return a - b;
  });
```
But you can make it a hell of a lot more complex by wrapping modifiers around a and b.
On top of that I used; 
```javascript
.each(function(){
  $("element").prepend(this);
})
```
to then iterate through all of the articles.
