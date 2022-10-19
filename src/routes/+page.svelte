<script lang="ts">

  let counter = 0
  let toggleOn = false

  function toggle(){
    counter ++
    toggleOn = !toggleOn
  }
</script>

<div class="flex grow flex-col">

  <div class="justify-center items-center grow flex p-4 flex-col gap-4">
    <!-- <iframe title="" src="{url}" frameborder="0" class="w-full h-full"></iframe> -->
    <div>{counter}</div>
    <button class:btn-accent={toggleOn} class="btn btn-primary" on:click={ ()=> toggle() }>click</button>
  </div>

</div>