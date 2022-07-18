# Making html reactive with basic dom manipulation

## Getting Started
Import script
```js
<script src="./reactive.js"></script>
```

Initialize Reactive Instance
```js
<div id="app">
  <div r-text="msg"></div>
  <button @click="trigger">Say hello !</button>
</div>
<script>
  const instance = new Reactive({
      el: '#app',
      data: {
          msg: 'Hello'
      },
      functions: {
        trigger: () => {
          instance.emit('say-hello')
        }
      }
  })
  
  // event listener
  instance.on('say-hello', () => {
    console.log('said hello')
  })
</script>
```

##  Directives
- `r-text`

## Events
- `@click`
- `@mouseover`
