<script lang="ts">
    // // Based on sveltekit-theme-switch-example by spences10
    import { themeChange } from 'theme-change';
	import {theme, initTheme, applyTheme} from 'fractils';
    import { onMount } from 'svelte';

	onMount(() => {
		themeChange(false);
        // applyTheme("cupcake")
	});

    let theme_sel: string = "cupcake";

    const onChange = () => {
		applyTheme(theme_sel)
	}

</script>

<div class="mb-8">
    <select

    data-choose-theme
    class="select select-bordered select-primary w-full max-w-3xl text-xl"
    >
      <option value="acid">Acid</option>
      <option value="aqua">Aqua</option>
      <option value="autumn">Autumn</option>
      <option value="black">Black</option>
      <option value="bumblebee">Bumblebee</option>
      <option value="business">Business</option>
      <option value="cmyk">CMYK</option>
      <option value="coffee">Coffee</option>
      <option value="corporate">Corporate</option>
      <option value="cupcake">Cupcake</option>
      <option value="cyberpunk">Cyberpunk</option>
      <option value="dark">Dark</option>
      <option value="dracula">Dracula</option>
      <option value="emerald">Emerald</option>
      <option value="fantasy">Fantasy</option>
      <option value="forest">Forest</option>
      <option value="garden">Garden</option>
      <option value="halloween">Halloween</option>
      <option value="lemonade">Lemonade</option>
      <option value="light">Light</option>
      <option value="lofi">Lofi</option>
      <option value="luxury">Luxury</option>
      <option value="night">Night</option>
      <option value="pastel">Pastel</option>
      <option value="retro">Retro</option>
      <option value="synthwave">Synthwave</option>
      <option value="valentine">Valentine</option>
      <option value="winter">Winter</option>
      <option value="wireframe">Wireframe</option>
    </select>
</div>
