const { fetch: origFetch } = window;
window.fetch = async (...args) => {
    console.log('fetch called with args:', args)
}