module.exports = {
    webResult(json) {
        if (json.code == 0) {
            return json.data;
        }
        if (json.code == 302) {
            let url = new URL(json.data);
            let currentSiteLoginUrl = new URL(url.searchParams.get("returnUrl"));
            let currentUrl = window.location.href;
            currentSiteLoginUrl.searchParams.set("returnUrl", currentUrl);
            url.searchParams.set("returnUrl", currentSiteLoginUrl);
            window.location.href = url;
        }
        throw new Error(json.message);
    },
}