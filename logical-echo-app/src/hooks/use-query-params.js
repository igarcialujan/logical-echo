function useQueryParams() {
    const url = new URL(window.location);

    return {
        get(name) {
            return url.searchParams.get(name)
        },

        set(name, value) {
            url.searchParams.set(name, value);

            window.history.pushState({}, '', url);
        }
    }
}

export default useQueryParams