<script lang="ts">
	import { onMount } from "svelte";
	import { getUser } from "../user-service";
	import type { CustomerDataModel } from "../user-types";
	import { IconCircle } from "@cloudparker/moldex.js";
	import { mdiBriefcaseAccount } from "$lib/core/services/app-icons-service";
	import TextUserSubtype from "./text-user-subtype.svelte";
	import TextAttribute from "$lib/attribute/components/text-attribute.svelte";


    type Props ={
        customerId:any
    }

    let {customerId}:Props = $props()
    let customer: CustomerDataModel | null = $state(null);

    async function loadCustomers() {
		if (customerId) {
			customer = await getUser(customerId);
		} else {
			customer = null;
		}
	}

    onMount(() => {
		loadCustomers();
	});

</script>

<div>
    <div class="flex md:flex-row flex-col gap-4">
        <div>
            <IconCircle
                iconPath={mdiBriefcaseAccount}
                iconClassName="  text-primary"
                circleClassName=" "
            />
        </div>
        <div>
            <table>
                <tbody>
                    <tr class="lg:text-lg lg:font-bold font-semibold"
                        ><td>Name</td><td>{customer?.name || '-'}</td></tr
                    >
                    <tr><td>Description</td><td class="text-base-500 text-sm">{customer?.desc || '-'}</td></tr>
                    <tr><td>Email</td><td>{customer?.email || '-'}</td></tr>
                    <tr><td>Phone No</td><td>{customer?.phone || '-'}</td></tr>
                    <tr><td>Type</td><td><TextUserSubtype input={customer?.subtype} /></td></tr>
                    <tr><td>Categori</td><td><TextAttribute input={customer?.categories}/></td> </tr>
                    <tr><td>Address</td><td>{customer?.address || '-'}</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<style>
	td:nth-child(1) {
		color: var(--color-base-400);
		width: 180px;
	}
	td:nth-child(2) {
		color: var(--color-base-500);
		width: 300px;
	}
</style>