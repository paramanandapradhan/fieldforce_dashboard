<script lang="ts">
	import Footer from '$lib/core/components/footer.svelte';
	import { APP_NAME } from '$lib/core/services/app-environment-service';
	import { goBack, Navbar } from '@cloudparker/moldex.js';
</script>

<svelte:head>
	<title>Terms and Conditions | {APP_NAME}</title>
</svelte:head>

<div class="">
	<Navbar
		hasLogo
		logoImgSrc="/icons/web/icon-192.png"
		hasTitle
		title={APP_NAME}
		hasSubtitle
		subtitle="Terms and Conditions"
		hasBack
		onBack={goBack}
	/>
	<section class="m-4 py-0 md:py-10">
		<div class="m-auto w-full max-w-[800px] p-4 md:p-16 shadow rounded bg-white">
			<div class=" ">
				<h2 class="text-2xl font-bold mb-3 text-base-800">Terms and Conditions</h2>
				<p class="text-base-400 text-sm mb-8">Last updated: 01 July 2024</p>

				<p class="mb-4 text-base-700">
					These terms and conditions outline the rules and regulations for the use of
					Cashflow&#x27;s Website, located at https://cashflow.cloudparker.com.
				</p>
				<p class="mb-4 text-base-700">
					By accessing this website we assume you accept these terms and conditions. Do not continue
					to use https://cashflow.cloudparker.com if you do not agree to take all of the terms and
					conditions stated on this page.
				</p>
				<p class="mb-4 text-base-700">
					The following terminology applies to these Terms and Conditions, Privacy Statement and
					Disclaimer Notice and all Agreements: &quot;Client&quot;, &quot;You&quot; and
					&quot;Your&quot; refers to you, the person log on this website and compliant to the
					Company’s terms and conditions. &quot;The Company&quot;, &quot;Ourselves&quot;,
					&quot;We&quot;, &quot;Our&quot; and &quot;Us&quot;, refers to our Company.
				</p>

				<h3 class="text-xl font-semibold mb-4 text-base-800">Cookies</h3>
				<p class="mb-4 text-base-700">
					We employ the use of cookies. By accessing https://cashflow.cloudparker.com, you agreed to
					use cookies in agreement with the Cashflow&#x27;s Privacy Policy.
				</p>

				<h3 class="text-xl font-semibold mb-4 text-base-800">License</h3>
				<p class="mb-4 text-base-700">
					Unless otherwise stated, Cashflow and/or its licensors own the intellectual property
					rights for all material on https://cashflow.cloudparker.com. All intellectual property
					rights are reserved.
				</p>

				<p class="mb-4 text-base-700">You must not:</p>
				<ul class="list-disc list-inside mb-4 text-base-700">
					<li>Republish material from https://cashflow.cloudparker.com</li>
					<li>Sell, rent or sub-license material from https://cashflow.cloudparker.com</li>
					<li>Reproduce, duplicate or copy material from https://cashflow.cloudparker.com</li>
					<li>Redistribute content from https://cashflow.cloudparker.com</li>
				</ul>

				<h3 class="text-xl font-semibold mb-4 text-base-800">Hyperlinking to our Content</h3>
				<p class="mb-4 text-base-700">
					The following organizations may link to our Website without prior written approval:
				</p>
				<ul class="list-disc list-inside mb-4 text-base-700">
					<li>Government agencies;</li>
					<li>Search engines;</li>
					<li>News organizations;</li>
				</ul>

				<h3 class="text-xl font-semibold mb-4 text-base-800">iFrames</h3>
				<p class="mb-4 text-base-700">
					Without prior approval and written permission, you may not create frames around our
					Webpages that alter in any way the visual presentation or appearance of our Website.
				</p>

				<h3 class="text-xl font-semibold mb-4 text-base-800">Content Liability</h3>
				<p class="mb-4 text-base-700">
					We shall not be hold responsible for any content that appears on your Website. You agree
					to protect and defend us against all claims that is rising on your Website.
				</p>

				<h3 class="text-xl font-semibold mb-4 text-base-800">Your Privacy</h3>
				<p class="mb-4 text-base-700">Please read our Privacy Policy.</p>

				<h3 class="text-xl font-semibold mb-4 text-base-800">Disclaimer</h3>
				<p class="mb-4 text-base-700">
					To the maximum extent permitted by applicable law, we exclude all representations,
					warranties, and conditions relating to our website and the use of this website. Nothing in
					this disclaimer will:
				</p>
				<ul class="list-disc list-inside mb-4 text-base-700">
					<li>limit or exclude our or your liability for death or personal injury;</li>
					<li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
					<li>
						limit any of our or your liabilities in any way that is not permitted under applicable
						law;
					</li>
					<li>
						exclude any of our or your liabilities that may not be excluded under applicable law.
					</li>
				</ul>
			</div>
		</div>
	</section>

	<section class="mt-3">
		<Footer />
	</section>
</div>
