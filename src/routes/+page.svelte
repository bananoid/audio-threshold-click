<script lang="ts">

  let url = "https://www.youtube.com/watch?v=dBwyVtFCNfc&ab_channel=Dave2D"

  let counter = 1

</script>

<div class="flex grow flex-col">

  <div class="flex p-4 bg-accent/20">
    <input type="text" class="w-full input" value="{url}">
  </div>

  <div class="justify-center items-center grow flex p-4 flex-col gap-4">
    <!-- <iframe title="" src="{url}" frameborder="0" class="w-full h-full"></iframe> -->
    <div>{counter}</div>
    <button class="btn btn-primary" on:click={ ()=> counter ++ }>click</button>
  </div>



</div>