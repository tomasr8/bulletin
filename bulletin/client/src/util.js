export const zfill = (num, places) => String(num).padStart(places, "0");

export const isMobileChrome = () => {
    const ua = navigator.userAgent;
    return ua.includes("Android") && ua.includes("Chrome");
}