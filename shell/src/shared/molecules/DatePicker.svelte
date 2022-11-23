<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte";
    import 'tw-elements';
    // export let items: any;
    // export let key: string;
    // export let value: string;
    // export let selected: any;
    
    const dispatch = createEventDispatcher();
    
    function handleOnChange(e) {
        dispatch('message', {key: e.target.value});
    }
    
    onMount(
        ()=> {

        }
    )
    </script>
    
    
    <!-- <div class="flex items-center justify-center">
        <div class="datepicker relative form-floating mb-3 xl:w-96" data-mdb-toggle-button="false">
          <input type="date"
            class="form-control text-black block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            placeholder="Select a date" data-mdb-toggle="datepicker" />
        </div>
      </div> -->

      <div class="flex items-center justify-center">
        <div class="datepicker relative form-floating mb-3 xl:w-96">
          <input type="text"
            class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            placeholder="Select a date" />
          <label for="floatingInput" class="text-gray-700">Select a date</label>
        </div>
      </div>