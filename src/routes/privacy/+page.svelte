<script lang="ts">
	import Footer from '$lib/core/components/footer.svelte';
	import { APP_NAME } from '$lib/core/services/app-environment-service';
	import { goBack, Navbar } from '@cloudparker/moldex.js';
</script>

<svelte:head>
	<title>Privacy Policy | {APP_NAME}</title>
</svelte:head>

<div class="">
	<Navbar
		hasLogo
		logoImgSrc="/icons/web/icon-192.png"
		hasTitle
		title={APP_NAME}
		hasSubtitle
		subtitle="Privacy Policy"
		hasBack
		onBack={goBack}
	/>
	<section class="m-4 py-0 md:py-10">
		<div class="m-auto w-full max-w-[800px] p-4 md:p-16 shadow rounded bg-white">
			<div class=" ">
				<h3 class="text-2xl font-bold text-base-800 mb-4">Privacy Policy</h3>
				<p class="text-sm text-base-500 mb-6">Last updated: 01 July 2024</p>

				<p class="text-base-700 mb-4">
					This Privacy Policy describes Our policies and procedures on the collection, use and
					disclosure of Your information when You use the Service and tells You about Your privacy
					rights and how the law protects You.
				</p>

				<p class="text-base-700 mb-4">
					We use Your Personal data to provide and improve the Service. By using the Service, You
					agree to the collection and use of information in accordance with this Privacy Policy.
				</p>

				<h4 class="text-xl font-semibold text-base-800 mb-4">Interpretation and Definitions</h4>

				<h5 class="text-lg font-semibold text-base-800 mb-2">Interpretation</h5>
				<p class="text-base-700 mb-4">
					The words of which the initial letter is capitalized have meanings defined under the
					following conditions. The following definitions shall have the same meaning regardless of
					whether they appear in singular or in plural.
				</p>

				<h5 class="text-lg font-semibold text-base-800 mb-2">Definitions</h5>
				<p class="text-base-700 mb-4">For the purposes of this Privacy Policy:</p>

				<ul class="list-disc list-inside space-y-2 mb-6 text-base-700">
					<li>
						<strong>Account</strong> means a unique account created for You to access our Service or
						parts of our Service.
					</li>
					<li>
						<strong>Company</strong> refers to Cloudparker, Bangalore, referred to as "We", "Us", or
						"Our".
					</li>
					<li>
						<strong>Cookies</strong> are small files placed on Your device that track your browsing history
						for various uses.
					</li>
					<li>
						<strong>Country</strong> refers to: Karnataka, India.
					</li>
					<li>
						<strong>Device</strong> means any device that can access the Service, such as a computer,
						cellphone, or tablet.
					</li>
					<li>
						<strong>Personal Data</strong> is any information that relates to an identified or identifiable
						individual.
					</li>
					<li>
						<strong>Service</strong> refers to the Website.
					</li>
					<li>
						<strong>Service Provider</strong> refers to third-party companies or individuals who process
						data on behalf of the Company.
					</li>
					<li>
						<strong>Third-party Social Media Service</strong> refers to any social network website through
						which a user can log in.
					</li>
					<li>
						<strong>Usage Data</strong> refers to data collected automatically, such as page visit duration
						or browser type.
					</li>
					<li>
						<strong>Website</strong> refers to Cloudparker, accessible at
						<a
							href="https://cashflow.cloudparker.com"
							target="_blank"
							class="text-blue-500 hover:underline">https://cashflow.cloudparker.com</a
						>.
					</li>
					<li>
						<strong>You</strong> refers to the individual accessing or using the Service, or the entity
						on behalf of which the individual is accessing or using the Service.
					</li>
				</ul>

				<h4 class="text-xl font-semibold text-base-800 mb-4">
					Collecting and Using Your Personal Data
				</h4>

				<h5 class="text-lg font-semibold text-base-800 mb-2">Types of Data Collected</h5>
				<h5 class="text-lg font-semibold text-base-800 mb-2">Personal Data</h5>
				<p class="text-base-700 mb-4">
					While using Our Service, We may ask You to provide Us with certain personally identifiable
					information that can be used to contact or identify You. Personally identifiable
					information may include, but is not limited to:
				</p>

				<ul class="list-disc list-inside space-y-2 mb-6 text-base-700">
					<li>Email address</li>
					<li>First name and last name</li>
					<li>Phone number</li>
					<li>Address, State, Province, ZIP/Postal code, City</li>
					<li>Usage Data</li>
				</ul>

				<h5 class="text-lg font-semibold text-base-800 mb-2">Usage Data</h5>
				<p class="text-base-700 mb-4">
					Usage Data is collected automatically when using the Service and may include information
					such as your device's IP address, browser type, pages you visit, and the time spent on
					them.
				</p>

				<h5 class="text-lg font-semibold text-base-800 mb-2">Tracking Technologies and Cookies</h5>
				<p class="text-base-700 mb-4">
					We use Cookies and similar tracking technologies to track activity on Our Service and
					store certain information.
				</p>

				<h5 class="text-lg font-semibold text-base-800 mb-2">Use of Your Personal Data</h5>
				<p class="text-base-700 mb-4">
					The Company may use Personal Data for the following purposes:
				</p>

				<ul class="list-disc list-inside space-y-2 mb-6 text-base-700">
					<li>
						<strong>To provide and maintain our Service</strong>, including to monitor the usage of
						our Service.
					</li>
					<li>
						<strong>To manage Your Account:</strong> To manage Your registration as a user of the Service.
					</li>
					<li>
						<strong>For the performance of a contract:</strong> For services you have purchased or contracted.
					</li>
					<li>
						<strong>To contact You:</strong> By email, phone, or SMS regarding updates, offers, or other
						information.
					</li>
					<li>
						<strong>For business transfers:</strong> In the case of a merger, sale, or acquisition of
						Company assets.
					</li>
				</ul>

				<h5 class="text-lg font-semibold text-base-800 mb-2">Retention of Your Personal Data</h5>
				<p class="text-base-700 mb-4">
					We retain your Personal Data for as long as necessary to fulfill the purposes outlined in
					this Privacy Policy.
				</p>

				<h5 class="text-lg font-semibold text-base-800 mb-2">Security of Your Personal Data</h5>
				<p class="text-base-700 mb-4">
					We strive to use commercially acceptable means to protect your Personal Data, but no
					method of transmission or storage is 100% secure.
				</p>

				<h5 class="text-lg font-semibold text-base-800 mb-2">Contact Us</h5>
				<p class="text-base-700 mb-4">
					If you have any questions about this Privacy Policy, You can contact us:
				</p>

				<ul class="list-disc list-inside space-y-2 text-base-700">
					<li>By email: support@cloudparker.com</li>
				</ul>
			</div>
		</div>
	</section>

	<section class="mt-3">
		<Footer />
	</section>
</div>
ß
