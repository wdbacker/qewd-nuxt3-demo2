<template>
  <div>
    {{ $hello('world') }}

    <button @click="sendTestMessage">Click Me!</button>
  </div>
</template>

<script setup lang="ts">
  import io from 'socket.io-client'

  // alternatively, you can also use it here
  const { $hello, $qewd } = useNuxtApp()
  const nuxtApp = useNuxtApp()
  const headers = useRequestHeaders(['cookie'])
  const qewdToken = useCookie('qewd-token')

  $qewd.on('ewd-registered', function() {
    $qewd.setCookie('qewd-token')
    // Your QEWD environment is ready, emit the ready event
    $qewd.emit('ready', {ready: true})
  })
  $qewd.on('ewd-reregistered', function() {
    $qewd.setCookie('qewd-token')
    // Your QEWD environment is ready, emit the ready event
    $qewd.emit('ready', {ready: true})
  })
  $qewd.on('socketDisconnected', function() {
    //if (process.client) document.cookie = "qewd-token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    // Your QEWD environment isn't ready, emit the ready event
    $qewd.emit('ready', {ready: false})
    debugger
  })
  // add request method wrapper preserving the Vue component this context
  function _request(messageObj) {
    return new Promise(function(resolve) {
      $qewd.send(messageObj, function(responseObj) {
        resolve(responseObj);
      })
    })
  }
  $qewd.request = _request.bind(nuxtApp)

  console.log(new Date().toISOString(), process.server, process.client);
  
  //if (process.server) debugger

  $qewd.start({
    application: 'vue-qewd-test',
    cookieName: 'qewd-token',
    getCookieFn: function() {
      if (process.server) {
        return headers.cookie
      }
      if (process.client) {
        return document.cookie
      }
    },
    setCookieFn: function(name, value) {
      if (process.server) {
        debugger
        qewdToken.value = value
      }
      if (process.client) {
        document.cookie = name + "=" + value
      }
    },
    io,
    url: 'http://localhost:8091'
  })

  function sendTestMessage() {
    $qewd.request({
      type: 'test',
      params: {
        text: "Thomas"
      }
    }).then((responseObj) => {
      console.log(responseObj)
    })
  }

</script>