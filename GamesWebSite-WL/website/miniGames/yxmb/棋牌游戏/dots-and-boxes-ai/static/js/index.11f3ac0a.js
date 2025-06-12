class e extends HTMLElement{constructor(){super(),this.darkCSS=document.querySelectorAll("link[rel=stylesheet][media*=prefers-color-scheme][media*=dark]"),this.lightCSS=document.querySelectorAll("link[rel=stylesheet][media*=prefers-color-scheme][media*=light]"),this.darkModeMediaQuery=window.matchMedia("(prefers-color-scheme: dark)"),this.darkModeOn=this.darkModeMediaQuery.matches}connectedCallback(){this.lightFocusColor=this.getAttribute("lightFocusColor"),this.darkFocusColor=this.getAttribute("darkFocusColor"),this.setColorAttributes(),this.render(),this.init()}setColorAttributes=()=>{this.lightFocusColor&&this.isHexColor(this.lightFocusColor)&&document.documentElement.style.setProperty("--light-focus-color",this.lightFocusColor),this.darkFocusColor&&this.isHexColor(this.darkFocusColor)&&document.documentElement.style.setProperty("--dark-focus-color",this.darkFocusColor)};init=()=>{this.themeToggler=document.getElementById("themeToggler"),this.initToggler(),this.themeToggler.addEventListener("click",this.toggleTheme),this.darkModeMediaQuery.addEventListener("change",(e=>{this.darkModeOn=e.matches,this.darkModeOn?this.activateDarkMode():this.activateLightMode(),this.updateToggler()}))};isHexColor=e=>/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(e);initToggler=()=>{this.darkModeOn&&!this.themeToggler.checked?this.themeToggler.checked=!0:this.themeToggler.checked&&(this.themeToggler.checked=!1)};updateToggler=()=>{this.darkModeOn&&!this.themeToggler.checked?(this.themeToggler.checked=!0,this.themeToggler.dispatchEvent(new Event("input",{bubbles:!0}))):this.themeToggler.checked&&(this.themeToggler.checked=!1,this.themeToggler.dispatchEvent(new Event("input",{bubbles:!0})))};activateDarkMode=()=>{this.darkModeOn=!0,this.lightModeOn=!1,this.darkCSS.forEach((e=>{e.media="all",e.disabled=!1})),this.lightCSS.forEach((e=>{e.media="not all",e.disabled=!0}))};activateLightMode=()=>{this.darkModeOn=!1,this.lightModeOn=!0,this.lightCSS.forEach((e=>{e.media="all",e.disabled=!1})),this.darkCSS.forEach((e=>{e.media="not all",e.disabled=!0}))};toggleTheme=()=>{this.darkModeOn?this.activateLightMode():this.activateDarkMode()};render=()=>{const e=String.raw;this.innerHTML=e`
      <label for="themeToggler" class="${"_toggler_7b02e2"}">
        <input
          tabindex="0"
          id="themeToggler"
          name="themeToggler"
          type="checkbox"
        />
        <span class="${"_slider_7b02e2"} ${"_round_7b02e2"}">
          <p class="${"_unselectable_7b02e2"}">🌙</p>
          <p class="${"_unselectable_7b02e2"}">🌞</p>
        </span>
      </label>
    `}}customElements.define("theme-toggler",e);
//# sourceMappingURL=index.11f3ac0a.js.map
