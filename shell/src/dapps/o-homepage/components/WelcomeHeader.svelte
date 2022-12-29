<script>
    import Label from "../../../shared/atoms/Label.svelte";
</script>

<div
  class="relative flex items-center content-center justify-center h-screen overflow-hidden"
  style=" background-position: center; background:
  url('/images/homepage/circles-home.jpg') no-repeat center center fixed;
  -webkit-background-size: cover; -moz-background-size: cover;
  -o-background-size: cover; background-size: cover; ">
  <div
    class="absolute z-30 flex flex-col items-stretch content-center w-full h-full min-h-full pb-40 text-center">
    <h1 class="px-5 text-4xl text-white font-heading md:text-6xl mt-11">
      <Label key="dapps.o-homepage.components.welcomeHeader.title"  />
    </h1>
    <h2 class="flex-grow px-5 pt-4 text-xl font-thin text-white sm:text-3xl ">
      <Label key="dapps.o-homepage.components.welcomeHeader.subtitle"  />
    </h2>
  </div>
</div>