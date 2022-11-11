<script lang="ts">
import { dapps } from "../../../loader";
import Label from "../../../shared/atoms/Label.svelte";
</script>

<div>
  <div class="p-1 xs:p-3 pr-4 xs:pr-12 -mt-6 xs:-mt-2 whitespace-nowrap">
    <Label key="dapps.o-homepage.components.survey.title.top" />
    <img src="/logos/circles.svg" class="w-6 h-6 xs:w-32 xs:h-32" alt="Circles Land" />
    <Label key="dapps.o-homepage.components.survey.title.bottom" />
  </div>
  <div><Label key="dapps.o-homepage.components.survey.subtitle" /></div>
  <div><Label key="dapps.o-homepage.components.survey.circleIs" /></div>
  <div><Label key="dapps.o-homepage.components.survey.eachCircle" /></div>
</div>
