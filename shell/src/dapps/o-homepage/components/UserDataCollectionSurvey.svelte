<script lang="ts">
    import { onMount } from "svelte";
    import {
      AllBusinessCategoriesDocument,
      AllBusinessCategoriesQueryVariables,
      BusinessCategory,
    } from "../../../shared/api/data/types";
    import { ApiClient } from "../../../shared/apiConnection";
    import Label from "../../../shared/atoms/Label.svelte";
    import { GenderOfUser } from "../../../shared/models/GenderOfUser.model";
    import { TypeOfUser } from "../../../shared/models/TypeOfUser.model";
    import DatePicker from "../../../shared/molecules/DatePicker.svelte";

    import { _ } from "svelte-i18n";
    import { push } from "svelte-spa-router";
import DropDown from "../../../shared/molecules/DropDown.svelte";
import Icons from "../../../shared/molecules/Icons.svelte"
    
    let businessOffersData = [];
    const typeOfUserData = TypeOfUser;
    const genderOfUserData = GenderOfUser;
    let typeOfUser;
    let genderOfUser;
    let businessOffers; 
    let isValid = false;
    
    onMount(async () => {
      businessOffersData = await ApiClient.query<BusinessCategory[], AllBusinessCategoriesQueryVariables>(
        AllBusinessCategoriesDocument,
        {}
      );
    });
  
    
    function handleClick(button) {
      if (button === 'back') {
        push('#/homepage/survey/3')
      }
      else {
        if (isValid) {
          push('#/home')
        }
      }
      }
    
    function handleOnChange(event) {
        if (event.detail.target === 'userType') {
            typeOfUser = event.detail.value;
        }
        if (event.detail.target === 'gender') {
            genderOfUser = event.detail.value;
        }
        if (event.detail.target === 'businessOffers') {
            businessOffers = event.detail.value;
        }
    }

    $: {
isValid = typeOfUser && genderOfUser && businessOffers;
}
    </script>
    
    <div class="bg-cpurple p-1 xs:p-3 pr-4 -mt-6 xs:-mt-2 whitespace-pre-line overflow-hidden text-white flex items-center justify-center flex-col">
      <div class="flex items-center justify-center flex-col">
        <div class="ml-2 text-2xl text-white uppercase xs:text-4xl font-heading">
          <Label key="dapps.o-homepage.components.survey.userDataCollection.title.top" />
        </div>
        <div class="ml-2 text-2xl text-white uppercase xs:text-4xl font-heading">
          <Label key="dapps.o-homepage.components.survey.userDataCollection.title.bottom" />
        </div>
      </div>
      <div class="mt-5 mb-10"><Label key="dapps.o-homepage.components.survey.userDataCollection.subtitle" /></div>
      <div>
        <div class="flex flex-col text-sm mb-5">
          <Label key="dapps.o-homepage.components.survey.userDataCollection.useCircleAs" />
          <div class="flex">
          <DropDown selected='Select your type of user'items="{typeOfUserData}" id="userType" key="id" value="name" on:dropDownChange="{handleOnChange}" />
          {#if typeOfUser}
          <span class="text-6xl font-enso"
          ><Icons icon="check-circle" size="{6}" customClass="inline ml-2" /></span>
          {/if}
          {#if !typeOfUser}
          <span class="text-6xl font-enso"
          ><Icons icon="information-circle" size="{6}" customClass="inline ml-2 text-alert" /></span>
          {/if}
          </div>
        </div>
        <div class="flex flex-col text-sm mb-5">
          <Label key="dapps.o-homepage.components.survey.userDataCollection.gender" />
          <div class="flex">
          <DropDown selected='Select gender' items="{genderOfUserData}" id="gender" key="id" value="name" on:dropDownChange="{handleOnChange}" />
          {#if genderOfUser}
          <span class="text-6xl font-enso"
          ><Icons icon="check-circle" size="{6}" customClass="inline ml-2" /></span>
          {/if}
          {#if !genderOfUser}
          <span class="text-6xl font-enso"
          ><Icons icon="information-circle" size="{6}" customClass="inline ml-2 text-alert" /></span>
          {/if}
          </div>
        </div>
        <div class="flex flex-col text-sm mb-2 items-start">
          <Label key="dapps.o-homepage.components.survey.userDataCollection.bornOn" />
          <div class="flex">
          <DatePicker />
          <!-- {#if typeOfUser}
          <span class="text-6xl font-enso"
          ><Icons icon="check-circle" size="{6}" customClass="inline ml-2" /></span>
          {/if}
          {#if !typeOfUser}
          <span class="text-6xl font-enso"
          ><Icons icon="information-circle" size="{6}" customClass="inline ml-2 text-alert" /></span>
          {/if} -->
          </div>
        </div>
        <div class="flex flex-col text-sm mb-5">
          <Label key="dapps.o-homepage.components.survey.userDataCollection.myBusinessOffers" />
          <div class="flex">
          <DropDown selected='Select what your business offers' items="{businessOffersData}" id="businessOffers" key="id" value="name" on:dropDownChange="{handleOnChange}" />
          {#if businessOffers}
          <span class="text-6xl font-enso"
          ><Icons icon="check-circle" size="{6}" customClass="inline ml-2" /></span>
          {/if}
          {#if !businessOffers}
          <span class="text-6xl font-enso"
          ><Icons icon="information-circle" size="{6}" customClass="inline ml-2 text-alert" /></span>
          {/if}
          </div>
        </div>
      </div>
      {#if !isValid}
      <div class="text-sm text-info"><Label key="dapps.o-homepage.components.survey.userDataCollection.info" /></div>
      {/if}
      <div class="flex flex-row justify-around text-center mt-10 mb-5 w-full">
        <div>
          <button
        class="btn transition-all overflow-hidden transform relative bg-cpurple px-8 border-warning text-warning"
        on:click="{() => handleClick('back')}">
        {$_('dapps.o-homepage.components.survey.button.goBack')}</button>
      
        </div>
        <div>
          <button
        class="btn transition-all overflow-hidden transform relative bg-primary px-16 text-cpurple"
        on:click="{() => handleClick('next')}" disabled={!isValid}>
        {$_('dapps.o-homepage.components.survey.button.next')}</button>
        </div>
        </div>
    </div>
    