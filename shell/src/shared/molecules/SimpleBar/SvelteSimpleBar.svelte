<script>
import { onMount } from "svelte";
import SimpleBarJS from "simplebar";
const mountHandle = () => {
  if (scrollElem) {
    init && init(new SimpleBarJS(scrollElem, options));
  } else {
    setTimeout(mountHandle, 100);
  }
};
onMount(mountHandle);
export let options = {},
  init;
let scrollElem;
</script>

<div bind:this="{scrollElem}" style="height: 100%; width: 100%;">
  <div class="simplebar-wrapper">
    <div class="simplebar-height-auto-observer-wrapper">
      <div class="simplebar-height-auto-observer"></div>
    </div>
    <div class="simplebar-mask">
      <div class="simplebar-offset">
        <div class="simplebar-content-wrapper">
          <div class="simplebar-content">
            <slot />
          </div>
        </div>
      </div>
    </div>
    <div class="simplebar-placeholder"></div>
  </div>
  <div class="simplebar-track simplebar-horizontal">
    <div class="simplebar-scrollbar"></div>
  </div>
  <div class="simplebar-track simplebar-vertical">
    <div class="simplebar-scrollbar"></div>
  </div>
</div>

<style>
:global([data-simplebar]) {
  position: relative;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: flex-start;
}

.simplebar-wrapper {
  overflow: hidden;
  width: inherit;
  height: inherit;
  max-width: inherit;
  max-height: inherit;
}

.simplebar-mask {
  direction: inherit;
  position: absolute;
  overflow: hidden;
  padding: 0;
  margin: 0;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: auto !important;
  height: auto !important;
  z-index: 0;
}

.simplebar-offset {
  direction: inherit !important;
  box-sizing: inherit !important;
  resize: none !important;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 0;
  margin: 0;
  -webkit-overflow-scrolling: touch;
  width: 100%;
}

.simplebar-content-wrapper {
  direction: inherit;
  box-sizing: border-box !important;
  position: relative;
  display: block;
  height: 100%; /* Required for horizontal native scrollbar to not appear if parent is taller than natural height */
  width: auto;
  visibility: visible;
  max-width: 100%; /* Not required for horizontal scroll to trigger */
  max-height: 100%; /* Needed for vertical scroll to trigger */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

:global(.simplebar-content-wrapper::-webkit-scrollbar, .simplebar-hide-scrollbar::-webkit-scrollbar) {
  width: 0;
  height: 0;
}

.simplebar-content:before,
.simplebar-content:after {
  content: " ";
  display: table;
}

.simplebar-placeholder {
  max-height: 100%;
  max-width: 100%;
  width: 100%;
  pointer-events: none;
}

.simplebar-height-auto-observer-wrapper {
  box-sizing: inherit !important;
  height: 100%;
  width: 100%;
  max-width: 1px;
  position: relative;
  float: left;
  max-height: 1px;
  overflow: hidden;
  z-index: -1;
  padding: 0;
  margin: 0;
  pointer-events: none;
  flex-grow: inherit;
  flex-shrink: 0;
  flex-basis: 0;
}

.simplebar-height-auto-observer {
  box-sizing: inherit;
  display: block;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  height: 1000%;
  width: 1000%;
  min-height: 1px;
  min-width: 1px;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}

.simplebar-track {
  z-index: 1;
  position: absolute;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

:global([data-simplebar].simplebar-dragging .simplebar-content) {
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
}

:global([data-simplebar].simplebar-dragging .simplebar-track) {
  pointer-events: all;
}

.simplebar-scrollbar {
  position: absolute;
  left: 0;
  right: 0;
  min-height: 10px;
}

.simplebar-scrollbar:before {
  position: absolute;
  content: "";
  background: black;
  border-radius: 7px;
  left: 2px;
  right: 2px;
  opacity: 0;
  transition: opacity 0.2s linear;
}

:global(.simplebar-track .simplebar-scrollbar.simplebar-visible:before) {
  opacity: 0.5;
  transition: opacity 0s linear;
}

.simplebar-track.simplebar-vertical {
  top: 0;
  width: 11px;
}

.simplebar-track.simplebar-vertical .simplebar-scrollbar:before {
  top: 2px;
  bottom: 2px;
}

.simplebar-track.simplebar-horizontal {
  left: 0;
  height: 11px;
}

.simplebar-track.simplebar-horizontal .simplebar-scrollbar:before {
  height: 100%;
  left: 2px;
  right: 2px;
}

.simplebar-track.simplebar-horizontal .simplebar-scrollbar {
  right: auto;
  left: 0;
  top: 2px;
  height: 7px;
  min-height: 0;
  min-width: 10px;
  width: auto;
}

/* Rtl support */
:global([data-simplebar-direction="rtl"] .simplebar-track.simplebar-vertical) {
  right: auto;
  left: 0;
}

:global(.hs-dummy-scrollbar-size) {
  direction: rtl;
  position: fixed;
  opacity: 0;
  visibility: hidden;
  height: 500px;
  width: 500px;
  overflow-y: hidden;
  overflow-x: scroll;
}

:global(.simplebar-hide-scrollbar) {
  position: fixed;
  left: 0;
  visibility: hidden;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
