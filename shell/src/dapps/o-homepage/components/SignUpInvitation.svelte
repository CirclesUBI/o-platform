<script lang="ts">
    import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
    import { Routable } from "@o-platform/o-interfaces/dist/routable";
    import VideoHeader from "../components/VideoHeader.svelte";
    import LoginPill from "../../../shared/molecules/NextNav/Components/LoginPill.svelte";
import { NavigationManifest } from "@o-platform/o-interfaces/src/navigationManifest";
import Label from "../../../shared/atoms/Label.svelte";

    export let navigation: NavigationManifest;

   function login() {

    }

    </script>
    
    <div class="flex flex-col overflow-hidden ">
      <main class="h-screen overflow-hidden">
    
        <div
          id="video-overlay"
          class="relative flex items-center content-center justify-center h-screen overflow-hidden"
          style=" background-position: center; background:
      url('/images/homepage/circles-home.jpg') no-repeat top right fixed;
      -webkit-background-size: cover; -moz-background-size: cover;
      -o-background-size: cover; background-size: cover; ">
        </div>
      </main>
      <div class="login-button">
        <div class="h-12 col-start-2 py-3 bg-white rounded-full w-36 place-self-center">
            <div class="grid grid-cols-2 cursor-pointer justify-items-start " role="presentation" on:click="{login}">
              <div class="h-12 -ml-4">
    
              </div>
          
              <div class="-ml-6 text-xl justify-self-start font-heading">
                <Label key="shared.molecules.nextNav.components.loginPill.signInNow" />
              </div>
            </div>
          </div>
        </div>
    </div>


    <style>
    :global(.login-button) {
    position: fixed;
    left: 50%;
    top: 95%;
    transform: translate(-50%, 0);
      }
    </style>

