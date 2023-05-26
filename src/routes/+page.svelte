<script lang="ts">
  import Send from "svelte-material-icons/Send.svelte";
  import ContentCopy from "svelte-material-icons/ContentCopy.svelte";

  let loading = false;

  let chatBox: HTMLInputElement;
  let sendButton: HTMLButtonElement;
  let output: HTMLParagraphElement;

  function lockElements() {
    chatBox.disabled = true;
    sendButton.disabled = true;

    loading = true;
  }

  function unlockElements() {
    chatBox.disabled = false;
    sendButton.disabled = false;

    loading = false;
  }

  async function getResponse() {
    lockElements();
    if (chatBox.value === '') {
      unlockElements();
      return;
    }
    const resp = await fetch('/', {
      method: 'POST',
      body: JSON.stringify({
        message: chatBox.value
      })
    });
    if (!resp.ok) {
      output.innerText = "🤔🤷‍♀️🤷‍♂️🚫💻❌🤢";
      unlockElements();
      return;
    }
    const jsonResp = await resp.json();
    output.innerText = jsonResp['message'];
    unlockElements();
  }

  function copyOutputToClipboard() {
    navigator.clipboard.writeText(output.innerText);
  }

</script>

<form on:submit|preventDefault={getResponse}>
  <div class="w-screen h-screen flex justify-center items-center">
    <div class="w-11/12 md:w-5/12 flex flex-col items-center space-y-2">
        <h1 class="font-black text-4xl">Explained in Emojis</h1>
        <div class="w-full flex flex-row space-x-2">
          <input bind:this={chatBox} class="w-full h-12 p-2 border-2 rounded-full text-center font-semibold" placeholder="What do you want explained in emojis?">
          <button bind:this={sendButton} class="flex justify-center items-center w-12 h-12 p-2 rounded-full bg-blue-500 text-white font-semibold" on:click={getResponse}>
            {#if loading}
              <div class="animate-spin h-5 w-1 bg-amber-400"></div>
            {:else}
              <Send class="w-6 h-6"/>
            {/if}
          </button>
        </div>
        <div class="w-full">
          <p bind:this={output} class="text-center font-semibold text-6xl">😀😀😀</p>
        </div>
        <button class="flex flex-row items-center justify-center border-2 rounded-full px-4 py-2" on:click={copyOutputToClipboard}>
          <p>Copy</p>
          <div class="w-1"></div>
          <ContentCopy></ContentCopy>
        </button>
    </div>
  </div>
</form>

